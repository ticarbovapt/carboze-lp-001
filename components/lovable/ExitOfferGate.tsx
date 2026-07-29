"use client";

import { useEffect, useState } from "react";
import ExitOffer from "./ExitOffer";
import { useExitIntent } from "./useExitIntent";
import { EXIT_OFFER } from "@/lib/constants";

interface ExitOfferGateProps {
  /**
   * Campanha desta LP (ex.: "carpower", "jean", "dionisio"). Vira utm_source
   * no link do desconto — é o que impede a venda vinda do popup de perder
   * a atribuição. Home não passa nada.
   */
  utmSource?: string;
}

/**
 * Liga os gatilhos de saída ao popup de oferta.
 * Montar uma única vez por página (no fim do <main>).
 *
 * `?cupom=1` (ou o antigo `?oferta=1`) abre na hora, ignorando os gatilhos e a
 * trava de sessão — serve para testar e para mandar o link já com a oferta aberta.
 */
export default function ExitOfferGate({ utmSource }: ExitOfferGateProps = {}) {
  const [forced, setForced] = useState(false);

  // Desligado = nenhum gatilho é instalado. Em especial o backButton: se ele
  // continuasse ativo, o guarda no histórico seria empilhado do mesmo jeito e
  // o 1º "voltar" não faria nada — o usuário ficaria preso sem ver oferta.
  const { open, close } = useExitIntent({
    backButton: EXIT_OFFER.enabled,
    desktopExitIntent: EXIT_OFFER.enabled,
    inactivitySeconds: EXIT_OFFER.enabled ? 45 : 0,
  });

  useEffect(() => {
    if (!EXIT_OFFER.enabled) return;
    const q = new URLSearchParams(window.location.search);
    if (q.get("cupom") === "1" || q.get("oferta") === "1") {
      setForced(true);
    }
  }, []);

  const visible = EXIT_OFFER.enabled && (forced || open);
  if (!visible) return null;

  return (
    <ExitOffer
      variant="modal"
      utmSource={utmSource}
      onClose={() => {
        setForced(false);
        close();
      }}
    />
  );
}
