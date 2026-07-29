"use client";

import { useEffect, useState } from "react";

interface UseExitIntentOptions {
  /** Intercepta o 1º "voltar" no mobile. O 2º sai de verdade. */
  backButton?: boolean;
  /** Mouse subindo para a barra de endereço (desktop). */
  desktopExitIntent?: boolean;
  /** Segundos de inatividade até disparar. 0 = desligado. */
  inactivitySeconds?: number;
  /** Não repetir na mesma sessão. */
  oncePerSession?: boolean;
  storageKey?: string;
}

/**
 * Dispara uma oferta de saída. Regras deliberadas:
 * - o "voltar" é interceptado UMA única vez; o segundo toque navega de fato,
 *   para não prender o usuário (política de anúncios + boa-fé).
 * - respeita quem já viu na sessão.
 */
export function useExitIntent({
  backButton = true,
  desktopExitIntent = true,
  inactivitySeconds = 45,
  oncePerSession = true,
  storageKey = "cz-exit-offer-seen",
}: UseExitIntentOptions = {}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (oncePerSession) {
      try {
        if (sessionStorage.getItem(storageKey)) return;
      } catch {
        /* sessionStorage indisponível — segue sem memória */
      }
    }

    let fired = false;
    const cleanups: Array<() => void> = [];

    const fire = () => {
      if (fired) return;
      fired = true;
      try {
        sessionStorage.setItem(storageKey, "1");
      } catch {
        /* ignora */
      }
      setOpen(true);
    };

    // ── Voltar (mobile + desktop) — intercepta uma vez só ──────────────────
    // Empilha UM único estado-guarda. O 1º "voltar" consome esse guarda e
    // abre a oferta sem sair da página. O 2º "voltar" já encontra a entrada
    // real e navega de fato — nunca re-empilhamos, senão o usuário ficaria
    // preso num loop de guardas.
    if (backButton) {
      history.pushState({ czExitGuard: true }, "");
      const onPopState = () => {
        if (fired) return;
        fire();
      };
      window.addEventListener("popstate", onPopState);
      cleanups.push(() => window.removeEventListener("popstate", onPopState));
    }

    // ── Exit intent no desktop ────────────────────────────────────────────
    if (desktopExitIntent) {
      const onMouseOut = (e: MouseEvent) => {
        if (e.relatedTarget || (e as MouseEvent & { toElement?: unknown }).toElement) return;
        if (e.clientY > 0) return; // só quando sobe para a barra de endereço
        fire();
      };
      document.addEventListener("mouseout", onMouseOut);
      cleanups.push(() => document.removeEventListener("mouseout", onMouseOut));
    }

    // ── Inatividade ───────────────────────────────────────────────────────
    if (inactivitySeconds > 0) {
      let timer: ReturnType<typeof setTimeout>;
      const reset = () => {
        clearTimeout(timer);
        timer = setTimeout(fire, inactivitySeconds * 1000);
      };
      const events: Array<keyof DocumentEventMap> = [
        "scroll",
        "pointerdown",
        "keydown",
        "touchstart",
      ];
      events.forEach((ev) => document.addEventListener(ev, reset, { passive: true }));
      reset();
      cleanups.push(() => {
        clearTimeout(timer);
        events.forEach((ev) => document.removeEventListener(ev, reset));
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, [backButton, desktopExitIntent, inactivitySeconds, oncePerSession, storageKey]);

  return { open, close: () => setOpen(false) };
}
