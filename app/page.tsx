import type { Metadata } from "next";
import LovableHeader from "@/components/LovableHeader";
import FloatingWhatsApp from "@/components/lovable/FloatingWhatsApp";
import HeroInfluencer from "@/components/lovable/influencer/HeroInfluencer";
import ProductPickerJean from "@/components/lovable/influencer/jean/ProductPickerJean";
import ScienceSectionJean from "@/components/lovable/influencer/jean/ScienceSectionJean";
import HowToUseJean from "@/components/lovable/influencer/jean/HowToUseJean";
import UnboxingJean from "@/components/lovable/influencer/jean/UnboxingJean";
import DepoimentosJean from "@/components/lovable/influencer/jean/DepoimentosJean";
import CTAFinalInfluencer from "@/components/lovable/influencer/CTAFinalInfluencer";
import FAQInstitucional from "@/components/lovable/institucional/FAQInstitucional";
import StickyPriceBar from "@/components/lovable/StickyPriceBar";
import FreteGratisPill from "@/components/lovable/FreteGratisPill";
import ExitOfferGate from "@/components/lovable/ExitOfferGate";
import ProblemHome from "@/components/lovable/home/ProblemHome";
import BeneficiosHome from "@/components/lovable/home/BeneficiosHome";
import { WHATSAPP_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "CarboZé — O único otimizador molecular para o combustível brasileiro",
  description:
    "A gasolina da bomba tem etanol. O diesel tem biodiesel. O CarboZé age na estrutura molecular do combustível, a cada abastecimento, antes do dano acontecer.",
  alternates: { canonical: "/" },
};

// Checkout próprio da home (sem UTM de campanha).
// Quem escolhe o sachê passa antes pelo upsell (kit de frascos a R$ 99,50):
// o ticket sobe de R$ 59,90 para R$ 99,50. Quem já escolheu o kit de frascos
// vai direto ao checkout — ofertar algo ali só reduziria o valor do pedido.
const CHECKOUT_MOTO = "/upsell-sache";
const CHECKOUT_CARRO = "/checkoutpack100";

// Carrossel do hero — só packshots de produto (sem foto de campanha)
const heroCarousel = [
  { desktop: "/hero-bg.webp", mobile: "/LP_SACHE_MOBILE.webp" },
  { desktop: "/cz-pack100-hero-bg.webp", mobile: "/CARBOZE_PACK_MOBILE.webp" },
];

export default function HomePage() {
  return (
    <main>
      {/* Preload do hero (LCP) desta rota */}
      <link rel="preload" as="image" href="/hero-bg.webp" fetchPriority="high" />

      <LovableHeader
        checkoutHref="#escolha-produto"
        suporteHref={WHATSAPP_URL}
        ctaLabel="Escolher Produto"
      />

      {/* Hero — gancho de economia + carrossel de produto */}
      <HeroInfluencer
        bgImage="/hero-bg.webp"
        mobileBgImage="/LP_SACHE_MOBILE.webp"
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

      {/* Produto + dosagem — preço e checkout na 2ª dobra */}
      <ProductPickerJean motoHref={CHECKOUT_MOTO} carroHref={CHECKOUT_CARRO} />

      {/* Diagnóstico → método: bloco escuro contínuo */}
      <ProblemHome />

      <div className="bg-verde-escuro">
        <hr className="border-white/8 max-w-6xl mx-auto" />
      </div>

      <ScienceSectionJean />

      {/* Benefícios: bolso + planeta (fusão) */}
      <BeneficiosHome />

      {/* Modo de uso */}
      <HowToUseJean />

      {/* Unboxing — prova na prática */}
      <UnboxingJean />

      {/* Depoimentos — prova social */}
      <DepoimentosJean />

      {/* FAQ — quebra de objeção + conteúdo indexável */}
      <FAQInstitucional />

      {/* CTA Final — id p/ o sticky saber onde parar */}
      <div id="cta-final-section">
        <CTAFinalInfluencer
          motoHref={CHECKOUT_MOTO}
          carroHref={CHECKOUT_CARRO}
          motoLabel="Quero economizar na moto"
          carroLabel="Quero economizar no carro"
        />
      </div>

      <StickyPriceBar variant="ambos" motoHref={CHECKOUT_MOTO} carroHref={CHECKOUT_CARRO} />

      {/* Pill de frete grátis — bottom-28 p/ não colidir com o sticky */}
      <FreteGratisPill href="#escolha-produto" bottomClass="bottom-28" />

      <FloatingWhatsApp />

      {/* Oferta de saída: 1º voltar (mobile), exit intent (desktop), 45s parado */}
      <ExitOfferGate />
    </main>
  );
}
