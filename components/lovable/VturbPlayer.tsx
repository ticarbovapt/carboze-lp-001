"use client";

import { useEffect, useRef, useState } from "react";

const VTURB_ACCOUNT = "309da15a-481a-42a5-88a8-7e366ad043fe";

/** Distância da viewport em que o player começa a carregar. */
const MARGEM_PX = 400;

interface VturbPlayerProps {
  /** ID do player no VTurb (o mesmo do id="vid-..." do embed). */
  playerId: string;
  /** Proporção do player. VSL vertical = 9/16 (padrão). */
  aspect?: "9 / 16" | "16 / 9" | "1 / 1";
  className?: string;
}

/**
 * Player do VTurb (ConverteAI), carregado só quando se aproxima da tela.
 *
 * POR QUE PREGUIÇOSO — não é micro-otimização. O script do VTurb, assim que
 * roda, pede o manifesto HLS e começa a pré-carregar segmentos da VSL. A VSL
 * tem 5min55s / 89 segmentos; em medição na produção o navegador baixou 28
 * segmentos sem ninguém dar play — foi o que levou a home a 11,3 MB no mobile
 * e empurrou o LCP para 5,2s, porque o download disputava banda com a imagem
 * do hero. A seção fica na 3ª dobra: quem não rola até lá não deve pagar nada.
 *
 * Também não há mais `<link rel="preload">` para o player nem para o .m3u8.
 * Preload é ordem de prioridade alta ao navegador — exatamente o oposto do que
 * um vídeo abaixo da dobra merece. Ficou só o dns-prefetch, que não custa
 * bytes e deixa DNS/TLS prontos para quando o carregamento acontecer.
 *
 * O embed oficial é um custom element. Ele é injetado via innerHTML de
 * propósito: o React não reconcilia o conteúdo interno e não briga com as
 * mutações que o player faz na própria árvore.
 */
export default function VturbPlayer({
  playerId,
  aspect = "9 / 16",
  className = "",
}: VturbPlayerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(false);

  // Decide a hora de carregar. Checagem por retângulo em vez de
  // IntersectionObserver para também cobrir mudança de viewport (rotação de
  // tela, abrir/fechar barra do navegador) com o mesmo caminho de código.
  useEffect(() => {
    if (ativo) return;
    const perto = () => {
      const el = hostRef.current;
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight + MARGEM_PX && r.bottom > -MARGEM_PX;
    };
    const checar = () => {
      if (perto()) setAtivo(true);
    };
    checar();
    window.addEventListener("scroll", checar, { passive: true });
    window.addEventListener("resize", checar, { passive: true });
    return () => {
      window.removeEventListener("scroll", checar);
      window.removeEventListener("resize", checar);
    };
  }, [ativo]);

  // Monta o custom element e injeta o script do player.
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
  }, [ativo, playerId]);

  return (
    <>
      <link rel="dns-prefetch" href="https://cdn.converteai.net" />
      <link rel="dns-prefetch" href="https://scripts.converteai.net" />
      <link rel="dns-prefetch" href="https://images.converteai.net" />
      <link rel="dns-prefetch" href="https://license.vturb.com" />

      {/* A caixa já sai do servidor com a proporção final: o player entra
          dentro dela sem empurrar nada da página (CLS zero). */}
      <div
        ref={hostRef}
        className={className}
        style={{ aspectRatio: aspect }}
        data-vturb={playerId}
      >
        {!ativo && (
          // Marca-lugar desenhado em CSS: zero requisições até o player entrar.
          <div className="w-full h-full flex items-center justify-center bg-black">
            <span className="w-14 h-14 rounded-full bg-limao/90 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 ml-0.5 text-verde-escuro" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        )}
      </div>
    </>
  );
}
