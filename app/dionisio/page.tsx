import type { Metadata } from "next";
import InfluencerLPTemplate from "@/components/lovable/influencer/InfluencerLPTemplate";

export const metadata: Metadata = {
  title: "CarboZé — Vacine seu combustível",
  description:
    "O único otimizador molecular feito para o combustível brasileiro. Elimina umidade, melhora a combustão e protege o motor a cada abastecimento.",
  alternates: { canonical: "/dionisio" },
};

export default function DionisioPage() {
  return <InfluencerLPTemplate bgImage="/LP_INFLUENCERS_3.webp" mobileBgImage="/LP_INFLUENCERS_MOBILE.webp" />;
}
