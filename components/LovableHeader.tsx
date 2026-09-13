"use client";

import { WHATSAPP_URL } from "@/lib/constants";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";


interface LovableHeaderProps {
  checkoutHref?: string;
  hideNav?: boolean;
  suporteHref?: string;
  transparent?: boolean;
  ctaLabel?: string;
}

export default function LovableHeader({ checkoutHref = "/#escolha-produto", hideNav = false, suporteHref, transparent = false, ctaLabel = "Quero economizar" }: LovableHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const sentinelaRef = useRef<HTMLDivElement>(null);

  // `scrollY > 8` via IntersectionObserver: o listener de scroll rodava
  // setState em todo frame de rolagem (INP). O observer só acorda quando a
  // sentinela sai/entra pela borda de cima, e o React descarta valor igual.
  useEffect(() => {
    const sentinela = sentinelaRef.current;
    if (!sentinela) return;
    const obs = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    obs.observe(sentinela);
    return () => obs.disconnect();
  }, []);

  return (
    <>
    {/* Sentinela 8px abaixo do topo do header. Fica FORA do <header>: ele é
        sticky, e dentro dele a sentinela andaria junto e nunca sairia da tela.
        O wrapper `relative h-0` ancora a posição sem ocupar espaço. */}
    <div aria-hidden="true" className="relative h-0">
      <div ref={sentinelaRef} className="pointer-events-none absolute left-0 top-2 h-px w-px" />
    </div>
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

        {/* Logo — sem link. `priority` fica AQUI: o header é a 1ª coisa da
            página em todos os breakpoints. O logo do HeroInfluencer (mesmo
            arquivo) saiu do priority para não gerar um 2º preload de alta
            prioridade disputando banda com a imagem do hero (LCP).
            width/height no tamanho exibido (h-6 = 24px): com o tamanho do PNG
            (1147) o srcset saía em 1200w/3840w para um logo de 139px. */}
        <div className="flex items-center shrink-0">
          <Image
            src="/logo-header.png"
            alt="CarboZé"
            width={139}
            height={24}
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
              className="hidden md:inline font-[family-name:var(--font-archivo)] text-white/70 hover:text-white transition-colors text-xs tracking-wide"
            >
              Onde Encontrar
            </a>

            {/* Suporte (opcional) */}
            {suporteHref && (
              <a
                href={suporteHref}
                className="hidden md:inline font-[family-name:var(--font-archivo)] text-white/70 hover:text-white transition-colors text-xs tracking-wide"
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
    </>
  );
}
