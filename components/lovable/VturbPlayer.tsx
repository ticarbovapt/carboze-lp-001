"use client";

import { useEffect, useRef, useState } from "react";

const VTURB_ACCOUNT = "309da15a-481a-42a5-88a8-7e366ad043fe";

/** Tempo máximo esperando o player registrar a instância para dar play. */
const ESPERA_PLAY_MS = 8000;

interface VturbPlayerProps {
  /** ID do player no VTurb (o mesmo do id="vid-..." do embed). */
  playerId: string;
  /** Proporção do player. VSL vertical = 9/16 (padrão). */
  aspect?: "9 / 16" | "16 / 9" | "1 / 1";
  className?: string;
  /** Texto do botão que inicia o vídeo. */
  rotulo?: string;
}

/**
 * Player do VTurb (ConverteAI) — carrega só no clique.
 *
 * POR QUE NADA CARREGA ANTES. O script do VTurb, assim que roda, pede o
 * manifesto HLS e começa a pré-carregar segmentos. A VSL tem 5min55s / 89
 * segmentos de 478 a 1360 KB. Medindo a home em produção quando o script subia
 * junto com a página: 28 requisições ao CDN sem ninguém dar play — foi o que
 * levou a home a 11,3 MB no mobile e empurrou o LCP para 5,2s.
 *
 * A primeira correção foi carregar por proximidade (400px da viewport). Ainda
 * gastava megabytes de quem só passava rolando pela seção. Agora o gatilho é o
 * clique: quem não pede o vídeo não baixa um byte dele.
 *
 * A caixa já sai do servidor com a proporção final, então o player entra dentro
 * dela sem empurrar nada da página (CLS zero). Ficou só o dns-prefetch, que não
 * custa bytes e deixa DNS/TLS prontos para o momento do clique.
 *
 * O embed oficial é um custom element, injetado via innerHTML de propósito: o
 * React não reconcilia o conteúdo interno e não briga com as mutações que o
 * player faz na própria árvore.
 */
export default function VturbPlayer({
  playerId,
  aspect = "9 / 16",
  className = "",
  rotulo = "Assistir",
}: VturbPlayerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    if (!ativo) return;
    const host = hostRef.current;
    if (!host) return;

    // Marca o início do carregamento — o player usa na métrica de tempo até o play.
    const w = window as unknown as { _plt?: number };
    w._plt = w._plt ?? performance.timeOrigin + performance.now();

    host.innerHTML =
      `<vturb-smartplayer id="vid-${playerId}" style="display:block;margin:0 auto;width:100%">` +
      `<div style="position:relative;width:100%;height:100%;background-color:#000"></div>` +
      `</vturb-smartplayer>`;

    const src = `https://scripts.converteai.net/${VTURB_ACCOUNT}/players/${playerId}/v4/player.js`;
    if (!document.querySelector(`script[src="${src}"]`)) {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      document.head.appendChild(s);
    }

    // O clique foi no NOSSO botão, então o player ainda mostraria o pôster dele
    // e pediria um segundo clique. Aqui a gente pede o play por ele assim que a
    // instância aparece, para o usuário clicar uma vez só.
    //
    // É best-effort de propósito: em iOS a política de autoplay exige o gesto
    // na mesma pilha de chamada, e o script carrega depois disso. Se o play não
    // pegar, o usuário vê o próprio botão do VTurb e toca nele — nada quebra.
    const inicio = Date.now();
    const timer = window.setInterval(() => {
      const sp = (window as unknown as {
        smartplayer?: { instances?: { instance?: { play?: () => void } }[] };
      }).smartplayer;
      const inst = sp?.instances?.[0]?.instance;
      if (inst?.play) {
        window.clearInterval(timer);
        try {
          inst.play();
        } catch {
          /* o botão do player continua ali como saída */
        }
        return;
      }
      if (Date.now() - inicio > ESPERA_PLAY_MS) window.clearInterval(timer);
    }, 150);

    return () => window.clearInterval(timer);
  }, [ativo, playerId]);

  return (
    <>
      <link rel="dns-prefetch" href="https://cdn.converteai.net" />
      <link rel="dns-prefetch" href="https://scripts.converteai.net" />
      <link rel="dns-prefetch" href="https://images.converteai.net" />
      <link rel="dns-prefetch" href="https://license.vturb.com" />

      <div
        ref={hostRef}
        className={className}
        style={{ aspectRatio: aspect }}
        data-vturb={playerId}
      >
        {!ativo && (
          // Marca-lugar desenhado em CSS: zero requisições até o clique.
          // <button> de verdade — foco por teclado e leitor de tela funcionam.
          <button
            type="button"
            onClick={() => setAtivo(true)}
            aria-label={`${rotulo} — vídeo sobre a ciência do CarboZé`}
            className="group w-full h-full flex flex-col items-center justify-center gap-3 bg-black
                       cursor-pointer transition-colors hover:bg-black/90
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-limao focus-visible:ring-inset"
          >
            <span
              className="w-16 h-16 rounded-full bg-limao flex items-center justify-center
                         shadow-lg shadow-limao/20 transition-transform
                         group-hover:scale-105 group-active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 ml-1 text-verde-escuro" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="font-[family-name:var(--font-basement)] font-bold uppercase text-white text-sm tracking-wide">
              {rotulo}
            </span>
          </button>
        )}
      </div>
    </>
  );
}
