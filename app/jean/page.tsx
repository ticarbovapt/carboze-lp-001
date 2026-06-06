import type { Metadata } from "next";
import JeanLPTemplate from "@/components/lovable/influencer/jean/JeanLPTemplate";

export const metadata: Metadata = {
  title: "CarboZé — Vacine seu combustível",
  description:
    "O único otimizador molecular feito para o combustível brasileiro. Elimina umidade, melhora a combustão e protege o motor a cada abastecimento.",
};

export default function JeanPage() {
  return (
    <JeanLPTemplate
      bgImage="/LP_INFLUENCERS_3.png"
      mobileBgImage="/LP_INFLUENCERS_MOBILE.png"
      checkoutMotoHref="/checkoutsache-jean"
      checkoutCarroHref="/checkoutpack100-jean"
    />
  );
}
