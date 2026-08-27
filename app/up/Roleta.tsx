"use client";

import type { RefObject } from "react";
import { ROLETA, type PremioRoleta } from "@/lib/constants";

/**
 * O desenho da roleta. Só desenha — quem gira é o RoletaClient, escrevendo o
 * transform direto em `rodaRef`.
 *
 * Por que SVG e não canvas ou uma imagem PNG rotacionada:
 * - o texto é texto (leitor de tela lê os prêmios, o zoom não borra);
 * - o gomo sorteado precisa acender no fim, e mudar um atributo de um <path>
 *   é mais barato que redesenhar um canvas;
 * - nenhum asset novo para servir, então a página abre com a roda pronta.
 *
 * Geometria: o ângulo 0 é o PONTEIRO, às 12h, e cresce no sentido horário —
 * as mesmas coordenadas do sorteio no cliente. `paraSvg` faz a conversão para
 * o sistema do SVG (0 às 3h), que é o único lugar onde os -90 aparecem.
 */

const CX = 200;
const CY = 200;
/** Raio da área dos gomos. O aro fica entre este raio e R_ARO_EXT. */
const R = 168;
const R_ARO_EXT = 190;
/** Raio do miolo — é o botão de girar. */
const R_MIOLO = 62;
/** Entrelinha do texto dos gomos. */
const LINHA = 17;

const N = ROLETA.premios.length;
const PASSO = 360 / N;

function paraSvg(grausDoTopo: number) {
  return ((grausDoTopo - 90) * Math.PI) / 180;
}

function ponto(grausDoTopo: number, raio: number) {
  const a = paraSvg(grausDoTopo);
  return [CX + raio * Math.cos(a), CY + raio * Math.sin(a)] as const;
}

/** Fatia de pizza do gomo `i`, centrada no ângulo `i * PASSO`. */
function caminhoGomo(i: number) {
  const de = i * PASSO - PASSO / 2;
  const ate = i * PASSO + PASSO / 2;
  const [x1, y1] = ponto(de, R);
  const [x2, y2] = ponto(ate, R);
  // PASSO < 180 em qualquer número de gomos ≥ 3, então o arco é sempre o menor.
  return `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} Z`;
}

const FUNDO_GOMO: Record<PremioRoleta["tom"], string> = {
  oferta: "url(#gomoOferta)",
  premio: "url(#gomoPremio)",
  nada: "url(#gomoNada)",
};

type Props = {
  /** Recebe o transform de rotação a cada frame. */
  rodaRef: RefObject<SVGGElement | null>;
  /** Índice do gomo sorteado, já parado. -1 enquanto não há resultado. */
  vencedor: number;
  girando: boolean;
  travada: boolean;
  onGirar: () => void;
};

