import { permanentRedirect } from "next/navigation";

/** Slug antiga. Mantida para não quebrar links já divulgados. */
export default function OfertaPage() {
  permanentRedirect("/cupom");
}
