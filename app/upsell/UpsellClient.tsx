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
      confetti({ particleCount: 100, spread: 85, origin: { y: 0.3 }, colors, zIndex: 9999 });
      setTimeout(() => {
        confetti({ particleCount: 55, angle: 60, spread: 70, origin: { x: 0, y: 0.55 }, colors, zIndex: 9999 });
        confetti({ particleCount: 55, angle: 120, spread: 70, origin: { x: 1, y: 0.55 }, colors, zIndex: 9999 });
      }, 180);
    })
    .catch(() => {});
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/**
 * O snippet pós-compra dispara em QUALQUER pedido aprovado — inclusive no
 * pedido do próprio upsell. Sem trava, quem aceita a oferta volta para cá e
 * é oferecido o mesmo produto que acabou de comprar.
 */
const JA_ACEITOU = "cz-upsell-aceito";

export default function UpsellClient() {
  const [left, setLeft] = useState(UPSELL.urgencyMinutes * 60);
  const [saindo, setSaindo] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(JA_ACEITOU)) {
        setSaindo(true);
        window.location.replace(UPSELL.declineHref);
        return;
      }
    } catch {
      /* sessionStorage indisponível — segue sem a trava */
    }
    fireConfetti();
  }, []);

  useEffect(() => {
    if (left <= 0) return;
    const t = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [left]);

  const produtos = [UPSELL.produtos.moto, UPSELL.produtos.carro] as const;

  // Evita o flash do card antes do redirect de quem já aceitou
  if (saindo) return null;

  return (
    <>
      {/* Só as duas opções de compra — nada que dispute o clique */}
      <div className="w-full flex flex-col gap-3">
        {produtos.map((p) => (
          <a
            key={p.titulo}
            href={p.href}
            onClick={() => {
              // Marca antes de sair: quando o snippet trouxer de volta após o
              // pagamento, esta página manda direto para /obrigado.
              try {
                sessionStorage.setItem(JA_ACEITOU, "1");
              } catch {
                /* ignora */
              }
            }}
            className="cta-shine group w-full rounded-2xl bg-limao text-verde-escuro px-5 py-4
                       hover:brightness-110 active:scale-[0.98] transition-all
                       flex items-center justify-between gap-3"
          >
            <span className="text-left">
              <span className="block font-[family-name:var(--font-basement)] font-extrabold uppercase text-base leading-tight">
                {p.titulo}
              </span>
              <span className="block font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-xs mt-0.5">
                {p.subtitulo}
              </span>
              <span className="mt-1.5 flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-archivo)] text-verde-escuro/50 text-sm line-through">
                  {p.de}
                </span>
                <span className="font-[family-name:var(--font-basement)] font-extrabold text-2xl leading-none">
                  {p.por}
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
        ))}
      </div>

      <p className="mt-5 font-[family-name:var(--font-archivo)] text-white/45 text-xs text-center">
        Frete grátis · desconto já aplicado no preço ·{" "}
        <span className="text-limao font-bold tabular-nums">{fmt(left)}</span>
      </p>

      {/* Saída discreta, mas clicável e legível — pequeno não é escondido */}
      <a
        href={UPSELL.declineHref}
        className="mt-6 font-[family-name:var(--font-archivo)] text-white/30 text-xs underline underline-offset-4
                   hover:text-white/60 transition-colors"
      >
        Não quero agora, desistir do meu desconto
      </a>
    </>
  );
}
