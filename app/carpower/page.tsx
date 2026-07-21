import type { Metadata } from "next";
import JeanLPTemplate from "@/components/lovable/influencer/jean/JeanLPTemplate";

export const metadata: Metadata = {
  title: "CarboZé — Vacine seu combustível",
  description:
    "O único otimizador molecular feito para o combustível brasileiro. Elimina umidade, melhora a combustão e protege o motor a cada abastecimento.",
  alternates: { canonical: "/carpower" },
};

export default function CarPowerPage() {
  return (
    <JeanLPTemplate
      bgImage="/LP_CARPOWER.webp"
      mobileBgImage="/LP_CARPOWER_MOBILE.webp"
      checkoutMotoHref="/checkoutsache-carpower"
      checkoutCarroHref="/checkoutpack100-carpower"
      scienceVideoSrc="/ciencia-carpower.mp4"
      scienceVideoPoster="/ciencia-carpower-poster.webp"
      scienceVideoAspect="9 / 16"
      heroCampaignSlide={false}
      showParceriaCarPower
    />
  );
}
