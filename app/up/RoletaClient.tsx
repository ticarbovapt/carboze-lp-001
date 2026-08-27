"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Roleta from "./Roleta";
import ResultadoPopup from "./ResultadoPopup";
import { ROLETA } from "@/lib/constants";
import { lerProduto, limparFunil, type ProdutoFunil } from "@/lib/funnelState";
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

/**
 * Resposta de /api/roleta. O cliente não decide prêmio nenhum: ele pergunta o
 * que saiu e anima a roda até o gomo correspondente.
 */
type Resultado = {
  premio: string | null;
  codigo: string | null;
  podeGirar: boolean;
};

function prefereMenosMovimento() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Rotação que deixa o gomo `i` sob o ponteiro.
 *
 * O gomo `i` nasce centrado em `i * PASSO` (0 = ponteiro, sentido horário).
 * Girar a roda em R leva esse centro para `i * PASSO + R`, e queremos isso em
 * 0 (mod 360) — daí o `- i * PASSO`. As voltas inteiras só dão espetáculo.
 *
 * O desvio existe para a roda não parar sempre no mesmo pixel: fica dentro do
 * gomo, com 8° de folga para não encostar na divisória, onde o resultado
 * ficaria ambíguo aos olhos de quem assiste.
 */
function anguloAlvo(i: number, de: number) {
  const voltas =
    ROLETA.voltasMin + Math.floor(Math.random() * (ROLETA.voltasMax - ROLETA.voltasMin + 1));
  const desvio = (Math.random() - 0.5) * (PASSO - 16);
  // A partir da volta inteira seguinte, para o giro nunca ser curto quando a
  // roda já está parada num ângulo qualquer do giro anterior.
  const base = Math.ceil(de / 360) * 360;
  return base + 360 * voltas - i * PASSO + desvio;
}

type Fase = "carregando" | "pronto" | "girando" | "resultado";

