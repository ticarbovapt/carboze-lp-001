"use client";

import { useEffect } from "react";
import { marcarProduto, produtoDaUrl } from "@/lib/funnelState";
import { track, VALOR } from "@/lib/metaPixel";

/**
 * Anota qual produto o cliente escolheu, para o /upsell oferecer o mesmo
 * depois da compra (sachê → upsell sachê, pack → upsell pack), e dispara o
 * InitiateCheckout do Meta no mesmo clique.
 *
 * Um único listener no documento em vez de onClick espalhado pelos ~6
 * componentes que levam à loja (ProductPicker, StickyPriceBar, CTAFinal,
 * ExitOffer, Hero...). Assim nenhum caminho novo escapa por esquecimento.
 *
 * Montado no layout raiz — vale para todas as LPs.
 */
export default function FunnelTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const alvo = (e.target as HTMLElement | null)?.closest?.("a[href]");
      if (!alvo) return;
      const href = alvo.getAttribute("href") ?? "";
      const p = produtoDaUrl(href);
      if (!p) return;

      marcarProduto(p);

      // Saiu da LP para a loja: é o início de checkout do ponto de vista do
      // Meta. O Purchase em si acontece no domínio da loja, não aqui.
      track("InitiateCheckout", {
        content_name: p === "sache" ? "Kit 10 Sachês 10ml" : "Kit 5 Frascos 100ml",
        content_type: "product",
        value: VALOR[p],
        currency: "BRL",
      });
    }
    // Captura: registra mesmo que o handler do componente pare a propagação.
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
