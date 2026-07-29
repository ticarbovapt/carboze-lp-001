"use client";

import { useEffect, useState } from "react";
import { UPSELL } from "@/lib/constants";

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
      confetti({ particleCount: 110, spread: 85, origin: { y: 0.4 }, colors, zIndex: 9999 });
      setTimeout(() => {
        confetti({ particleCount: 60, angle: 60, spread: 70, origin: { x: 0, y: 0.6 }, colors, zIndex: 9999 });
        confetti({ particleCount: 60, angle: 120, spread: 70, origin: { x: 1, y: 0.6 }, colors, zIndex: 9999 });
      }, 180);
    })
    .catch(() => {});
}

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function UpsellClient() {
  const [left, setLeft] = useState(UPSELL.urgencyMinutes * 60);

  useEffect(() => {
    if (left <= 0) return;
    const t = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [left]);

  const economia = UPSELL.precoDe - UPSELL.precoPor;
  const porLitroOrigem = UPSELL.origemPreco / UPSELL.origemLitros;
  const porLitroOferta = UPSELL.precoPor / UPSELL.litros;
  const vezesMais = Math.round(UPSELL.litros / UPSELL.origemLitros);

  return (
    <div className="popup-in w-full max-w-lg mx-auto rounded-3xl bg-verde-escuro border border-limao/30 shadow-[0_0_70px_rgba(169,218,0,0.22)] overflow-hidden">
      {/* Brilho */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #a9da00 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative px-6 py-8 md:px-9 md:py-10 text-center flex flex-col items-center">
        {/* Selo de economia */}
        <span className="inline-flex items-center gap-1.5 bg-limao text-verde-escuro text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full font-[family-name:var(--font-basement)]">
          Você economiza {brl(economia)}
        </span>

        <h1 className="mt-4 font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-2xl sm:text-3xl md:text-4xl leading-tight">
          Antes de fechar:{" "}
          <span className="text-limao">trate {vezesMais}× mais combustível.</span>
        </h1>

        <p className="mt-3 font-[family-name:var(--font-archivo)] text-white/60 text-sm md:text-base leading-relaxed max-w-md">
          Por {brl(UPSELL.precoPor - UPSELL.origemPreco)} a mais que o kit de sachês,
          você leva o kit de frascos — e sai pagando muito menos por litro tratado.
        </p>

        {/* Comparativo */}
        <div className="mt-7 w-full grid grid-cols-2 gap-3">
          {/* O que ia levar */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 text-left">
            <p className="font-[family-name:var(--font-archivo)] text-white/40 text-[10px] uppercase tracking-[0.14em] mb-2">
              Sua escolha
            </p>
            <p className="font-[family-name:var(--font-basement)] font-bold text-white/70 text-sm leading-tight">
              Kit 10 sachês
            </p>
            <p className="mt-2 font-[family-name:var(--font-basement)] font-extrabold text-white/70 text-xl">
              {brl(UPSELL.origemPreco)}
            </p>
            <p className="mt-1 font-[family-name:var(--font-archivo)] text-white/40 text-xs">
              trata {UPSELL.origemLitros} L
            </p>
            <p className="mt-3 pt-3 border-t border-white/10 font-[family-name:var(--font-archivo)] text-white/40 text-xs">
              {brl(porLitroOrigem)} por litro
            </p>
          </div>

          {/* A oferta */}
          <div className="relative rounded-2xl bg-limao/[0.12] border-2 border-limao p-4 text-left">
            <p className="font-[family-name:var(--font-archivo)] text-limao text-[10px] uppercase tracking-[0.14em] mb-2 font-bold">
              Recomendado
            </p>
            <p className="font-[family-name:var(--font-basement)] font-bold text-white text-sm leading-tight">
              Kit 5 frascos 100ml
            </p>
            <div className="mt-2 flex items-baseline gap-2 flex-wrap">
              <span className="font-[family-name:var(--font-basement)] font-extrabold text-limao text-2xl">
                {brl(UPSELL.precoPor)}
              </span>
              <span className="font-[family-name:var(--font-archivo)] text-white/35 text-sm line-through">
                {brl(UPSELL.precoDe)}
              </span>
            </div>
            <p className="mt-1 font-[family-name:var(--font-archivo)] text-white/60 text-xs">
              trata {UPSELL.litros} L
            </p>
            <p className="mt-3 pt-3 border-t border-limao/25 font-[family-name:var(--font-basement)] font-extrabold text-limao text-xs">
              {brl(porLitroOferta)} por litro
            </p>
          </div>
        </div>

        {/* Reforço do argumento real */}
        <p className="mt-4 font-[family-name:var(--font-archivo)] text-white/50 text-xs md:text-sm leading-relaxed max-w-md">
          Mesmo produto, mesma proteção — o frasco só rende mais. O litro tratado
          sai <strong className="text-limao font-bold">3× mais barato</strong>.
        </p>

        {/* CTA principal */}
        <a
          href={UPSELL.href}
          onClick={fireConfetti}
          className="cta-shine mt-6 w-full bg-limao text-verde-escuro font-[family-name:var(--font-basement)] font-extrabold uppercase text-base md:text-lg py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all tracking-wide flex items-center justify-center gap-2"
        >
          Sim, quero tratar {vezesMais}× mais
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </a>

        <p className="mt-3 font-[family-name:var(--font-archivo)] text-white/45 text-[11px]">
          Preço promocional válido nesta etapa ·{" "}
          <span className="text-limao font-bold tabular-nums">{fmt(left)}</span>
        </p>

        {/* Saída honesta — precisa ser fácil de achar */}
        <a
          href={UPSELL.declineHref}
          className="mt-4 font-[family-name:var(--font-archivo)] text-white/40 text-sm underline underline-offset-4 hover:text-white/70 transition-colors"
        >
          Não, seguir com o kit de 10 sachês
        </a>
      </div>
    </div>
  );
}
