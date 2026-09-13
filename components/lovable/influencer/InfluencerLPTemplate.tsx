import HeroInfluencer from "./HeroInfluencer";
import ProductPicker from "./ProductPicker";
import ScienceSection from "./ScienceSection";
import MoneyBurn from "./MoneyBurn";
import HowToUseInfluencer from "./HowToUseInfluencer";
import FAQInfluencer from "./FAQInfluencer";
import CTAFinalInfluencer from "./CTAFinalInfluencer";
import FloatingWhatsApp from "@/components/lovable/FloatingWhatsApp";
import StickyPriceBar from "@/components/lovable/StickyPriceBar";
import ExitOfferGate from "@/components/lovable/ExitOfferGate";

interface InfluencerLPTemplateProps {
  bgImage: string;
  mobileBgImage?: string;
  checkoutMotoHref?: string;
  checkoutCarroHref?: string;
  /** Campanha desta LP — vira utm_source no link da oferta de saída. */
  utmSource?: string;
}

export default function InfluencerLPTemplate({
  bgImage,
  mobileBgImage,
  checkoutMotoHref = "/checkoutsache-influencer",
  checkoutCarroHref = "/checkoutpack100-influencer",
  utmSource,
}: InfluencerLPTemplateProps) {
  return (
    <main>
      <HeroInfluencer bgImage={bgImage} mobileBgImage={mobileBgImage} checkoutMotoHref={checkoutMotoHref} />
      <ProductPicker motoHref={checkoutMotoHref} carroHref={checkoutCarroHref} />
      <div className="bg-verde-escuro">
        <hr className="border-white/8 max-w-6xl mx-auto" />
      </div>
      <ScienceSection />
      <MoneyBurn />
      <HowToUseInfluencer />
      <FAQInfluencer />
      <div id="cta-final-section">
        <CTAFinalInfluencer motoHref={checkoutMotoHref} carroHref={checkoutCarroHref} />
      </div>
      {/* Frete grátis vive dentro da sticky; o WhatsApp some enquanto ela aparece */}
      <StickyPriceBar variant="ambos" motoHref={checkoutMotoHref} carroHref={checkoutCarroHref} />
      <FloatingWhatsApp />

      {/* Oferta de saída — leva o utm da campanha para não perder a atribuição */}
      <ExitOfferGate utmSource={utmSource} />
    </main>
  );
}
