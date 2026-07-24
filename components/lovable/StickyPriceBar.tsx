"use client";
import { useEffect, useState } from "react";

interface StickyPriceBarProps {
  variant: "moto" | "carro" | "ambos";
  motoHref?: string;
  carroHref?: string;
}

export default function StickyPriceBar({
  variant,
  motoHref = "/checkoutsache",
  carroHref = "/checkoutpack100",
}: StickyPriceBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let scrolled = false;
    let ctaVisible = false;

    function update() {
      setVisible(scrolled && !ctaVisible);
    }

    // Aparece após rolar além da primeira dobra (robusto p/ heroes sem âncora de preço)
    const onScroll = () => {
      scrolled = window.scrollY > 500;
      update();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Some ao chegar na CTA final
    const ctaSection = document.getElementById("cta-final-section");
    const ctaObs = new IntersectionObserver(
      ([entry]) => {
        ctaVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0 }
    );
    if (ctaSection) ctaObs.observe(ctaSection);

    return () => {
      window.removeEventListener("scroll", onScroll);
      ctaObs.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-0 inset-x-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div
        className="bg-verde-escuro/95 backdrop-blur-sm border-t border-white/10 px-4"
        style={{ paddingTop: "12px", paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="max-w-xl mx-auto">

          {/* ── variant: moto ───────────────────────────────── */}
          {variant === "moto" && (
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-[family-name:var(--font-basement)] font-extrabold text-limao text-2xl leading-none">
                    R$ 59,90
                  </span>
                  <span className="font-[family-name:var(--font-archivo)] text-white/50 text-xs">
                    /kit 10 un.
                  </span>
                </div>
                <p className="font-[family-name:var(--font-archivo)] text-white/60 text-[10px] mt-0.5">
                  R$ 5,99 por sachê
                </p>
              </div>
              <a
                href={motoHref}
                className="shrink-0 bg-limao text-verde-escuro font-[family-name:var(--font-basement)] font-black uppercase text-sm px-5 py-2.5 rounded-xl hover:brightness-110 active:scale-95 transition-all"
              >
                Economizar
              </a>
            </div>
          )}

          {/* ── variant: carro ──────────────────────────────── */}
          {variant === "carro" && (
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-[family-name:var(--font-basement)] font-extrabold text-limao text-2xl leading-none">
                    R$ 149,50
                  </span>
                  <span className="font-[family-name:var(--font-archivo)] text-white/50 text-xs">
                    /kit 5 un.
                  </span>
                </div>
                <p className="font-[family-name:var(--font-archivo)] text-white/60 text-[10px] mt-0.5">
                  R$ 29,90 por frasco
                </p>
              </div>
              <a
                href={carroHref}
                className="shrink-0 bg-limao text-verde-escuro font-[family-name:var(--font-basement)] font-black uppercase text-sm px-5 py-2.5 rounded-xl hover:brightness-110 active:scale-95 transition-all"
              >
                Economizar
              </a>
            </div>
          )}

          {/* ── variant: ambos ──────────────────────────────── */}
          {variant === "ambos" && (
            <div className="flex items-center gap-2">
              <a
                href={motoHref}
                className="flex-1 flex flex-col items-center justify-center bg-limao text-verde-escuro font-[family-name:var(--font-basement)] font-black rounded-xl py-2.5 px-2 hover:brightness-110 active:scale-95 transition-all"
              >
                <span className="font-[family-name:var(--font-archivo)] text-[10px] uppercase tracking-wider opacity-70 leading-none mb-0.5">
                  Economizar na moto
                </span>
                <span className="text-xl leading-none">R$ 59,90</span>
                <span className="font-[family-name:var(--font-archivo)] font-semibold text-[9px] opacity-70 leading-none mt-0.5">
                  R$ 5,99 por sachê
                </span>
              </a>
              <a
                href={carroHref}
                className="flex-1 flex flex-col items-center justify-center border-2 border-limao text-limao font-[family-name:var(--font-basement)] font-black rounded-xl py-2.5 px-2 hover:bg-limao/10 active:scale-95 transition-all"
              >
                <span className="font-[family-name:var(--font-archivo)] text-[10px] uppercase tracking-wider opacity-70 leading-none mb-0.5">
                  Economizar no carro
                </span>
                <span className="text-xl leading-none">R$ 149,50</span>
                <span className="font-[family-name:var(--font-archivo)] font-semibold text-[9px] opacity-70 leading-none mt-0.5">
                  R$ 29,90 por frasco
                </span>
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
