import HeroInfluencer from "./HeroInfluencer";
import ProductPicker from "./ProductPicker";
import ScienceSection from "./ScienceSection";
import MoneyBurn from "./MoneyBurn";
import HowToUseInfluencer from "./HowToUseInfluencer";
import FAQInfluencer from "./FAQInfluencer";
import CTAFinalInfluencer from "./CTAFinalInfluencer";
import FloatingWhatsApp from "@/components/lovable/FloatingWhatsApp";
import StickyPriceBar from "@/components/lovable/StickyPriceBar";

interface InfluencerLPTemplateProps {
  bgImage: string;
  mobileBgImage?: string;
  checkoutMotoHref?: string;
  checkoutCarroHref?: string;
}

export default function InfluencerLPTemplate({
  bgImage,
  mobileBgImage,
  checkoutMotoHref = "/checkoutsache-influencer",
  checkoutCarroHref = "/checkoutpack100-influencer",
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
      <StickyPriceBar variant="ambos" motoHref={checkoutMotoHref} carroHref={checkoutCarroHref} />
      <FloatingWhatsApp />
    </main>
  );
}
