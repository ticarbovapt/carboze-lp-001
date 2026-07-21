import HeroInfluencer from "@/components/lovable/influencer/HeroInfluencer";
import MoneyBurn from "@/components/lovable/influencer/MoneyBurn";
import FAQInfluencer from "@/components/lovable/influencer/FAQInfluencer";
import CTAFinalInfluencer from "@/components/lovable/influencer/CTAFinalInfluencer";
import ProductPickerJean from "./ProductPickerJean";
import ScienceSectionJean from "./ScienceSectionJean";
import HowToUseJean from "./HowToUseJean";
import UnboxingJean from "./UnboxingJean";
import DepoimentosJean from "./DepoimentosJean";
import StickyPriceBar from "@/components/lovable/StickyPriceBar";

interface JeanLPTemplateProps {
  bgImage: string;
  mobileBgImage?: string;
  checkoutMotoHref?: string;
  checkoutCarroHref?: string;
  /** Vídeo da seção "A ciência" — permite vídeo próprio por campanha. */
  scienceVideoSrc?: string;
  scienceVideoPoster?: string;
}

export default function JeanLPTemplate({
  bgImage,
  mobileBgImage,
  checkoutMotoHref = "/checkoutsache-jean",
  checkoutCarroHref = "/checkoutpack100-jean",
  scienceVideoSrc,
  scienceVideoPoster,
}: JeanLPTemplateProps) {
  // Carrossel do hero: Sachê → Frascos → foto da campanha (bgImage por página)
  const heroCarousel = [
    { desktop: "/hero-bg.webp", mobile: "/LP_SACHE_MOBILE.webp" },
    { desktop: "/cz-pack100-hero-bg.webp", mobile: "/CARBOZE_PACK_MOBILE.webp" },
    { desktop: bgImage, mobile: mobileBgImage ?? bgImage },
  ];

  return (
    <main>
      {/* Hero — gancho curto + carrossel de produto (sachê → frascos → influencer) */}
      <HeroInfluencer
        bgImage={bgImage}
        mobileBgImage={mobileBgImage}
        carousel={heroCarousel}
        headline={
          <>
            O produto que faz você{" "}
            <span className="text-limao">gastar menos.</span>
          </>
        }
        subtitle="Trata o combustível a cada abastecimento — mais economia, menos manutenção."
        ctaLabel="QUERO GASTAR MENOS"
        ctaHref="#escolha-produto"
        mobileSubtitle="Kit 10 sachês por R$ 59,90 · entrega em todo Brasil"
      />

      {/* Produto + dosagem (ideal p/ motos) */}
      <ProductPickerJean motoHref={checkoutMotoHref} carroHref={checkoutCarroHref} />

      <div className="bg-verde-escuro">
        <hr className="border-white/8 max-w-6xl mx-auto" />
      </div>

      {/* Ciência (método) */}
      <ScienceSectionJean videoSrc={scienceVideoSrc} videoPoster={scienceVideoPoster} />

      {/* Benefícios */}
      <MoneyBurn />

      {/* Modo de uso */}
      <HowToUseJean />

      {/* Unboxing (transformação / prova na prática) */}
      <UnboxingJean />

      {/* Depoimentos (prova social) — prints reais de clientes */}
      <DepoimentosJean />

      {/* FAQ */}
      <FAQInfluencer />

      {/* CTA Final — id p/ o sticky saber onde parar */}
      <div id="cta-final-section">
        <CTAFinalInfluencer
          motoHref={checkoutMotoHref}
          carroHref={checkoutCarroHref}
          motoLabel="Quero meu sachê"
          carroLabel="Quero meu frasco"
        />
      </div>

      {/* Botão flutuante = CTA de compra (aparece no scroll, some na CTA final) */}
      <StickyPriceBar variant="ambos" motoHref={checkoutMotoHref} carroHref={checkoutCarroHref} />
    </main>
  );
}
