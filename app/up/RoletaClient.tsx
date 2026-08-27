"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Roleta from "./Roleta";
import { ROLETA, resgateWhatsApp } from "@/lib/constants";
import {
  gravarGiroRoleta,
  lerGiroRoleta,
  lerProduto,
  limparFunil,
  marcarUpsellResolvido,
  type ProdutoFunil,
} from "@/lib/funnelState";
import { track } from "@/lib/metaPixel";
import {
  definirMudo,
  estaMudo,
  iniciarAudio,
  lerPreferenciaMudo,
  tique,
  tocarDerrota,
  tocarGiro,
  tocarVitoria,
} from "@/lib/roletaAudio";

const PREMIOS = ROLETA.premios;
const PASSO = 360 / PREMIOS.length;
/** Um pino a cada tantos graus. Define o ritmo do clique. */
const PASSO_PINO = 360 / ROLETA.pinos;

/** Graus que a roda passa do alvo antes de voltar. É o "assentar" no eixo. */
const SOBRA = 3.2;
const ASSENTO_MS = 520;

function prefereMenosMovimento() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Aleatório em [0,1). Usa o gerador criptográfico: o resultado vale prêmio. */
function acaso() {
  try {
    const b = new Uint32Array(1);
    crypto.getRandomValues(b);
    return b[0] / 4294967296;
  } catch {
    return Math.random();
  }
}

/**
 * Sorteia o gomo por peso. Devolve o índice em ROLETA.premios.
 * Com todos os pesos zerados não há sorteio possível — cai no gomo vazio, que
 * é o único desfecho que não promete nada a ninguém.
 */
function sortear() {
  const total = PREMIOS.reduce((s, p) => s + Math.max(0, p.peso), 0);
  if (total <= 0) {
    const vazio = PREMIOS.findIndex((p) => p.tom === "nada");
    return vazio >= 0 ? vazio : 0;
  }
  let r = acaso() * total;
  for (let i = 0; i < PREMIOS.length; i++) {
    r -= Math.max(0, PREMIOS[i].peso);
    if (r < 0) return i;
  }
  return PREMIOS.length - 1;
}

/** Código do giro. Sem O/0, I/1, S/5 e B/8 — vai ser ditado no WhatsApp. */
function gerarCodigo() {
  const alfabeto = "ACDEFGHJKLMNPQRTUVWXYZ2346789";
  let s = "";
  for (let i = 0; i < 5; i++) {
    s += alfabeto[Math.floor(acaso() * alfabeto.length)];
  }
  return `CZ-${s}`;
}

/**
 * Rotação que deixa o gomo `i` sob o ponteiro.
 *
 * O gomo `i` nasce centrado em `i * PASSO` (0 = ponteiro, sentido horário).
 * Girar a roda em R leva esse centro para `i * PASSO + R`, e queremos isso em
 * 0 (mod 360) — daí o `- i * PASSO`. As voltas inteiras só dão espetáculo.
 *
 * O desvio não é enfeite: parar sempre no centro do gomo entrega o truque em
 * dois giros. Fica dentro do gomo com 8° de folga para não encostar na
 * divisória, onde o prêmio ficaria ambíguo aos olhos de quem assiste.
 */
function anguloAlvo(i: number) {
  const voltas =
    ROLETA.voltasMin + Math.floor(acaso() * (ROLETA.voltasMax - ROLETA.voltasMin + 1));
  const desvio = (acaso() - 0.5) * (PASSO - 16);
  return 360 * voltas - i * PASSO + desvio;
}

type Fase = "carregando" | "pronto" | "girando" | "resultado";

