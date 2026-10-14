import type { Metadata } from "next";
import QueroTestarForm from "./QueroTestarForm";

export const metadata: Metadata = {
  title: "Teste o CarboZé na sua moto",
  description:
    "Cadastre-se para receber o CarboZé e testar no seu veículo. Vagas limitadas.",
  alternates: { canonical: "/quero-testar" },
};

export default function QueroTestarPage() {
  return <QueroTestarForm />;
}
