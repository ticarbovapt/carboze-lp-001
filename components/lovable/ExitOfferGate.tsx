"use client";

import { useEffect, useState } from "react";
import ExitOffer from "./ExitOffer";
import { useExitIntent } from "./useExitIntent";

interface ExitOfferGateProps {
  /**
   * Destinos de checkout desta LP. As rotas de influencer carregam o
   * utm_source da campanha — passar os links certos aqui é o que impede
   * a venda vinda do popup de perder a atribuição.
   */
  motoHref?: string;
  carroHref?: string;
}

/**
 * Liga os gatilhos de saída ao popup de oferta.
 * Montar uma única vez por página (no fim do <main>).
 *
 * `?cupom=1` (ou o antigo `?oferta=1`) abre na hora, ignorando os gatilhos e a
 * trava de sessão — serve para testar e para mandar o link já com a oferta aberta.
 */
export default function ExitOfferGate({ motoHref, carroHref }: ExitOfferGateProps = {}) {
  const [forced, setForced] = useState(false);
  const { open, close } = useExitIntent({
    backButton: true,
    desktopExitIntent: true,
    inactivitySeconds: 45,
  });

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("cupom") === "1" || q.get("oferta") === "1") {
      setForced(true);
    }
  }, []);

  const visible = forced || open;
  if (!visible) return null;

  return (
    <ExitOffer
      variant="modal"
      motoHref={motoHref}
      carroHref={carroHref}
      onClose={() => {
        setForced(false);
        close();
      }}
    />
  );
}
