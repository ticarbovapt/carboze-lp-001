"use client";

import { useEffect } from "react";
import { marcarProduto, produtoDaUrl } from "@/lib/funnelState";

/**
 * Anota qual produto o cliente escolheu, para o /upsell oferecer o mesmo
 * depois da compra (sachê → upsell sachê, pack → upsell pack).
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
      const p = produtoDaUrl(alvo.getAttribute("href") ?? "");
      if (p) marcarProduto(p);
    }
    // Captura: registra mesmo que o handler do componente pare a propagação.
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
