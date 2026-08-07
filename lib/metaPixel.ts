/**
 * Meta Pixel — instalado direto no código, sem GTM.
 *
 * O container GTM existia apenas para carregar este Pixel (nenhum GA4, nenhuma
 * outra tag, dataLayer só com eventos nativos). Tirá-lo do caminho elimina uma
 * requisição de ~100KB e faz o PageView disparar mais cedo.
 */

export const META_PIXEL_ID = "2456614714856611";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[] };
  }
}

/**
 * Dispara um evento padrão do Meta. Silencioso se o Pixel ainda não carregou —
 * rastreio nunca pode quebrar a página.
 */
export function track(evento: string, params?: Params) {
  try {
    if (typeof window === "undefined" || typeof window.fbq !== "function") return;
    window.fbq("track", evento, params);
  } catch {
    /* ignora */
  }
}

/** Valor do pedido por produto, para os eventos que precisam de valor. */
export const VALOR = {
  sache: 59.9,
  pack: 149.5,
} as const;
