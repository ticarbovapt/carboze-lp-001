"use client";

import type { RefObject } from "react";
import { ROLETA, type PremioRoleta } from "@/lib/constants";

/**
 * O desenho da roleta. Só desenha — quem gira é o RoletaClient, escrevendo o
 * transform direto em `rodaRef`.
 *
 * Por que SVG e não canvas ou uma imagem única rotacionada:
 * - o gomo sorteado precisa acender e os outros apagar no fim, e mudar um
 *   atributo de um <path> é mais barato que redesenhar um canvas;
 * - as artes entram como <image> recortada por gomo, então trocar um prêmio é
 *   trocar um arquivo — o desenho não é remontado.
 *
 * Geometria: o ângulo 0 é o PONTEIRO, às 12h, e cresce no sentido horário —
 * as mesmas coordenadas do sorteio no cliente. `paraSvg` faz a conversão para
 * o sistema do SVG (0 às 3h), que é o único lugar onde os -90 aparecem.
 *
 * O viewBox é mais alto que largo (400×452) para caber o ponteiro ACIMA da
 * roda, sem encostar nela. Espremer o ponteiro dentro de um quadrado exigiria
 * encolher a roda; a faixa extra em cima sai mais barata.
 */

const LARGURA = 400;
const ALTURA = 452;
const CX = 200;
/** Centro da roda, empurrado para baixo pela faixa do ponteiro. */
const CY = 252;
/** Raio da área dos gomos. O aro fica entre este raio e R_ARO_EXT. */
const R = 168;
const R_ARO_EXT = 190;
/**
 * Raio do eixo central — só a tampa que arremata as cinco pontas.
 *
 * Era aqui que ficava o botão "GIRAR ROLETA", e ele precisava de ~54 de raio.
 * Só que o conteúdo das artes desce até 13% do raio: o "20% OFF" da arte do
 * kit vive entre 13% e 30%, e qualquer miolo grande o cobria. Como o texto é
 * a oferta, quem saiu foi o botão — virou CTA abaixo da roda, que ainda por
 * cima é área de toque de verdade no celular.
 */
const R_EIXO = 19;

/** Lado da arte (ela é quadrada). Ponta no eixo, borda de fora colada no aro. */
const LADO_ARTE = R - 4;

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
};

