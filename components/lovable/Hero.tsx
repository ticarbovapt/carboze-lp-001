import CTAButton from "./CTAButton";
import PriceBlock from "./PriceBlock";

export default function Hero() {
  return (
    <section className="relative bg-verde-escuro py-24 md:py-36 overflow-hidden min-h-[580px] flex items-center">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
        aria-hidden="true"
      />
      {/* Gradient overlay — mais sutil, não uniforme */}
      <div className="absolute inset-0 bg-gradient-to-r from-verde-escuro/80 via-verde-escuro/60 to-verde-escuro/20" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 w-full">
        <div className="max-w-2xl">
          <p className="font-[family-name:var(--font-archivo)] text-white/35 text-xs tracking-[0.15em] uppercase mb-6">
            Proteção de combustível para motos
          </p>

          <h1 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] mb-8">
            Moto engasgada não é só aborrecimento.{" "}
            <span className="text-limao">É prejuízo!</span>
          </h1>

          <p className="font-[family-name:var(--font-archivo)] text-white/65 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
            O CarboZé trata o combustível e protege o motor a cada abastecimento.
            Um sachê por tanque ={" "}
            <strong className="text-white/90 font-semibold">
              mais performance, menos quebra e mais economia.
            </strong>
          </p>

          {/* Price block */}
          <div className="mb-10 max-w-[80%]">
            <PriceBlock variant="dark" />
          </div>

          <CTAButton label="QUERO MEU PACK" size="large" href="/checkoutsache" />

          <p className="mt-6 text-xs text-white/30 font-[family-name:var(--font-archivo)]">
            Disponível no Mercado Livre, Shopee e TikTok Shop
          </p>
        </div>
      </div>
    </section>
  );
}
