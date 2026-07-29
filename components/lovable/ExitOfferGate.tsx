"use client";

import ExitOffer from "./ExitOffer";
import { useExitIntent } from "./useExitIntent";

/**
 * Liga os gatilhos de saída ao popup de oferta.
 * Montar uma única vez por página (no fim do <main>).
 */
export default function ExitOfferGate() {
  const { open, close } = useExitIntent({
    backButton: true,
    desktopExitIntent: true,
    inactivitySeconds: 45,
  });

  if (!open) return null;
  return <ExitOffer variant="modal" onClose={close} />;
}
