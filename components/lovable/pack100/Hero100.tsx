import Image from "next/image";
import CTAButton from "../CTAButton";

export default function Hero100() {
  return (
    <section className="relative bg-verde-escuro py-24 md:py-36 overflow-hidden min-h-[600px] flex items-center">
      {/* Background — imagem de carro */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55"
        style={{ backgroundImage: "url('/cz-vehicle-car.jpg')" }}
        aria-hidden="true"
      />
      {/* Gradient — mais denso à esquerda para legibilidade, abre à direita para o mockup */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(9,58,48,0.97) 0%, rgba(9,58,48,0.82) 45%, rgba(9,58,48,0.45) 75%, rgba(9,58,48,0.20) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* Coluna esquerda — texto */}
          <div>
            <p className="font-[family-name:var(--font-archivo)] text-white/30 text-xs tracking-[0.18em] uppercase mb-7">
              Proteção de combustível para carros e caminhonetes
            </p>

            <h1 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] mb-7">
              Um frasco. 100 litros protegidos.{" "}
              <span className="text-limao">Motor tratado tanque a tanque.</span>
            </h1>

            <p className="font-[family-name:var(--font-archivo)] text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
              O CarboZé Pack 100ml trata até 100 litros de combustível — gasolina,
              etanol ou diesel. Proteção contínua com{" "}
              <strong className="text-white/90 font-semibold">
                mais performance, menos quebra e mais economia.
              </strong>
            </p>

            {/* Preço em tipografia pura */}
            <div className="mb-10">
              <p className="font-[family-name:var(--font-archivo)] text-white/30 text-xs tracking-[0.12em] uppercase mb-1">
                Frasco 100ml
              </p>
              <p className="font-[family-name:var(--font-barlow)] font-extrabold text-limao text-6xl md:text-7xl leading-none">
                R$ 149,90
              </p>
              <p className="font-[family-name:var(--font-archivo)] text-white/30 text-sm mt-2">
                Trata até 100L · R$ 1,49/litro protegido
              </p>
            </div>

            <CTAButton label="QUERO O PACK 100ML" size="large" href="/checkoutpack100" />

            <p className="mt-6 text-xs text-white/25 font-[family-name:var(--font-archivo)]">
              Disponível no Mercado Livre, Shopee e TikTok Shop
            </p>
          </div>

          {/* Coluna direita — mockup do produto */}
          <div className="hidden md:flex justify-center items-end pt-8">
            <div className="relative w-full max-w-[340px] lg:max-w-[400px] drop-shadow-[0_32px_64px_rgba(0,0,0,0.55)]">
              <Image
                src="/cz-product-pack100.png"
                alt="CarboZé Pack 100ml — frasco estabilizador de combustível"
                width={600}
                height={900}
                priority
                className="w-full h-auto object-contain"
                style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.5))" }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
