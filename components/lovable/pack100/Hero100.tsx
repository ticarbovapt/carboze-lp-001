import CTAButton from "../CTAButton";

export default function Hero100() {
  return (
    <section className="relative bg-verde-escuro py-20 md:py-28 overflow-hidden min-h-[580px] flex items-center">
      {/* Background — imagem do produto */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url('/cz-pack100-hero-bg.jpg')" }}
        aria-hidden="true"
      />
      {/* Gradient lateral */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(9,58,48,0.97) 0%, rgba(9,58,48,0.80) 50%, rgba(9,58,48,0.30) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 w-full">
        <div className="max-w-xl">

          <p className="font-[family-name:var(--font-archivo)] text-white/30 text-xs tracking-[0.18em] uppercase mb-6">
            Proteção de combustível para carros e caminhonetes
          </p>

          <h1 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-4xl sm:text-5xl md:text-[3.25rem] lg:text-[3.75rem] leading-[0.95] mb-6">
            Um frasco.{" "}
            <span className="whitespace-nowrap">100 litros</span>{" "}
            protegidos.{" "}
            <span className="text-limao">
              Motor tratado tanque a tanque.
            </span>
          </h1>

          <p className="font-[family-name:var(--font-archivo)] text-white/60 text-base leading-relaxed mb-8 max-w-md">
            O CarboZé Pack 100ml trata até 100 litros de combustível — gasolina,
            etanol ou diesel. Proteção contínua com{" "}
            <strong className="text-white/90 font-semibold">
              mais performance, menos quebra e mais economia.
            </strong>
          </p>

          {/* Preço */}
          <div className="mb-8">
            <p className="font-[family-name:var(--font-archivo)] text-white/30 text-xs tracking-[0.12em] uppercase mb-1">
              Frasco 100ml
            </p>
            <p className="font-[family-name:var(--font-basement)] font-extrabold text-limao text-5xl md:text-6xl leading-none">
              R$ 149,90
            </p>
            <p className="font-[family-name:var(--font-archivo)] text-white/30 text-sm mt-2">
              Trata até 100L · R$ 1,49/litro protegido
            </p>
          </div>

          <CTAButton label="QUERO O PACK 100ML" size="large" href="/checkoutpack100" />

          <p className="mt-5 text-xs text-white/25 font-[family-name:var(--font-archivo)]">
            Disponível no Mercado Livre, Shopee e TikTok Shop
          </p>
        </div>
      </div>
    </section>
  );
}
