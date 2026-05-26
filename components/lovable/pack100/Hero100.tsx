import CTAButton from "../CTAButton";
import PriceBlock from "../PriceBlock";

export default function Hero100() {
  return (
    <section className="relative bg-verde-escuro py-16 md:py-24 overflow-hidden min-h-[520px] flex items-center">
      {/* Background image overlay */}
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
            Um frasco. 100 litros protegidos.{" "}
            <span className="text-limao">Motor tratado tanque a tanque.</span>
          </h1>

          <p className="font-[family-name:var(--font-archivo)] text-white/80 text-base md:text-lg leading-relaxed mb-8">
            O CarboZé Pack 100ml trata até 100 litros de combustível — gasolina,
            etanol ou diesel. Proteção contínua com{" "}
            <strong className="text-white font-bold">
              mais performance, menos quebra e mais economia!
            </strong>
          </p>

          {/* Price block placeholder */}
          <div className="mb-8 max-w-[80%]">
            <div className="bg-white/10 rounded-2xl p-5 inline-block">
              <p className="font-[family-name:var(--font-barlow)] font-bold uppercase text-limao text-xs tracking-widest mb-1">
                Pack 100ml
              </p>
              <p className="font-[family-name:var(--font-barlow)] font-extrabold text-white text-4xl">
                R$ <span className="text-limao">149,90</span>
              </p>
              <p className="font-[family-name:var(--font-archivo)] text-white/60 text-sm mt-1">
                Trata até 100L de combustível
              </p>
            </div>
          </div>

          <CTAButton label="QUERO O PACK 100ML" size="large" href="/checkoutpack100" />

          <p className="mt-5 text-xs text-white/40 font-[family-name:var(--font-archivo)]">
            Disponível no Mercado Livre, Shopee e TikTok Shop
          </p>
        </div>
      </div>
    </section>
  );
}