export default function Roleta({ rodaRef, vencedor, girando }: Props) {
  // O pulso é a isca: ele chama enquanto a roda espera e comemora quando o
  // prêmio sai. Durante o giro ele sai de cena — animar `filter` a cada frame
  // sobre uma roda já girando custa repaint e engasga o giro, que é o que a
  // pessoa está olhando.
  const pulsando = !girando;

  return (
    <div
      className="roleta-caixa"
      style={{ aspectRatio: `${LARGURA} / ${ALTURA}` }}
    >
      <svg
        viewBox={`0 0 ${LARGURA} ${ALTURA}`}
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

          {/* Um recorte por gomo: a arte é quadrada e transborda a fatia, então
              é o clip que dá a ela a forma do gomo. */}
          {ROLETA.premios.map((p, i) => (
            <clipPath key={p.id} id={`gomo-${p.id}`}>
              <path d={caminhoGomo(i)} />
            </clipPath>
          ))}
        </defs>

        {/* Halo pulsando por trás da roda inteira */}
        <circle
          cx={CX}
          cy={CY}
          r={R_ARO_EXT}
          fill="#a9da00"
          filter="url(#neonForte)"
          className={pulsando ? "roleta-halo" : ""}
          opacity={pulsando ? undefined : 0.18}
        />

        {/* ─── A roda. Tudo aqui dentro gira junto. ─────────────────────── */}
        <g
          ref={rodaRef}
          style={{
            // `fill-box` + `center` em vez de coordenadas em px: no Safari o
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
                <path d={caminhoGomo(i)} fill={FUNDO_GOMO[p.tom]} />

                <g clipPath={`url(#gomo-${p.id})`}>
                  <image
                    href={p.arte}
                    // Ponta no centro da roda: assim a cunha da arte nasce no
                    // mesmo vértice do gomo e encaixa sem o clipe cortar nada.
                    x={CX - LADO_ARTE / 2}
                    y={CY - LADO_ARTE}
                    width={LADO_ARTE}
                    height={LADO_ARTE}
                    transform={`rotate(${i * PASSO} ${CX} ${CY})`}
                  />
                </g>

                <path
                  d={caminhoGomo(i)}
                  fill="none"
                  stroke="#c2f000"
                  strokeWidth={ganhou ? 3.5 : 1.4}
                  strokeOpacity={ganhou ? 1 : perdeu ? 0.2 : 0.6}
                  style={{ transition: "stroke-width .35s ease, stroke-opacity .35s ease" }}
                  filter={ganhou ? "url(#neon)" : undefined}
                />

                {/* O gomo sorteado acende e os outros escurecem. Um sem o outro
                    não resolve: só acender some no meio de cinco artes já
                    coloridas, só escurecer parece bug de render. */}
                <path
                  d={caminhoGomo(i)}
                  fill={ganhou ? (p.tom === "nada" ? "#ff2d2d" : "#c2f000") : "#000000"}
                  opacity={ganhou ? 0.16 : perdeu ? 0.62 : 0}
                  style={{ transition: "opacity .45s ease" }}
                  pointerEvents="none"
                  clipPath={`url(#gomo-${p.id})`}
                />
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
          <circle
            cx={CX}
            cy={CY}
            r={R_ARO_EXT}
            fill="none"
            strokeWidth="2"
            className={pulsando ? "roleta-aro" : ""}
            stroke={pulsando ? undefined : "#a9da00"}
            strokeOpacity={pulsando ? undefined : 0.55}
          />
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            strokeWidth="2"
            className={pulsando ? "roleta-aro" : ""}
            stroke={pulsando ? undefined : "#a9da00"}
            strokeOpacity={pulsando ? undefined : 0.55}
          />

          {Array.from({ length: ROLETA.pinos }, (_, i) => {
            const [x, y] = ponto((360 / ROLETA.pinos) * i, (R + R_ARO_EXT) / 2);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4.5"
                fill="#c9f000"
                className={pulsando ? "roleta-pino" : ""}
                opacity={pulsando ? undefined : 0.75}
                // Atraso escalonado: as lâmpadas correm a volta em vez de
                // piscarem juntas, que é o que uma roleta de feira faz.
                style={{ animationDelay: `${(i * 1400) / ROLETA.pinos}ms` }}
              />
            );
          })}
        </g>

        {/* ─── Parado: ponteiro e miolo não giram ───────────────────────── */}

        {/* Ponteiro FORA da roda, apontando para ela de cima. A ponta para em
            y=56, e a roda começa em y=62 — 6px de folga, para ele apontar sem
            encostar. */}
        <g className={pulsando ? "roleta-ponteiro" : ""} filter="url(#neonForte)">
          <path d="M 200 56 L 173 10 L 227 10 Z" fill="#c2f000" />
          <path d="M 200 44 L 184 17 L 216 17 Z" fill="#f2ffb0" />
          <rect x="168" y="4" width="64" height="9" rx="4.5" fill="#c2f000" />
        </g>

        {/* Eixo: arremata as cinco pontas que se encontram no centro. */}
        <g pointerEvents="none">
          <circle cx={CX} cy={CY} r={R_EIXO + 3} fill="#050704" />
          <circle
            cx={CX}
            cy={CY}
            r={R_EIXO}
            fill="url(#miolo)"
            stroke="#c2f000"
            strokeWidth="2.5"
            filter="url(#neon)"
          />
          <circle cx={CX} cy={CY} r={R_EIXO / 2.6} fill="#c2f000" opacity="0.85" />
        </g>

      </svg>
    </div>
  );
}