export default function Roleta({ rodaRef, vencedor, girando, travada, onGirar }: Props) {
  const inerte = girando || travada;

  return (
    <div className="relative w-full max-w-[min(88vw,440px)] aspect-square">
      {/* O botão vem ANTES do SVG de propósito: assim ele é `peer` do miolo e
          o hover/foco dele pode acender o desenho, que sozinho não reage.
          Fica por cima pelo z-index, não pela ordem. */}
      <button
        type="button"
        onClick={onGirar}
        disabled={inerte}
        aria-label="Girar a roleta"
        className="peer absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2
                   rounded-full bg-transparent focus-visible:outline-2 focus-visible:outline-offset-4
                   focus-visible:outline-limao disabled:cursor-default"
        style={{ width: "31%", height: "31%", cursor: inerte ? "default" : "pointer" }}
      />

      <svg
        viewBox="0 0 400 400"
        className="w-full h-full overflow-visible"
        role="img"
        aria-label={`Roleta de prêmios CarboZé com ${N} opções: ${ROLETA.premios
          .map((p) => p.linhas.join(" "))
          .join(", ")}.`}
      >
        <defs>
          <radialGradient id="gomoOferta" cx="50%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#1c2416" />
            <stop offset="100%" stopColor="#080b06" />
          </radialGradient>
          <radialGradient id="gomoPremio" cx="50%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#161b18" />
            <stop offset="100%" stopColor="#070907" />
          </radialGradient>
          <radialGradient id="gomoNada" cx="50%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#231414" />
            <stop offset="100%" stopColor="#0a0606" />
          </radialGradient>
          <linearGradient id="aro" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a3f36" />
            <stop offset="45%" stopColor="#0e120c" />
            <stop offset="100%" stopColor="#2a2f26" />
          </linearGradient>
          <radialGradient id="miolo" cx="50%" cy="28%" r="75%">
            <stop offset="0%" stopColor="#242a20" />
            <stop offset="100%" stopColor="#0a0d08" />
          </radialGradient>

          {/* Brilho neon. Usado no ponteiro, nas divisórias e no gomo vencedor. */}
          <filter id="neon" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="neonForte" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Halo por trás da roda inteira */}
        <circle cx={CX} cy={CY} r={R_ARO_EXT} fill="#a9da00" opacity="0.16" filter="url(#neonForte)" />

        {/* ─── A roda. Tudo aqui dentro gira junto. ─────────────────────── */}
        <g
          ref={rodaRef}
          style={{
            // `fill-box` + `center` em vez de "200px 200px": no Safari o
            // transform-origin em px de um <g> é medido a partir do viewport
            // do SVG, não do próprio elemento, e a roda gira fora do eixo.
            transformBox: "fill-box",
            transformOrigin: "center",
            willChange: "transform",
          }}
        >
          <circle cx={CX} cy={CY} r={R + 2} fill="#050704" />

          {ROLETA.premios.map((p, i) => {
            const ganhou = i === vencedor;
            const perdeu = vencedor >= 0 && !ganhou;
            return (
              <g key={p.id}>
                <path
                  d={caminhoGomo(i)}
                  fill={FUNDO_GOMO[p.tom]}
                  stroke="#a9da00"
                  strokeWidth={ganhou ? 3.5 : 1.4}
                  strokeOpacity={ganhou ? 1 : perdeu ? 0.2 : 0.55}
                  style={{ transition: "stroke-width .35s ease, stroke-opacity .35s ease" }}
                  filter={ganhou ? "url(#neon)" : undefined}
                />
                {/* O gomo sorteado acende e os outros escurecem. Um sem o outro
                    não resolve: só acender some no fundo já claro do desenho,
                    só escurecer deixa o resultado parecendo um bug de render. */}
                <path
                  d={caminhoGomo(i)}
                  fill={ganhou ? (p.tom === "nada" ? "#ff2d2d" : "#a9da00") : "#000000"}
                  opacity={ganhou ? 0.22 : perdeu ? 0.55 : 0}
                  style={{ transition: "opacity .45s ease" }}
                  pointerEvents="none"
                />
              </g>
            );
          })}

          {/* Textos dos gomos. Cada grupo roda para o seu setor e o texto sai
              radial, lendo do miolo para a borda — igual às roletas físicas. */}
          {ROLETA.premios.map((p, i) => {
            const linhas = p.linhas;
            const angulo = i * PASSO;
            // Raio da 1ª linha. Recua conforme o número de linhas, para o bloco
            // ficar sempre centrado na parte larga do gomo.
            // O gomo afunila em direção ao miolo: quanto mais fundo a linha,
            // menos largura ela tem. Afastar o bloco da borda em 22 (e não em
            // 26) tira a linha mais interna da parte estreita, onde a maior
            // legenda encostava no miolo.
            const raio = R - 22 - (linhas.length - 1) * 6;

            // Gomo na metade de baixo: girar o texto junto com o setor o
            // deixaria de ponta-cabeça. Rodando 180° a menos e escrevendo do
            // outro lado do centro, ele cai no mesmo setor já legível — o
            // preço é a leitura empilhar para fora em vez de para dentro.
            const deCabecaParaBaixo = angulo > 90 && angulo < 270;
            const giro = deCabecaParaBaixo ? angulo - 180 : angulo;
            const y0 = deCabecaParaBaixo
              ? CY + raio - LINHA * (linhas.length - 1)
              : CY - raio;

            return (
              <g key={p.id} transform={`rotate(${giro} ${CX} ${CY})`}>
                <text
                  x={CX}
                  y={y0}
                  textAnchor="middle"
                  style={{
                    fontFamily: "var(--font-basement), sans-serif",
                    fontWeight: 800,
                    letterSpacing: "0.02em",
                  }}
                >
                  {linhas.map((linha, j) => (
                    <tspan
                      key={linha}
                      x={CX}
                      dy={j === 0 ? 0 : LINHA}
                      fontSize={j === p.destaque ? 17 : 13}
                      fill={
                        j === p.destaque
                          ? p.tom === "nada"
                            ? "#ff4d4d"
                            : "#a9da00"
                          : "#ffffff"
                      }
                    >
                      {linha}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}

          {/* Aro externo com os pinos. O número de pinos é o mesmo que o áudio
              usa para o clique — o que se ouve bate com o que passa. */}
          <circle
            cx={CX}
            cy={CY}
            r={(R + R_ARO_EXT) / 2}
            fill="none"
            stroke="url(#aro)"
            strokeWidth={R_ARO_EXT - R}
          />
          <circle cx={CX} cy={CY} r={R_ARO_EXT} fill="none" stroke="#a9da00" strokeWidth="1.6" strokeOpacity="0.5" />
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#a9da00" strokeWidth="1.6" strokeOpacity="0.5" />

          {Array.from({ length: ROLETA.pinos }, (_, i) => {
            const [x, y] = ponto((360 / ROLETA.pinos) * i, (R + R_ARO_EXT) / 2);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="#c9f000"
                className={girando ? "" : "roleta-pino"}
                style={{ animationDelay: `${(i * 90) % 1200}ms` }}
              />
            );
          })}
        </g>

        {/* ─── Parado: ponteiro e miolo não giram ───────────────────────── */}

        {/* Ponteiro às 12h, apontando para dentro */}
        <g filter="url(#neonForte)">
          <path d="M 200 62 L 178 24 L 222 24 Z" fill="#a9da00" />
          <path d="M 200 54 L 186 30 L 214 30 Z" fill="#eaffa0" opacity="0.9" />
        </g>

        {/* Miolo = botão. <foreignObject> traria um botão HTML de graça, mas
            ele não escala junto com o viewBox no Safari; texto SVG escala. */}
        <g
          className={`pointer-events-none origin-center transition-transform duration-200
                      ${inerte ? "" : "roleta-miolo peer-hover:scale-[1.04] peer-active:scale-95"}`}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <circle cx={CX} cy={CY} r={R_MIOLO + 6} fill="#050704" />
          <circle
            cx={CX}
            cy={CY}
            r={R_MIOLO}
            fill="url(#miolo)"
            stroke="#a9da00"
            strokeWidth="2.5"
            strokeOpacity={girando ? 0.45 : 1}
            filter={girando ? undefined : "url(#neon)"}
          />
          <text
            x={CX}
            y={CY - 6}
            textAnchor="middle"
            style={{ fontFamily: "var(--font-basement), sans-serif", fontWeight: 800 }}
            fontSize="26"
            fill="#ffffff"
          >
            GIRAR
          </text>
          <text
            x={CX}
            y={CY + 20}
            textAnchor="middle"
            style={{ fontFamily: "var(--font-basement), sans-serif", fontWeight: 800 }}
            fontSize="22"
            fill="#a9da00"
          >
            ROLETA
          </text>
        </g>
      </svg>
    </div>
  );
}
