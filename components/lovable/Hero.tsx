import CTAButton from "./CTAButton";
import PriceBlock from "./PriceBlock";

export default function Hero() {
  return (
    <section className="relative bg-verde-escuro py-16 md:py-24 overflow-hidden min-h-[520px] flex items-center">
      {/* Background image overlay — falls back gracefully when not present */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-75"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
        aria-hidden="true"
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-verde-escuro/60" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 w-full">
        <div className="max-w-2xl">
          <h1 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            Moto engasgada não é só aborrecimento.{" "}
            <span className="text-limao">É prejuízo!</span>
          </h1>

          <p className="font-[family-name:var(--font-archivo)] text-white/80 text-base md:text-lg leading-relaxed mb-8">
            O CarboZé trata o combustível e protege o motor a cada abastecimento.
            Um sachê por tanque ={" "}
            <strong className="text-white font-bold">
              mais performance, menos quebra e mais economia!
            </strong>
          </p>

          {/* Price block */}
          <div className="mb-8 max-w-[80%]">
            <PriceBlock variant="dark" />
          </div>

          <CTAButton label="QUERO MEU PACK" size="large" href="/checkoutsache" />

          <p className="mt-5 text-xs text-white/40 font-[family-name:var(--font-archivo)]">
            Disponível no Mercado Livre, Shopee e TikTok Shop
          </p>
        </div>
      </div>
    </section>
  );
}
