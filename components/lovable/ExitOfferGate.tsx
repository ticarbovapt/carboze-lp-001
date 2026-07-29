"use client";

import { useEffect, useState } from "react";
import ExitOffer from "./ExitOffer";
import { useExitIntent } from "./useExitIntent";

/**
 * Liga os gatilhos de saída ao popup de oferta.
 * Montar uma única vez por página (no fim do <main>).
 *
 * `?oferta=1` abre na hora, ignorando os gatilhos e a trava de sessão —
 * serve para testar e para mandar o link já com a oferta aberta.
 */
export default function ExitOfferGate() {
  const [forced, setForced] = useState(false);
  const { open, close } = useExitIntent({
    backButton: true,
    desktopExitIntent: true,
    inactivitySeconds: 45,
  });

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("oferta") === "1") {
      setForced(true);
    }
  }, []);

  const visible = forced || open;
  if (!visible) return null;

  return (
    <ExitOffer
      variant="modal"
      onClose={() => {
        setForced(false);
        close();
      }}
    />
  );
}
