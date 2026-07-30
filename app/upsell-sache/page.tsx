import { permanentRedirect } from "next/navigation";

/**
 * Slug antiga do upsell pré-checkout. O upsell passou a rodar DEPOIS do
 * pagamento (/upsell), onde a oferta soma ao ticket em vez de substituir.
 * Mantida para não quebrar links já publicados.
 */
export default function UpsellSachePage() {
  permanentRedirect("/upsell");
}
