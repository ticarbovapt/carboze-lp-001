import type { Metadata } from "next";
import LovableHeader from "@/components/LovableHeader";
import Hero100 from "@/components/lovable/pack100/Hero100";
import Problem100 from "@/components/lovable/pack100/Problem100";
import WhyFormed100 from "@/components/lovable/pack100/WhyFormed100";
import Solution100 from "@/components/lovable/pack100/Solution100";
import CostValue100 from "@/components/lovable/pack100/CostValue100";
import MetadeAgora100 from "@/components/lovable/pack100/MetadeAgora100";
import FAQ from "@/components/lovable/FAQ";
import CTAFinal100 from "@/components/lovable/pack100/CTAFinal100";

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
      <WhyFormed100 />
      <Solution100 />
      <CostValue100 />
      <MetadeAgora100 />
      <FAQ />
      <CTAFinal100 />
    </main>
  );
}
