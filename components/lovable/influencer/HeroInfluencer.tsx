import Image from "next/image";
import type { ReactNode } from "react";
import CTAButton from "@/components/lovable/CTAButton";
import HeroCarouselBg from "./HeroCarouselBg";
import HeroBgPicture from "./HeroBgPicture";

interface HeroInfluencerProps {
  bgImage: string;
  mobileBgImage?: string;
  checkoutMotoHref?: string;
  mobileSubtitle?: string;
  /** Sequência de imagens que se alternam no fundo (sachê → frascos → influencer). Se fornecido, substitui o fundo estático. */
  carousel?: { desktop: string; mobile: string }[];
  /** Headline customizada (mantém o padrão se não fornecida). */
  headline?: ReactNode;
  /** Subtítulo customizado (curto). */
  subtitle?: string;
  /** Rótulo/destino do CTA principal. */
  ctaLabel?: string;
  ctaHref?: string;
  /** Esconde o logo do hero quando a página já tem o LovableHeader (evita dois logos empilhados no topo). */
  hideLogo?: boolean;
}

const DEFAULT_HEADLINE = (
  <>
    O único otimizador molecular feito para o{" "}
    <span className="text-limao">combustível que você abastece.</span>
  </>
);

export default function HeroInfluencer({
  bgImage,
  mobileBgImage,
  checkoutMotoHref = "/checkoutsache-influencer",
  mobileSubtitle,
  carousel,
  headline = DEFAULT_HEADLINE,
  subtitle,
  ctaLabel = "EVITAR DESPERDÍCIO",
  ctaHref = "#escolha-produto",
  hideLogo = false,
}: HeroInfluencerProps) {
  return (
    <section className="relative min-h-screen flex items-end pb-12 sm:pb-20 overflow-hidden">
      {carousel && carousel.length > 0 ? (
        <HeroCarouselBg images={carousel} />
      ) : (
        /* Uma arte por breakpoint, escolhida pelo <source media> antes do
           download — os dois <div> de background baixavam as duas. */
        <HeroBgPicture desktop={bgImage} mobile={mobileBgImage} prioritaria />
      )}

      {/* Gradient overlay — bottom-heavy for legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(9,58,48,0.95) 0%, rgba(9,58,48,0.60) 40%, rgba(9,58,48,0.15) 75%, rgba(9,58,48,0.05) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Logo — absolute, disappears when hero scrolls out of view.
          Sem `priority` de propósito: ele gerava um preload de alta prioridade
          concorrendo com a arte do hero, que é o LCP. Na home ele nem aparece
          (`hideLogo`: o LovableHeader já mostra o logo); nas LPs de
          influencer, `eager` basta — o logo está no HTML, o preload scanner
          acha na hora, só não fura a fila da imagem principal. */}
      {!hideLogo && (
        <div className="absolute top-6 left-6 md:left-10 z-20 pointer-events-none select-none">
          <Image
            src="/logo-header.png"
            alt="CarboZé"
            width={185}
            height={32}
            loading="eager"
            className="h-8 w-auto"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 w-full">
        <div className="max-w-2xl">

          {/* Tag */}
          <span className="inline-flex items-center bg-limao/10 border border-limao/30 text-limao text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full font-[family-name:var(--font-basement)] mb-6">
            Exclusivo
          </span>

          <h1 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-4xl sm:text-6xl md:text-[4rem] lg:text-[4.5rem] leading-[0.9] mb-5">
            {headline}
          </h1>

          {subtitle ? (
            <p className="font-[family-name:var(--font-archivo)] text-white/70 text-base sm:text-lg leading-snug mb-8 max-w-lg">
              {subtitle}
            </p>
          ) : (
            <>
              <p className="font-[family-name:var(--font-archivo)] text-white/70 text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-xl hidden sm:block">
                A gasolina da sua bomba tem até 27% de etanol. O diesel tem biodiesel misturado. Esses
                compostos oxidam, absorvem umidade e formam depósitos que roubam performance e reduzem
                a vida útil do motor — e quase ninguém faz nada contra isso.
              </p>
              <p className="font-[family-name:var(--font-archivo)] text-white/70 text-sm leading-relaxed mb-8 sm:hidden">
                Etanol + biodiesel oxidam, absorvem umidade e formam depósitos que roubam performance e reduzem a vida do motor.
              </p>
            </>
          )}

          <CTAButton label={ctaLabel} size="large" href={ctaHref} />

          {/* Copy desktop padrão */}
          <p className={`mt-4 text-xs text-white/70 font-[family-name:var(--font-archivo)] ${mobileSubtitle ? "hidden sm:block" : ""}`}>
            Disponível para motos e carros · entrega em todo Brasil
          </p>
          {/* Copy mobile alternativo (Ajuste 5) */}
          {mobileSubtitle && (
            <p className="mt-4 text-xs text-white/70 font-[family-name:var(--font-archivo)] text-center block sm:hidden">
              {mobileSubtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
