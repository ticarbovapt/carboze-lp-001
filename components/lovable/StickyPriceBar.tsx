"use client";
import { useEffect, useRef, useState } from "react";
import { TruckIcon } from "@/components/lovable/Icons";

interface StickyPriceBarProps {
  variant: "moto" | "carro" | "ambos";
  motoHref?: string;
  carroHref?: string;
}

/** Atributo no <html> enquanto a barra está na tela — o CSS do WhatsApp flutuante lê. */
const ATTR_STICKY = "data-cz-sticky";

export default function StickyPriceBar({
  variant,
  motoHref = "/checkoutsache",
  carroHref = "/checkoutpack100",
}: StickyPriceBarProps) {
  const [visible, setVisible] = useState(false);
  const sentinelaRef = useRef<HTMLDivElement>(null);

  // POR QUE IntersectionObserver E NÃO scroll. O listener de scroll chamava
  // setState a cada frame de rolagem; somado ao header e ao pill, eram três
  // componentes reagindo ao mesmo gesto. O observer só acorda quando a
  // sentinela cruza a borda da tela — e só mexemos no estado se o valor mudou.
  useEffect(() => {
    const html = document.documentElement;
    const sentinela = sentinelaRef.current;
    const ctaSection = document.getElementById("cta-final-section");

    let passouDobra = false;
    let ctaNaTela = false;
    let atual = false;

    function atualiza() {
      const proximo = passouDobra && !ctaNaTela;
      if (proximo === atual) return;
      atual = proximo;
      setVisible(proximo);
      // Atributo, não estado compartilhado: o WhatsApp some via CSS sem
      // re-render — e mudança de atributo não acorda o MutationObserver do
      // UTMify (ele observa childList, não attributes).
      if (proximo) html.setAttribute(ATTR_STICKY, "");
      else html.removeAttribute(ATTR_STICKY);
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === sentinela) {
            // Saiu por CIMA = rolou além dos 500px. Saída por baixo não conta.
            passouDobra = !entry.isIntersecting && entry.boundingClientRect.top < 0;
          } else {
            // Some ao chegar na CTA final
            ctaNaTela = entry.isIntersecting;
          }
        }
        atualiza();
      },
      { threshold: 0 }
    );
    if (sentinela) obs.observe(sentinela);
    if (ctaSection) obs.observe(ctaSection);

    return () => {
      obs.disconnect();
      html.removeAttribute(ATTR_STICKY);
    };
  }, []);

  return (
    <>
      {/* Sentinela a 500px do topo do documento — substitui o `scrollY > 500`
          (robusto p/ heroes sem âncora de preço). O `absolute` só ancora no
          documento porque nenhum ancestral (<main>/<body>) é posicionado. */}
      <div
        ref={sentinelaRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-[500px] h-px w-px"
      />

      <div
        aria-hidden={!visible}
        // inert: escondida fora da tela, os links não recebem foco por teclado
        inert={!visible}
        className={`fixed bottom-0 inset-x-0 z-50 transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div
          className="bg-verde-escuro/95 backdrop-blur-sm border-t border-white/10 px-4"
          style={{ paddingTop: "8px", paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
        >
          <div className="max-w-xl mx-auto">

            {/* Frete grátis — antes era um pill flutuante separado, empilhado
                acima da barra. Aqui dentro a promessa fica junto do preço e a
                parte de baixo da tela tem um elemento só. */}
            <p className="flex items-center justify-center gap-1.5 mb-2 font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-[11px] tracking-wider leading-none">
              <TruckIcon className="w-4 h-4" />
              Frete grátis
            </p>

            {/* ── variant: moto ───────────────────────────────── */}
            {variant === "moto" && (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-[family-name:var(--font-basement)] font-extrabold text-limao text-2xl leading-none">
                      R$ 59,90
                    </span>
                    <span className="font-[family-name:var(--font-archivo)] text-white/70 text-xs">
                      /kit 10 un.
                    </span>
                  </div>
                  <p className="font-[family-name:var(--font-archivo)] text-white/70 text-[10px] mt-0.5">
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
                    <span className="font-[family-name:var(--font-archivo)] text-white/70 text-xs">
                      /kit 5 un.
                    </span>
                  </div>
                  <p className="font-[family-name:var(--font-archivo)] text-white/70 text-[10px] mt-0.5">
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
                  <span className="font-[family-name:var(--font-archivo)] text-[10px] uppercase tracking-wider opacity-80 leading-none mb-0.5">
                    Economizar na moto
                  </span>
                  <span className="text-xl leading-none">R$ 59,90</span>
                  <span className="font-[family-name:var(--font-archivo)] font-semibold text-[9px] opacity-80 leading-none mt-0.5">
                    R$ 5,99 por sachê
                  </span>
                </a>
                <a
                  href={carroHref}
                  className="flex-1 flex flex-col items-center justify-center border-2 border-limao text-limao font-[family-name:var(--font-basement)] font-black rounded-xl py-2.5 px-2 hover:bg-limao/10 active:scale-95 transition-all"
                >
                  <span className="font-[family-name:var(--font-archivo)] text-[10px] uppercase tracking-wider opacity-80 leading-none mb-0.5">
                    Economizar no carro
                  </span>
                  <span className="text-xl leading-none">R$ 149,50</span>
                  <span className="font-[family-name:var(--font-archivo)] font-semibold text-[9px] opacity-80 leading-none mt-0.5">
                    R$ 29,90 por frasco
                  </span>
                </a>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
