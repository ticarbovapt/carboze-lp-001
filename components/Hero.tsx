import Image from "next/image";
import CTAButton from "./CTAButton";
import PriceBlock from "./PriceBlock";

export default function Hero() {
  return (
    <section className="bg-off-white py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-start gap-10 md:gap-16">
        {/* Left: copy — always full width of its flex column */}
        <div className="flex-1 order-2 md:order-1 w-full">
          <h1 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight mb-5">
            Moto engasgada não é só aborrecimento.{" "}
            <span className="text-verde-medio">É prejuízo!</span>
          </h1>

          <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/80 text-base md:text-lg leading-relaxed mb-8">
            O CarboZé Moto trata o combustível e protege o motor a cada
            abastecimento. Um sachê por tanque = mais performance, menos quebra
            e mais economia de combustível!
          </p>

          {/* Price block — full width of left column */}
          <div className="mb-8 w-full">
            <PriceBlock variant="light" />
          </div>

          <CTAButton label="QUERO MEU PACK" size="large" />

          <p className="mt-5 text-xs text-verde-escuro/40 font-[family-name:var(--font-archivo)]">
            Disponível no Mercado Livre, Shopee e TikTok Shop
          </p>
        </div>

        {/* Right: product image */}
        <div className="flex-shrink-0 order-1 md:order-2 w-full max-w-[300px] md:max-w-[360px] mx-auto md:mx-0">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-verde-escuro/10">
            <Image
              src="/sache-moto.jpg"
              alt="CarboZé Moto — Sachê 10ml"
              fill
              sizes="(max-width: 768px) 300px, 360px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