export default function RoletaClient() {
  const [fase, setFase] = useState<Fase>("carregando");
  const [vencedor, setVencedor] = useState(-1);
  const [codigo, setCodigo] = useState("");
  const [podeGirar, setPodeGirar] = useState(false);
  const [popupAberto, setPopupAberto] = useState(false);
  const [produto, setProduto] = useState<ProdutoFunil | null>(null);
  const [semSom, setSemSom] = useState(false);
  const [erro, setErro] = useState(false);

  const rodaRef = useRef<SVGGElement | null>(null);
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
   * primeiro gomo enquanto o resultado anuncia outro.
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
    let vivo = true;

    async function montar() {
      const query = new URLSearchParams(window.location.search);

      // `?reset=1` zera o percurso e recarrega limpo. Só para teste: sem isso,
      // reconferir a roleta exigiria limpar cookie e storage a cada rodada.
      if (query.get("reset") === "1") {
        limparFunil();
        try {
          await fetch("/api/roleta", { method: "DELETE" });
        } catch {
          /* segue mesmo assim: o recarregamento já tira o ?reset da URL */
        }
        window.location.replace("/up");
        return;
      }

      setSemSom(lerPreferenciaMudo());
      // `?p=` deixa o snippet pós-compra informar o produto; senão vale o
      // clique gravado na LP.
      const daUrl = query.get("p");
      setProduto(daUrl === "sache" || daUrl === "pack" ? daUrl : lerProduto());

      // Quem já girou reencontra onde parou — o resultado não pode sumir num F5.
      try {
        const r = await fetch("/api/roleta", { cache: "no-store" });
        if (!vivo) return;
        const estado = (await r.json()) as Resultado;
        const i = estado.premio ? PREMIOS.findIndex((p) => p.id === estado.premio) : -1;
        if (i >= 0) {
          setVencedor(i);
          setCodigo(estado.codigo ?? "");
          aplicar(-i * PASSO);
        }
        setPodeGirar(estado.podeGirar);
        // Sobrou giro: volta para o botão, com a roda parada onde estava.
        // Acabaram: mostra o resultado, sem reabrir o popup a cada visita.
        setFase(estado.podeGirar ? "pronto" : i >= 0 ? "resultado" : "pronto");
      } catch {
        if (!vivo) return;
        // Sem resposta do servidor não há giro possível. Melhor dizer isso do
        // que deixar um botão que não faz nada.
        setErro(true);
        setFase("pronto");
      }
    }

    void montar();
    return () => {
      vivo = false;
    };
  }, [aplicar]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const animarAte = useCallback(
    (i: number, aoParar: () => void) => {
      const reduzido = prefereMenosMovimento();
      const inicio = anguloRef.current;
      const duracao = reduzido ? 900 : ROLETA.duracaoGiroMs;
      const alvo = reduzido
        ? Math.ceil(inicio / 360) * 360 + 360 - i * PASSO
        : anguloAlvo(i, inicio);
      const alvoComSobra = alvo + SOBRA;

      const t0 = performance.now();
      let ultimoPino = Math.floor(inicio / PASSO_PINO);
      let ultimoAngulo = inicio;
      let ultimoTempo = t0;

      function frame(agora: number) {
        const t = Math.min(1, (agora - t0) / duracao);
        let angulo: number;

        if (t < 1) {
          // easeOutQuart: sai rápido e passa a maior parte do tempo
          // desacelerando, que é o perfil de uma roda pesada no atrito do eixo.
          angulo = inicio + (alvoComSobra - inicio) * (1 - Math.pow(1 - t, 4));
        } else {
          // Assentamento: a roda passou do alvo e volta oscilando até parar.
          // Em u=0 vale exatamente alvoComSobra, então emenda sem salto.
          const u = Math.min(1, (agora - t0 - duracao) / ASSENTO_MS);
          angulo = alvo + SOBRA * Math.cos(2 * Math.PI * u) * (1 - u);
        }

        // Um clique por pino que cruza o ponteiro, com o volume caindo junto da
        // velocidade. É daqui que vem a sensação de peso: no fim os cliques
        // ficam espaçados e fracos sozinhos, sem curva de volume à parte.
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
        aoParar();
      }

      rafRef.current = requestAnimationFrame(frame);
    },
    [aplicar],
  );

  const girar = useCallback(async () => {
    if (fase !== "pronto" || erro) return;

    // Precisa acontecer DENTRO do gesto: fora dele o navegador recusa criar o
    // AudioContext e o giro sai mudo.
    iniciarAudio();
    tocarGiro();
    setFase("girando");

    let estado: Resultado;
    try {
      const r = await fetch("/api/roleta", { method: "POST", cache: "no-store" });
      estado = (await r.json()) as Resultado;
    } catch {
      setErro(true);
      setFase("pronto");
      return;
    }

    const i = estado.premio ? PREMIOS.findIndex((p) => p.id === estado.premio) : -1;
    if (i < 0) {
      setErro(true);
      setFase("pronto");
      return;
    }
    const premio = PREMIOS[i];

    track("ViewContent", { content_name: `roleta:${premio.id}`, content_type: "product" });

    animarAte(i, () => {
      setVencedor(i);
      setCodigo(estado.codigo ?? "");
      setPodeGirar(estado.podeGirar);
      setFase("resultado");
      setPopupAberto(true);

      if (premio.tom === "nada") {
        tocarDerrota();
      } else {
        tocarVitoria();
        festa();
      }
    });
  }, [fase, erro, animarAte]);

  const girarDeNovo = useCallback(() => {
    setPopupAberto(false);
    setFase("pronto");
  }, []);

  const alternarSom = useCallback(() => {
    iniciarAudio();
    definirMudo(!estaMudo());
    setSemSom(estaMudo());
  }, []);

  const premio = vencedor >= 0 ? PREMIOS[vencedor] : null;
  // O gomo desenhado é o kit de 5 frascos, mas os 20% valem para os dois
  // produtos. Casa com o que a pessoa comprou; sem essa informação, carro.
  const kit = produto === "sache" ? ROLETA.checkout.moto : ROLETA.checkout.carro;
  const outroKit = produto === "sache" ? ROLETA.checkout.carro : ROLETA.checkout.moto;

  if (fase === "carregando") {
    // Não renderiza a roda antes de saber onde esta pessoa parou: o gomo
    // vencedor apareceria por um frame no lugar errado.
    return <div className="roleta-caixa" style={{ aspectRatio: "400 / 452" }} aria-hidden="true" />;
  }

  const mostrarBotao = fase !== "resultado" || podeGirar;

  return (
    <div className="w-full flex flex-col items-center">
      <Roleta
        rodaRef={rodaRef}
        vencedor={fase === "resultado" ? vencedor : -1}
        girando={fase === "girando"}
      />

      {/* O CTA fica fora da roda: no miolo ele cobria o "20% OFF" da arte e
          dava uma área de toque pequena. Aqui é um botão de verdade, largo, no
          alcance do polegar. */}
      {mostrarBotao && (
        <button
          type="button"
          onClick={girar}
          disabled={fase !== "pronto" || erro}
          className="cta-shine roleta-cta mt-6 w-full max-w-sm rounded-2xl bg-limao px-6 py-5
                     font-[family-name:var(--font-basement)] font-extrabold uppercase
                     text-verde-escuro text-xl tracking-wide
                     hover:brightness-110 active:scale-[0.98] transition-all
                     disabled:opacity-60 disabled:cursor-default disabled:animate-none"
        >
          {fase === "girando"
            ? "Girando…"
            : vencedor >= 0
              ? "Girar de novo"
              : "Girar roleta"}
        </button>
      )}

      {erro && (
        <p
          role="alert"
          className="mt-3 font-[family-name:var(--font-archivo)] text-red-300 text-xs text-center max-w-xs"
        >
          Não conseguimos falar com o servidor agora. Recarregue a página para
          girar — o seu pedido segue garantido.
        </p>
      )}

      <button
        type="button"
        onClick={alternarSom}
        aria-pressed={semSom}
        className="mt-4 flex items-center gap-2 rounded-full border border-white/15 px-4 py-2
                   font-[family-name:var(--font-archivo)] text-white/50 text-xs
                   hover:text-white hover:border-white/35 transition-colors"
      >
        {semSom ? <IconeMudo /> : <IconeSom />}
        {semSom ? "Som desligado" : "Som ligado"}
      </button>

      {/* Depois de fechar o popup a oferta continua ao alcance: um toque para
          reabrir, em vez de obrigar a pessoa a girar de novo para reencontrar
          o que ganhou. */}
      {fase === "resultado" && !popupAberto && premio && !podeGirar && (
        <button
          type="button"
          onClick={() => setPopupAberto(true)}
          className="mt-3 font-[family-name:var(--font-archivo)] text-limao text-sm
                     underline underline-offset-4 hover:text-white transition-colors"
        >
          Ver o que você ganhou
        </button>
      )}

      {popupAberto && premio && (
        <ResultadoPopup
          premio={premio}
          codigo={codigo}
          chanceExtra={podeGirar}
          kit={kit}
          outroKit={outroKit}
          onFechar={() => setPopupAberto(false)}
          onGirarDeNovo={girarDeNovo}
        />
      )}
    </div>
  );
}

/** Confete. Só chega junto do som de vitória, nunca da derrota. */
function festa() {
  if (prefereMenosMovimento()) return;
  import("canvas-confetti")
    .then(({ default: confetti }) => {
      const colors = ["#a9da00", "#83ce0d", "#ffffff"];
      confetti({ particleCount: 150, spread: 105, origin: { y: 0.35 }, colors, zIndex: 9999 });
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
