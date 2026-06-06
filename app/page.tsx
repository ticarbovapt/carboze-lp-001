import type { Metadata } from "next";
import LovableHeader from "@/components/LovableHeader";
import FloatingWhatsApp from "@/components/lovable/FloatingWhatsApp";
import HeroInstitucional from "@/components/lovable/institucional/HeroInstitucional";
import ProblemSection from "@/components/lovable/institucional/ProblemSection";
import ConceitoSection from "@/components/lovable/institucional/ConceitoSection";
import DiferencialSection from "@/components/lovable/institucional/DiferencialSection";
import ComoFunciona from "@/components/lovable/institucional/ComoFunciona";
import CompatibilidadeSection from "@/components/lovable/institucional/CompatibilidadeSection";
import SustentabilidadeSection from "@/components/lovable/institucional/SustentabilidadeSection";
import FAQInstitucional from "@/components/lovable/institucional/FAQInstitucional";
import CTAFinalInstitucional from "@/components/lovable/institucional/CTAFinalInstitucional";
import { WHATSAPP_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "CarboZé — O único otimizador molecular para o combustível brasileiro",
  description:
    "A gasolina da bomba tem etanol. O diesel tem biodiesel. O CarboZé age na estrutura molecular do combustível, a cada abastecimento, antes do dano acontecer.",
};

export default function HomePage() {
  return (
    <main>
      <LovableHeader checkoutHref="/choice" suporteHref={WHATSAPP_URL} ctaLabel="Escolher Produto" />
      <HeroInstitucional />
      <ProblemSection />
      <ConceitoSection />
      <DiferencialSection />
      <ComoFunciona />
      <CompatibilidadeSection />
      <SustentabilidadeSection />
      <FAQInstitucional />
      <CTAFinalInstitucional />
      <FloatingWhatsApp />
    </main>
  );
}
