"use client";

import { useEffect, useState } from "react";
import { CHECKOUT_KIT6M } from "@/lib/constants";

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
      // rajada central
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.35 }, colors, zIndex: 9999 });
      // laterais, com leve atraso
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

export default function OfferPopup({ onClose }: { onClose: () => void }) {
  const [left, setLeft] = useState(600); // 10:00

  useEffect(() => {
    fireConfetti();
  }, []);

  useEffect(() => {
    if (left <= 0) return;
    const t = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [left]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="popup-in relative w-full max-w-sm rounded-3xl bg-verde-escuro border border-limao/30 shadow-[0_0_60px_rgba(169,218,0,0.25)] overflow-hidden">
        {/* Brilho de fundo */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #a9da00 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        {/* Fechar */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="relative px-6 pt-7 pb-6 text-center flex flex-col items-center">
          {/* Selo */}
          <div className="w-16 h-16 rounded-2xl bg-limao flex items-center justify-center text-3xl shadow-lg">
            🎁
          </div>
          <p className="mt-4 font-[family-name:var(--font-archivo)] text-limao text-[10px] tracking-[0.18em] uppercase font-bold">
            Presente exclusivo pra quem avaliou
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-2xl leading-tight">
            Você ganhou um <span className="text-limao">presente!</span>
          </h2>

          {/* Bloco da oferta */}
          <div className="mt-5 w-full rounded-2xl bg-white/[0.06] border border-white/15 p-5">
            <p className="font-[family-name:var(--font-archivo)] text-white/45 text-[10px] tracking-[0.16em] uppercase mb-1">
              Oferta especial
            </p>
            <p className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-xl leading-tight">
              Kit 6 Meses de Proteção
            </p>

            <div className="mt-4 flex gap-2">
              <div className="flex-1 rounded-xl bg-limao/15 border border-limao/40 py-2.5 px-2">
                <p className="text-lg leading-none">🚚</p>
                <p className="mt-1 font-[family-name:var(--font-basement)] font-extrabold uppercase text-limao text-[11px] leading-tight">
                  Frete grátis
                </p>
              </div>
              <div className="flex-1 rounded-xl bg-limao/15 border border-limao/40 py-2.5 px-2">
                <p className="text-lg leading-none">💳</p>
                <p className="mt-1 font-[family-name:var(--font-basement)] font-extrabold uppercase text-limao text-[11px] leading-tight">
                  6x sem juros
                </p>
              </div>
            </div>

            <p className="mt-4 font-[family-name:var(--font-archivo)] text-white/55 text-xs leading-relaxed">
              Garanta 6 meses de motor protegido — com frete grátis e parcelado em 6x sem juros.
            </p>
          </div>

          {/* CTA */}
          <a
            href={CHECKOUT_KIT6M}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-shine mt-5 w-full bg-limao text-verde-escuro font-[family-name:var(--font-basement)] font-extrabold uppercase text-base py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all tracking-wide flex items-center justify-center gap-2"
          >
            Quero meu kit 6 meses
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>

          {/* Urgência */}
          <p className="mt-3 font-[family-name:var(--font-archivo)] text-white/45 text-[11px]">
            Oferta exclusiva, válida só agora ·{" "}
            <span className="text-limao font-bold tabular-nums">{fmt(left)}</span>
          </p>

          {/* Saída discreta */}
          <button
            onClick={onClose}
            className="mt-3 font-[family-name:var(--font-archivo)] text-white/35 text-xs hover:text-white/60 transition-colors"
          >
            Agora não, obrigado
          </button>
        </div>
      </div>
    </div>
  );
}
