import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LovableHeader from "@/components/LovableHeader";
import ExitOffer from "@/components/lovable/ExitOffer";
import DepoimentosJean from "@/components/lovable/influencer/jean/DepoimentosJean";
import FAQInstitucional from "@/components/lovable/institucional/FAQInstitucional";
import FloatingWhatsApp from "@/components/lovable/FloatingWhatsApp";
import { WHATSAPP_URL, EXIT_OFFER } from "@/lib/constants";

export const metadata: Metadata = {
  title: `CarboZé — ${EXIT_OFFER.percent}% de desconto no seu primeiro pedido`,
  description:
    "Cupom exclusivo para tratar o combustível da sua moto ou do seu carro. Válido para o kit sachê e o kit frasco, com frete grátis.",
  alternates: { canonical: "/cupom" },
  // Página de campanha: não deve competir com a home no orgânico.
  robots: { index: false, follow: true },
};

export default function CupomPage() {
  // Oferta desligada: esta página anunciaria um preço que o checkout não
  // entrega. Manda para a home em vez de 404, para não quebrar links já
  // divulgados.
  if (!EXIT_OFFER.enabled) redirect("/");

  return (
    <main>
      <LovableHeader
        checkoutHref="#oferta"
        suporteHref={WHATSAPP_URL}
        ctaLabel="Pegar desconto"
      />

      <section className="bg-verde-escuro py-14 md:py-20" id="oferta">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <p className="font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-xs tracking-widest mb-4 text-center">
            Oferta exclusiva
          </p>
          <h1 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-4 text-center max-w-2xl mx-auto">
            Seu combustível tratado por{" "}
            <span className="text-limao">{EXIT_OFFER.percent}% menos.</span>
          </h1>
          <p className="font-[family-name:var(--font-archivo)] text-white/60 text-base md:text-lg leading-relaxed max-w-xl mx-auto text-center mb-10">
            Vale para o sachê de 10ml e para o frasco de 100ml — somado ao frete grátis
            que já está incluso.
          </p>

          <ExitOffer variant="inline" />
        </div>
      </section>

      <DepoimentosJean />
      <FAQInstitucional />
      <FloatingWhatsApp />
    </main>
  );
}
