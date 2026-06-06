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
import StickyPriceBar from "@/components/lovable/StickyPriceBar";

export const metadata: Metadata = {
  title: "CarboZé — Vacine seu combustível",
  description: "O sachê CarboZé 10ml elimina umidade, melhora a combustão e limpa o motor a cada abastecimento. Feito para motos.",
};

export default function SachePage() {
  return (
    <main>
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
      <div id="cta-final-section">
        <CTAFinal />
      </div>
      <StickyPriceBar variant="moto" motoHref="/checkoutsache" />
      <FloatingWhatsApp />
    </main>
  );
}
