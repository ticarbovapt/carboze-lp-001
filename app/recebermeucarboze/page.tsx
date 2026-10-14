import type { Metadata } from "next";
import QueroTestarForm from "./QueroTestarForm";

export const metadata: Metadata = {
  title: "Receba seu CarboZé para testar",
  description:
    "Cadastre-se para receber o CarboZé e testar na sua moto. Vagas limitadas.",
  alternates: { canonical: "/recebermeucarboze" },
};

export default function ReceberMeuCarbozePage() {
  return <QueroTestarForm />;
}
