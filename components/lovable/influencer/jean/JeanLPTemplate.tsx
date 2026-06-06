import HeroInfluencer from "@/components/lovable/influencer/HeroInfluencer";
import MoneyBurn from "@/components/lovable/influencer/MoneyBurn";
import FAQInfluencer from "@/components/lovable/influencer/FAQInfluencer";
import CTAFinalInfluencer from "@/components/lovable/influencer/CTAFinalInfluencer";
import FloatingWhatsApp from "@/components/lovable/FloatingWhatsApp";
import ProductPickerJean from "./ProductPickerJean";
import ScienceSectionJean from "./ScienceSectionJean";
import HowToUseJean from "./HowToUseJean";
import StickyPriceBar from "@/components/lovable/StickyPriceBar";

interface JeanLPTemplateProps {
  bgImage: string;
  mobileBgImage?: string;
  checkoutMotoHref?: string;
  checkoutCarroHref?: string;
}

export default function JeanLPTemplate({
  bgImage,
  mobileBgImage,
  checkoutMotoHref = "/checkoutsache-jean",
  checkoutCarroHref = "/checkoutpack100-jean",
}: JeanLPTemplateProps) {
  return (
    <main>
      {/* Hero — com copy mobile melhorado (Ajuste 5) */}
      <HeroInfluencer
        bgImage={bgImage}
        mobileBgImage={mobileBgImage}
        checkoutMotoHref={checkoutMotoHref}
        mobileSubtitle="R$ 5,99 por sachê · entrega em todo Brasil"
      />

      {/* Produto — card sachê com badge de preço (Ajuste 3) */}
      <ProductPickerJean motoHref={checkoutMotoHref} carroHref={checkoutCarroHref} />

      <div className="bg-verde-escuro">
        <hr className="border-white/8 max-w-6xl mx-auto" />
      </div>

      {/* Ciência — 3 bullets visuais (Ajuste 2) */}
      <ScienceSectionJean />

      {/* Benefícios */}
      <MoneyBurn />

      {/* Modo de uso — com placeholders de GIF (Ajuste 4) */}
      <HowToUseJean />

      {/* FAQ */}
      <FAQInfluencer />

      {/* CTA Final — marcado com id para o sticky saber onde parar */}
      <div id="cta-final-section">
        <CTAFinalInfluencer motoHref={checkoutMotoHref} carroHref={checkoutCarroHref} />
      </div>

      {/* Sticky price bar mobile */}
      <StickyPriceBar variant="ambos" motoHref={checkoutMotoHref} carroHref={checkoutCarroHref} />

      <FloatingWhatsApp />
    </main>
  );
}
