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
import Depoimentos from "@/components/lovable/Depoimentos";
import ProvaSocial from "@/components/lovable/ProvaSocial";
import { WHATSAPP_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "CarboZé — O único otimizador molecular para o combustível brasileiro",
  description:
    "A gasolina da bomba tem etanol. O diesel tem biodiesel. O CarboZé age na estrutura molecular do combustível, a cada abastecimento, antes do dano acontecer.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <main>
      {/* Preload do hero (LCP) desta rota */}
      <link rel="preload" as="image" href="/design-builder-46bfb20e.webp" fetchPriority="high" />
      <LovableHeader checkoutHref="/choice" suporteHref={WHATSAPP_URL} ctaLabel="Escolher Produto" />
      <HeroInstitucional />
      <ProblemSection />
      <ConceitoSection />
      <DiferencialSection />
      <ComoFunciona />
      <CompatibilidadeSection />
      <SustentabilidadeSection />
      <Depoimentos />
      <ProvaSocial />
      <FAQInstitucional />
      <CTAFinalInstitucional />
      <FloatingWhatsApp />
    </main>
  );
}
