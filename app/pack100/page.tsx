import type { Metadata } from "next";
import LovableHeader from "@/components/LovableHeader";
import FloatingWhatsApp from "@/components/lovable/FloatingWhatsApp";
import Hero100 from "@/components/lovable/pack100/Hero100";
import Problem100 from "@/components/lovable/pack100/Problem100";
import WhyFormed100 from "@/components/lovable/pack100/WhyFormed100";
import Solution100 from "@/components/lovable/pack100/Solution100";
import CostValue100 from "@/components/lovable/pack100/CostValue100";
import MetadeAgora100 from "@/components/lovable/pack100/MetadeAgora100";
import FAQ from "@/components/lovable/FAQ";
import CTAFinal100 from "@/components/lovable/pack100/CTAFinal100";
import StickyPriceBar from "@/components/lovable/StickyPriceBar";

export const metadata: Metadata = {
  title: "CarboZé — Vacine seu combustível",
  description:
    "O frasco CarboZé 100ml elimina umidade, melhora a combustão e protege o motor a cada abastecimento. Feito para carros.",
};

export default function Pack100Page() {
  return (
    <main>
      <LovableHeader checkoutHref="/checkoutpack100" />
      <Hero100 />
      <Problem100 />
      <div className="bg-white"><hr className="border-verde-escuro/8 max-w-6xl mx-auto" /></div>
      <WhyFormed100 />
      <Solution100 />
      <div className="bg-verde-escuro"><hr className="border-white/8 max-w-6xl mx-auto" /></div>
      <CostValue100 />
      <div className="bg-verde-escuro"><hr className="border-white/8 max-w-6xl mx-auto" /></div>
      <MetadeAgora100 />
      <FAQ dark />
      <div id="cta-final-section">
        <CTAFinal100 />
      </div>
      <StickyPriceBar variant="carro" carroHref="/checkoutpack100" />
      <FloatingWhatsApp />
    </main>
  );
}
