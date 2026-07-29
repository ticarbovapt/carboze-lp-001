"use client";

import { useEffect, useState } from "react";
import { EXIT_OFFER, backCheckout } from "@/lib/constants";
import { BadgePercentIcon, CheckCircleIcon } from "./Icons";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function fireConfetti() {
  if (prefersReducedMotion()) return;
  import("canvas-confetti")
    .then(({ default: confetti }) => {
      const colors = ["#a9da00", "#83ce0d", "#ffffff"];
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.35 }, colors, zIndex: 9999 });
      setTimeout(() => {
        confetti({ particleCount: 60, angle: 60, spread: 70, origin: { x: 0, y: 0.5 }, colors, zIndex: 9999 });
        confetti({ particleCount: 60, angle: 120, spread: 70, origin: { x: 1, y: 0.5 }, colors, zIndex: 9999 });
      }, 200);
    })
    .catch(() => {});
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

interface ExitOfferProps {
  /** Modal com overlay (exit intent) ou bloco embutido (rota /cupom). */
  variant?: "modal" | "inline";
  onClose?: () => void;
  /**
   * Campanha da LP onde o popup está (ex.: "carpower", "jean", "dionisio").
   * Vira utm_source no link do desconto — sem isso a venda perde a origem.
   */
  utmSource?: string;
}

export default function ExitOffer({ variant = "modal", onClose, utmSource }: ExitOfferProps) {
  const motoHref = backCheckout("motos", utmSource);
  const carroHref = backCheckout("carros", utmSource);
  const [left, setLeft] = useState(EXIT_OFFER.urgencyMinutes * 60);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (left <= 0) return;
    const t = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [left]);

  // Confete só quando o usuário AGE — celebra a conquista, não simula sorte.
  function claim() {
    setClaimed(true);
    fireConfetti();
  }

  const card = (
    <div
      className={`popup-in relative w-full max-w-sm rounded-3xl bg-verde-escuro border border-limao/30 shadow-[0_0_60px_rgba(169,218,0,0.25)] overflow-hidden ${
        variant === "inline" ? "mx-auto" : ""
      }`}
    >
      {/* Brilho de fundo */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #a9da00 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      {variant === "modal" && onClose && (
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      )}

      <div className="relative px-6 pt-7 pb-6 text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-limao flex items-center justify-center shadow-lg text-verde-escuro">
          {claimed ? (
            <CheckCircleIcon className="w-8 h-8" />
          ) : (
            <BadgePercentIcon className="w-8 h-8" />
          )}
        </div>

        <p className="mt-4 font-[family-name:var(--font-archivo)] text-limao text-[10px] tracking-[0.18em] uppercase font-bold">
          {claimed ? "Desconto ativado" : "Espera um segundo"}
        </p>

        <h2 className="mt-1 font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-2xl leading-tight">
          {claimed ? (
            <>Seu desconto está <span className="text-limao">pronto!</span></>
          ) : (
            <>Leva <span className="text-limao">{EXIT_OFFER.percent}% off</span> antes de sair</>
          )}
        </h2>

        {!claimed ? (
          <>
            <p className="mt-3 font-[family-name:var(--font-archivo)] text-white/60 text-sm leading-relaxed">
              Vale para o sachê e para o frasco, somado ao frete grátis que você já tem.
            </p>

            <button
              onClick={claim}
              className="cta-shine mt-5 w-full bg-limao text-verde-escuro font-[family-name:var(--font-basement)] font-extrabold uppercase text-base py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all tracking-wide flex items-center justify-center gap-2"
            >
              Quero meu {EXIT_OFFER.percent}% de desconto
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
          </>
        ) : (
          <>
            {/* Valor conquistado — sem código para copiar, o desconto já vem no preço */}
            <div className="mt-5 w-full rounded-2xl bg-white/[0.06] border border-dashed border-limao/50 px-4 py-5">
              <p className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-limao text-3xl leading-none">
                Você ganhou {EXIT_OFFER.percent}%
              </p>
              <p className="mt-2 font-[family-name:var(--font-archivo)] text-white/75 text-base leading-snug">
                na primeira compra
              </p>
            </div>

            <p className="mt-3 font-[family-name:var(--font-archivo)] text-white/55 text-xs leading-relaxed">
              Desconto já aplicado — é só escolher o seu.
            </p>

            {/* Escolha do produto */}
            <div className="mt-5 w-full flex flex-col gap-2">
              <a
                href={motoHref}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-shine w-full bg-limao text-verde-escuro font-[family-name:var(--font-basement)] font-extrabold uppercase text-sm py-3.5 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center"
              >
                Usar na moto · Kit sachê
              </a>
              <a
                href={carroHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-limao/40 text-limao font-[family-name:var(--font-basement)] font-extrabold uppercase text-sm py-3.5 rounded-xl hover:bg-limao/10 active:scale-[0.98] transition-all flex items-center justify-center"
              >
                Usar no carro · Kit frasco
              </a>
            </div>
          </>
        )}

        <p className="mt-3 font-[family-name:var(--font-archivo)] text-white/45 text-[11px]">
          Oferta válida só agora ·{" "}
          <span className="text-limao font-bold tabular-nums">{fmt(left)}</span>
        </p>

        {variant === "modal" && onClose && (
          <button
            onClick={onClose}
            className="mt-3 font-[family-name:var(--font-archivo)] text-white/35 text-xs hover:text-white/60 transition-colors"
          >
            Agora não, obrigado
          </button>
        )}
      </div>
    </div>
  );

  if (variant === "inline") return card;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Oferta de ${EXIT_OFFER.percent}% de desconto`}
    >
      {card}
    </div>
  );
}
