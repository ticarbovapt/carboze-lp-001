"use client";

import { WHATSAPP_URL } from "@/lib/constants";
import Image from "next/image";
import { useEffect, useState } from "react";


interface LovableHeaderProps {
  checkoutHref?: string;
  hideNav?: boolean;
  suporteHref?: string;
  transparent?: boolean;
  ctaLabel?: string;
}

export default function LovableHeader({ checkoutHref = "/choice", hideNav = false, suporteHref, transparent = false, ctaLabel = "Compre Online" }: LovableHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        scrolled
          ? "bg-verde-escuro/97 backdrop-blur-md border-white/8 shadow-md shadow-black/20"
          : transparent
          ? "bg-transparent border-transparent"
          : "bg-verde-escuro border-white/10"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-3.5 h-[56px] flex items-center justify-between">

        {/* Logo — sem link */}
        <div className="flex items-center shrink-0">
          <Image
            src="/logo-header.png"
            alt="CarboZé"
            width={1147}
            height={198}
            priority
            className="h-6 w-auto"
          />
        </div>

        {/* Right CTAs */}
        {!hideNav && (
          <nav className="flex items-center gap-4 shrink-0">
            {/* Onde Encontrar */}
            <a
              href="/loja"
              className="hidden md:inline font-[family-name:var(--font-archivo)] text-white/40 hover:text-white transition-colors text-xs tracking-wide"
            >
              Onde Encontrar
            </a>

            {/* Suporte (opcional) */}
            {suporteHref && (
              <a
                href={suporteHref}
                className="hidden md:inline font-[family-name:var(--font-archivo)] text-white/40 hover:text-white transition-colors text-xs tracking-wide"
              >
                Suporte
              </a>
            )}

            {/* Compre Online — botão pill */}
            <a
              href={checkoutHref}
              className="flex items-center gap-1.5 bg-limao text-verde-escuro px-4 py-2 rounded-full font-[family-name:var(--font-basement)] font-bold text-xs hover:brightness-110 transition-all active:scale-95"
            >
              {ctaLabel}
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