export default function RoletaClient() {
  const [fase, setFase] = useState<Fase>("carregando");
  const [vencedor, setVencedor] = useState(-1);
  const [codigo, setCodigo] = useState("");
  const [produto, setProduto] = useState<ProdutoFunil | null>(null);
  const [semSom, setSemSom] = useState(false);

  const rodaRef = useRef<SVGGElement | null>(null);
  const cartaoRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef(0);
  /** Ângulo atual da roda, em graus. Fora do state: muda 60x por segundo. */
  const anguloRef = useRef(0);

  const aplicar = useCallback((graus: number) => {
    anguloRef.current = graus;
    if (rodaRef.current) rodaRef.current.style.transform = `rotate(${graus}deg)`;
  }, []);

  /**
   * Reaplica o ângulo sempre que a fase muda de rendering.
   *
   * Necessário porque quem já girou tem o ângulo definido ainda em "carregando",
   * quando a roda nem está no DOM — `aplicar` escreve em `rodaRef.current` nulo
   * e o transform se perde. Sem isto, quem volta à página vê a roda parada no
   * primeiro gomo enquanto o cartão anuncia outro prêmio.
   *
   * useLayoutEffect, não useEffect: com este a correção acontece antes da
   * pintura, então a roda nunca chega a aparecer na posição errada.
   */
  useLayoutEffect(() => {
    if (rodaRef.current) {
      rodaRef.current.style.transform = `rotate(${anguloRef.current}deg)`;
    }
  }, [fase]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    // `?reset=1` zera o funil e recarrega limpo. Só para teste: sem isso,
    // reconferir a roleta exigiria limpar o localStorage a cada rodada.
    if (query.get("reset") === "1") {
      limparFunil();
      window.location.replace("/up");
      return;
    }

    setSemSom(lerPreferenciaMudo());
    // `?p=` deixa o snippet pós-compra informar o produto; senão vale o clique
    // gravado na LP.
    const daUrl = query.get("p");
    setProduto(daUrl === "sache" || daUrl === "pack" ? daUrl : lerProduto());

    // Um giro por navegador. Quem volta reencontra o que tirou e o código —
    // o prêmio não pode sumir com um F5.
    const anterior = lerGiroRoleta();
    if (anterior) {
      const i = PREMIOS.findIndex((p) => p.id === anterior.premio);
      if (i >= 0) {
        setVencedor(i);
        setCodigo(anterior.codigo);
        // Posiciona a roda parada no gomo certo, sem animação nenhuma.
        aplicar(-i * PASSO);
        setFase("resultado");
        return;
      }
    }

    setFase("pronto");
  }, [aplicar]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const girar = useCallback(() => {
    if (fase !== "pronto") return;

    // Precisa acontecer DENTRO do clique: fora dele o navegador recusa criar
    // o AudioContext e o giro sai mudo.
    iniciarAudio();
    tocarGiro();

    const i = sortear();
    const cod = gerarCodigo();
    const premio = PREMIOS[i];

    setFase("girando");
    track("ViewContent", { content_name: `roleta:${premio.id}`, content_type: "product" });

    // Quem pediu menos movimento não fica sem resultado — fica sem o giro
    // longo. Uma volta rápida e a roda para no mesmo gomo.
    const reduzido = prefereMenosMovimento();
    const duracao = reduzido ? 900 : ROLETA.duracaoGiroMs;
    const alvo = reduzido ? 360 - i * PASSO : anguloAlvo(i);
    const alvoComSobra = alvo + SOBRA;
    const inicio = anguloRef.current;

    const t0 = performance.now();
    let ultimoPino = Math.floor(inicio / PASSO_PINO);
    let ultimoAngulo = inicio;
    let ultimoTempo = t0;

    function frame(agora: number) {
      const t = Math.min(1, (agora - t0) / duracao);
      let angulo: number;

      if (t < 1) {
        // easeOutQuart: sai rápido e passa a maior parte do tempo desacelerando,
        // que é o perfil de uma roda pesada no atrito do eixo.
        angulo = inicio + (alvoComSobra - inicio) * (1 - Math.pow(1 - t, 4));
      } else {
        // Assentamento: a roda passou do alvo e volta oscilando até parar.
        // Em u=0 vale exatamente alvoComSobra, então emenda sem salto.
        const u = Math.min(1, (agora - t0 - duracao) / ASSENTO_MS);
        angulo = alvo + SOBRA * Math.cos(2 * Math.PI * u) * (1 - u);
      }

      // Um clique por pino que cruza o ponteiro, com o volume caindo junto da
      // velocidade. É daqui que vem a sensação de peso: no fim os cliques
      // ficam espaçados e fracos sozinhos, sem nenhuma curva de volume à parte.
      const dt = Math.max(1, agora - ultimoTempo);
      const vel = Math.abs(angulo - ultimoAngulo) / (dt / 1000);
      const pino = Math.floor(angulo / PASSO_PINO);
      if (pino !== ultimoPino) {
        tique(Math.sqrt(Math.min(1, vel / 1100)));
        ultimoPino = pino;
      }
      ultimoAngulo = angulo;
      ultimoTempo = agora;

      aplicar(angulo);

      if (agora - t0 < duracao + ASSENTO_MS) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }

      aplicar(alvo);
      setVencedor(i);
      setCodigo(cod);
      gravarGiroRoleta(premio.id, cod);
      setFase("resultado");

      if (premio.tom === "nada") {
        tocarDerrota();
      } else {
        tocarVitoria();
        festa(premio.tom === "oferta");
      }
    }

    rafRef.current = requestAnimationFrame(frame);
  }, [fase, aplicar]);

  const alternarSom = useCallback(() => {
    iniciarAudio();
    definirMudo(!estaMudo());
    setSemSom(estaMudo());
  }, []);

  // Em tela de celular o cartão nasce abaixo da dobra: sem isto o giro termina
  // e a pessoa fica olhando a roda parada, sem saber que o resultado saiu.
  // Só depois de um respiro, para o confete ser visto antes da rolagem.
  useEffect(() => {
    if (fase !== "resultado" || !cartaoRef.current) return;
    const t = setTimeout(() => {
      cartaoRef.current?.scrollIntoView({
        behavior: prefereMenosMovimento() ? "auto" : "smooth",
        block: "center",
      });
    }, 900);
    return () => clearTimeout(t);
  }, [fase]);

  const premio = vencedor >= 0 ? PREMIOS[vencedor] : null;
  // O gomo desenhado é o kit de 5 frascos, mas os 20% valem para os dois
  // produtos. Casa com o que a pessoa comprou; sem essa informação, carro.
  const kit = produto === "sache" ? ROLETA.checkout.moto : ROLETA.checkout.carro;
  const outroKit = produto === "sache" ? ROLETA.checkout.carro : ROLETA.checkout.moto;

  if (fase === "carregando") {
    // Não renderiza a roda antes de saber se esta pessoa já girou: o gomo
    // vencedor apareceria por um frame no lugar errado.
    return <div className="w-full max-w-[min(88vw,440px)] aspect-square" aria-hidden="true" />;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <Roleta
        rodaRef={rodaRef}
        vencedor={fase === "resultado" ? vencedor : -1}
        girando={fase === "girando"}
        travada={fase === "resultado"}
        onGirar={girar}
      />

      <button
        type="button"
        onClick={alternarSom}
        aria-pressed={semSom}
        className="mt-5 flex items-center gap-2 rounded-full border border-white/15 px-4 py-2
                   font-[family-name:var(--font-archivo)] text-white/50 text-xs
                   hover:text-white hover:border-white/35 transition-colors"
      >
        {semSom ? <IconeMudo /> : <IconeSom />}
        {semSom ? "Som desligado" : "Som ligado"}
      </button>

      {fase === "pronto" && (
        <p className="mt-4 font-[family-name:var(--font-archivo)] text-white/45 text-xs text-center">
          Um giro por cliente. Toque no centro da roleta para começar.
        </p>
      )}

      {/* Resultado. `aria-live` porque o desfecho de uma animação não chega a
          quem usa leitor de tela — o gomo aceso não é anunciado. */}
      <div aria-live="polite" className="w-full">
        {fase === "resultado" && premio && (
          <div
            ref={cartaoRef}
            className="popup-in mt-8 w-full max-w-md mx-auto rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-sm"
          >
            <p
              className={`font-[family-name:var(--font-basement)] font-bold uppercase text-[11px] tracking-[0.18em] ${
                premio.tom === "nada" ? "text-red-400" : "text-limao"
              }`}
            >
              {premio.tom === "nada" ? "A roda parou" : "Você ganhou"}
            </p>

            <h2 className="mt-2 font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-2xl leading-tight">
              {premio.titulo}
            </h2>

            <p className="mt-3 font-[family-name:var(--font-archivo)] text-white/60 text-sm leading-relaxed">
              {premio.descricao}
            </p>

            {premio.resgate === "whatsapp" ? (
              <>
                <div className="mt-5 rounded-xl border border-limao/25 bg-limao/[0.06] px-4 py-3 text-center">
                  <p className="font-[family-name:var(--font-archivo)] text-white/45 text-[11px] uppercase tracking-wider">
                    Código do seu giro
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-basement)] font-extrabold text-limao text-2xl tracking-[0.12em] tabular-nums">
                    {codigo}
                  </p>
                </div>

                <a
                  href={resgateWhatsApp(premio.titulo, codigo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("Lead", { content_name: `roleta:${premio.id}` })}
                  className="cta-shine mt-4 block w-full rounded-2xl bg-limao px-5 py-4 text-center
                             font-[family-name:var(--font-basement)] font-extrabold uppercase
                             text-verde-escuro text-base hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  {premio.ctaLabel}
                </a>

                <p className="mt-3 font-[family-name:var(--font-archivo)] text-white/35 text-xs text-center">
                  Guarde o código: ele é o comprovante do seu giro.
                </p>
              </>
            ) : (
              <>
                <a
                  href={kit.href}
                  onClick={marcarUpsellResolvido}
                  className="cta-shine group mt-5 flex w-full items-center justify-between gap-3
                             rounded-2xl bg-limao px-5 py-4 text-verde-escuro
                             hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  <span className="text-left">
                    <span className="block font-[family-name:var(--font-basement)] font-extrabold uppercase text-base leading-tight">
                      {kit.titulo}
                    </span>
                    <span className="block font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-xs mt-0.5">
                      {kit.subtitulo}
                    </span>
                    <span className="mt-1.5 flex items-baseline gap-2">
                      <span className="font-[family-name:var(--font-archivo)] text-verde-escuro/50 text-sm line-through">
                        {kit.de}
                      </span>
                      <span className="font-[family-name:var(--font-basement)] font-extrabold text-2xl leading-none">
                        {kit.por}
                      </span>
                    </span>
                  </span>
                  <svg
                    viewBox="0 0 16 16"
                    className="w-6 h-6 shrink-0 group-hover:translate-x-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </a>

                {/* O desconto vale para os dois kits; quem tem os dois veículos
                    não precisa voltar à loja para achar o outro. */}
                <a
                  href={outroKit.href}
                  onClick={marcarUpsellResolvido}
                  className="mt-3 block text-center font-[family-name:var(--font-archivo)]
                             text-white/45 text-xs underline underline-offset-4 hover:text-white/75 transition-colors"
                >
                  Quero o {outroKit.titulo.toLowerCase()} com o mesmo desconto
                </a>
              </>
            )}

            <a
              href={ROLETA.declineHref}
              onClick={marcarUpsellResolvido}
              className="mt-6 block text-center font-[family-name:var(--font-archivo)]
                         text-white/30 text-xs underline underline-offset-4 hover:text-white/60 transition-colors"
            >
              {premio.resgate === "whatsapp"
                ? "Resgatar depois, ir para o meu pedido"
                : "Não quero agora, ir para o meu pedido"}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/** Confete. Só chega junto do som de vitória, nunca da derrota. */
function festa(discreto: boolean) {
  if (prefereMenosMovimento()) return;
  import("canvas-confetti")
    .then(({ default: confetti }) => {
      const colors = ["#a9da00", "#83ce0d", "#ffffff"];
      confetti({
        particleCount: discreto ? 90 : 160,
        spread: discreto ? 85 : 110,
        origin: { y: 0.35 },
        colors,
        zIndex: 9999,
      });
      if (discreto) return;
      setTimeout(() => {
        confetti({ particleCount: 70, angle: 60, spread: 75, origin: { x: 0, y: 0.6 }, colors, zIndex: 9999 });
        confetti({ particleCount: 70, angle: 120, spread: 75, origin: { x: 1, y: 0.6 }, colors, zIndex: 9999 });
      }, 220);
    })
    .catch(() => {});
}

function IconeSom() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

function IconeMudo() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="m16 9 5 6M21 9l-5 6" />
    </svg>
  );
}
