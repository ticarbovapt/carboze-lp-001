import type { Metadata } from "next";
import LovableHeader from "@/components/LovableHeader";
import FloatingWhatsApp from "@/components/lovable/FloatingWhatsApp";
import Hero from "@/components/lovable/Hero";
import Problem from "@/components/lovable/Problem";
import WhyFormedSache from "@/components/lovable/WhyFormedSache";
import Solution from "@/components/lovable/Solution";
import Sachet from "@/components/lovable/Sachet";
import CostValue from "@/components/lovable/CostValue";
import HowToUse from "@/components/lovable/HowToUse";
import FAQ from "@/components/lovable/FAQ";
import CTAFinal from "@/components/lovable/CTAFinal";
import Depoimentos from "@/components/lovable/Depoimentos";
import StickyPriceBar from "@/components/lovable/StickyPriceBar";

export const metadata: Metadata = {
  title: "CarboZé — Vacine seu combustível",
  description: "O sachê CarboZé 10ml elimina umidade, melhora a combustão e limpa o motor a cada abastecimento. Feito para motos.",
  alternates: { canonical: "/sache" },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "CarboZé Kit 10 Sachês de 10ml",
  image: "https://www.carboze.com.br/og-image.jpg",
  description:
    "Kit com 10 sachês de 10ml. Elimina umidade, melhora a combustão e limpa o motor a cada abastecimento. Feito para motos.",
  brand: { "@type": "Brand", name: "CarboZé" },
  offers: {
    "@type": "Offer",
    price: "59.90",
    priceCurrency: "BRL",
    availability: "https://schema.org/InStock",
    url: "https://www.carboze.com.br/sache",
  },
};

export default function SachePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <link rel="preload" as="image" href="/LP_SACHE_MOBILE.webp" media="(max-width: 639px)" />
      <link rel="preload" as="image" href="/hero-bg.webp" media="(min-width: 640px)" />
      <LovableHeader checkoutHref="/checkoutsache" />
      <Hero />
      <Problem />
      <WhyFormedSache />
      <Solution />
      <Sachet />
      <div className="bg-verde-escuro"><hr className="border-white/8 max-w-6xl mx-auto" /></div>
      <CostValue />
      <HowToUse />
      <FAQ />
      <Depoimentos />
      <div id="cta-final-section">
        <CTAFinal />
      </div>
      <StickyPriceBar variant="moto" motoHref="/checkoutsache" />
      <FloatingWhatsApp />
    </main>
  );
}
