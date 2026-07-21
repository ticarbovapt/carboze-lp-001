import CTAButton from "../CTAButton";

export default function Hero100() {
  return (
    <section className="relative bg-verde-escuro overflow-hidden flex items-end sm:items-center min-h-screen sm:min-h-[calc(100vh-56px)] pb-10 sm:pb-0 sm:py-8">

      {/* Background — mobile */}
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat block sm:hidden"
        style={{ backgroundImage: "url('/CARBOZE_PACK_MOBILE.webp')" }}
        aria-hidden="true"
      />
      {/* Background — desktop */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 hidden sm:block"
        style={{ backgroundImage: "url('/cz-pack100-hero-bg.webp')" }}
        aria-hidden="true"
      />

      {/* Gradient — mobile */}
      <div
        className="absolute inset-0 block sm:hidden"
        style={{ background: "linear-gradient(to top, rgba(9,58,48,1) 0%, rgba(9,58,48,0.97) 35%, rgba(9,58,48,0.65) 60%, rgba(9,58,48,0.10) 100%)" }}
        aria-hidden="true"
      />
      {/* Gradient — desktop */}
      <div
        className="absolute inset-0 hidden sm:block"
        style={{ background: "linear-gradient(100deg, rgba(9,58,48,0.97) 0%, rgba(9,58,48,0.80) 55%, rgba(9,58,48,0.20) 100%)" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 w-full">
        <div className="max-w-xl">

          <p className="font-[family-name:var(--font-archivo)] text-white/50 text-[11px] sm:text-xs tracking-[0.16em] uppercase mb-3">
            Proteção de combustível para carros e caminhonetes
          </p>

          <h1 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[0.95] mb-4">
            Combustível protegido,{" "}
            <span className="text-limao">motor saudável.</span>
          </h1>

          <p className="font-[family-name:var(--font-archivo)] text-white/60 text-sm sm:text-[15px] leading-snug mb-4 max-w-md hidden sm:block">
            O combustível brasileiro tem uma composição química que não existe em
            nenhum outro país. O CarboZé é o único estabilizador desenvolvido
            especificamente para ela. Trata gasolina, diesel e etanol{" "}
            <strong className="text-white/90 font-semibold">com uma única fórmula.</strong>
          </p>

          {/* Bloco de preço */}
          <div id="hero-price-block" className="bg-white/[0.10] border border-white/20 rounded-2xl px-4 py-3.5 mb-4 w-fit max-w-sm">
            <p className="font-[family-name:var(--font-basement)] font-extrabold text-limao text-4xl sm:text-5xl md:text-6xl leading-none whitespace-nowrap">
              R$ 149,50
            </p>
            <p className="font-[family-name:var(--font-archivo)] text-white/60 text-sm mt-1">
              Kit com 5 frascos de 100ml
            </p>
            <hr className="border-white/10 my-2.5" />
            <p className="font-[family-name:var(--font-archivo)] font-semibold text-white/75 text-xs">
              R$ 29,90 por frasco 100ml
            </p>
            <p className="font-[family-name:var(--font-basement)] font-bold text-limao text-xs mt-2">
              🚚 Frete grátis · trata até 500 litros
            </p>
          </div>

          <CTAButton label="QUERO MEU PACK" size="large" href="/checkoutpack100" />

          <p className="mt-3 text-xs text-white/60 font-[family-name:var(--font-archivo)]">
            Disponível no Mercado Livre e Amazon
          </p>
        </div>
      </div>
    </section>
  );
}
