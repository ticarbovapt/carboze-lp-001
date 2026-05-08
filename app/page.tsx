import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import Sachet from "@/components/Sachet";
import CostValue from "@/components/CostValue";
import HowToUse from "@/components/HowToUse";
import FAQ from "@/components/FAQ";
import CTAFinal from "@/components/CTAFinal";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Problem />
      <Solution />
      <Sachet />
      <CostValue />
      <HowToUse />
      <FAQ />
      <CTAFinal />
    </main>
  );
}
