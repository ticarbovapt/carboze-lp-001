import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PaginaRoleta from "@/components/roleta/PaginaRoleta";
import { ROLETA } from "@/lib/constants";

export const metadata: Metadata = {
  title: "CarboZé — Gire a roleta e concorra a prêmios",
  description:
    "Oferta liberada depois da sua compra: gire a roleta CarboZé e concorra a prêmios, com 20% off no kit garantido.",
  // Etapa de funil, atrás da compra: não indexar.
  robots: { index: false, follow: false },
};

export default function Up1Page() {
  // Roleta desligada: manda para o upsell direto, que entrega o mesmo desconto
  // sem a roda. Nunca 404 — este link vai em snippet de pós-compra e some do
  // nosso controle assim que é publicado.
  if (!ROLETA.enabled) redirect("/upsell");

  // Variante B: o botão de girar é o próprio miolo da roda. Fora isso é a
  // mesma engrenagem da /up — o teste mede o botão, e nada além dele.
  return <PaginaRoleta variante="miolo" />;
}
