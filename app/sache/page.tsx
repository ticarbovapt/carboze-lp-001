import type { Metadata } from "next";
import LovableHeader from "@/components/LovableHeader";
import Hero from "@/components/lovable/Hero";
import Problem from "@/components/lovable/Problem";
import WhyName from "@/components/lovable/WhyName";
import Solution from "@/components/lovable/Solution";
import Sachet from "@/components/lovable/Sachet";
import CostValue from "@/components/lovable/CostValue";
import HowToUse from "@/components/lovable/HowToUse";
import FAQ from "@/components/lovable/FAQ";
import CTAFinal from "@/components/lovable/CTAFinal";

export const metadata: Metadata = {
  title: "CarboZé Moto — Sachê 10ml para motos",
  description: "O sachê CarboZé 10ml elimina umidade, melhora a combustão e limpa o motor a cada abastecimento. Feito para motos.",
};

export default function SachePage() {
  return (
    <main>
      <LovableHeader checkoutHref="/checkoutsache" />
      <Hero />
      <Problem />
      <WhyName />
      <Solution />
      <Sachet />
      <CostValue />
      <HowToUse />
      <FAQ />
      <CTAFinal />
    </main>
  );
}
