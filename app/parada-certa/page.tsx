import type { Metadata } from "next";
import ParadaCertaForm from "./ParadaCertaForm";

export const metadata: Metadata = {
  title: { absolute: "Ação Parada Certa — Grupo Carbo" },
  description:
    "Agende o horário para o check-up do seu veículo na Ação Parada Certa, em Natal/RN. Vagas limitadas.",
  alternates: { canonical: "/parada-certa" },
  openGraph: {
    title: "Ação Parada Certa — Grupo Carbo",
    description:
      "Agende o horário para o check-up do seu veículo na Ação Parada Certa, em Natal/RN. Vagas limitadas.",
    type: "website",
  },
};

export default function ParadaCertaPage() {
  return <ParadaCertaForm />;
}
