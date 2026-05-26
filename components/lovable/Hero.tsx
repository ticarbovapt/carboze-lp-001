import CTAButton from "./CTAButton";

export default function Hero() {
  return (
    <section className="relative bg-verde-escuro py-20 md:py-28 overflow-hidden min-h-[600px] flex items-center">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
        aria-hidden="true"
      />
      {/* Gradient — idêntico ao /pack100 */}
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
            Proteção de combustível para motos
          </p>

          <h1 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-4xl sm:text-5xl md:text-[3.25rem] lg:text-[3.75rem] leading-[0.95] mb-6">
            Moto engasgada não é só aborrecimento.{" "}
            <span className="text-limao">É prejuízo!</span>
          </h1>

          <p className="font-[family-name:var(--font-archivo)] text-white/60 text-base leading-relaxed mb-8 max-w-md">
            O CarboZé trata o combustível e protege o motor a cada abastecimento.
            Um sachê por tanque ={" "}
            <strong className="text-white/90 font-semibold">
              mais performance, menos quebra e mais economia.
            </strong>
          </p>

          {/* Preço — tipografia pura, idêntico ao Hero100 */}
          <div className="mb-8">
            <p className="font-[family-name:var(--font-archivo)] text-white/30 text-xs tracking-[0.12em] uppercase mb-1">
              Pack com 10 sachês de 10ml
            </p>
            <p className="font-[family-name:var(--font-basement)] font-extrabold text-limao text-5xl md:text-6xl leading-none">
              R$ 59,90
            </p>
            <p className="font-[family-name:var(--font-archivo)] text-white/30 text-sm mt-2">
              10 sachês · R$ 5,99/tanque protegido
            </p>
          </div>

          <CTAButton label="QUERO MEU PACK" size="large" href="/checkoutsache" />

          <p className="mt-5 text-xs text-white/25 font-[family-name:var(--font-archivo)]">
            Disponível no Mercado Livre, Shopee e TikTok Shop
          </p>
        </div>
      </div>
    </section>
  );
}
