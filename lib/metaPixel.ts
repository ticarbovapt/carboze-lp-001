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
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; callMethod?: unknown };
    /** Ligado pelo `onload` do fbevents.js — ver MetaPixel.tsx. */
    __czFbReady?: boolean;
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

/**
 * A biblioteca já está processando chamadas (e não só enfileirando)?
 *
 * A flag vem do `onload` do script. O `callMethod` cobre a fresta entre o
 * fbevents.js executar (é quando ele cria o `callMethod` e consome a fila) e o
 * evento `load` chegar — um clique nesse meio não pode cair no beacon, senão
 * vira evento duplicado.
 */
function bibliotecaPronta(): boolean {
  return window.__czFbReady === true || typeof window.fbq?.callMethod === "function";
}

function lerCookie(nome: string): string | undefined {
  const m = document.cookie.match(new RegExp("(?:^|; )" + nome + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

/**
 * Mesmo endpoint da tag <noscript> do Meta. Vai só o que o próprio fbevents.js
 * mandaria sem dados de cliente: evento, valores do evento, página (sem query)
 * e os identificadores de navegador/anúncio (`_fbp`, `_fbc` ou o `fbclid` da
 * URL). Sem esses dois, a visita que chegou por anúncio e comprou antes da
 * biblioteca carregar perderia a atribuição ao clique.
 */
function urlDoBeacon(evento: string, params?: Params): string {
  const q = new URLSearchParams();
  q.set("id", META_PIXEL_ID);
  q.set("ev", evento);
  q.set("dl", location.origin + location.pathname);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) q.set(`cd[${k}]`, String(v));
    }
  }
  const fbp = lerCookie("_fbp");
  if (fbp) q.set("fbp", fbp);
  let fbc = lerCookie("_fbc");
  if (!fbc) {
    const clid = new URLSearchParams(location.search).get("fbclid");
    if (clid) fbc = `fb.1.${Date.now()}.${clid}`;
  }
  if (fbc) q.set("fbc", fbc);
  q.set("noscript", "1");
  return `https://www.facebook.com/tr?${q.toString()}`;
}

/**
 * Envia a requisição de um jeito que sobrevive à troca de página.
 *
 * `fetch` com `keepalive` é um GET igual ao da tag <noscript> e o navegador o
 * termina mesmo depois de a página morrer. `sendBeacon` (POST) fica de reserva
 * para navegador sem keepalive; `Image` é o último recurso — pode ser cancelada
 * na navegação, mas é melhor que nada.
 */
function enviarBeacon(url: string) {
  try {
    if (typeof fetch === "function") {
      fetch(url, { mode: "no-cors", keepalive: true, credentials: "include" }).catch(() => {});
      return;
    }
  } catch {
    /* cai para as alternativas */
  }
  try {
    if (navigator.sendBeacon?.(url)) return;
  } catch {
    /* cai para a imagem */
  }
  try {
    new Image().src = url;
  } catch {
    /* ignora */
  }
}

/**
 * Tira da fila do stub os `track` ainda não enviados e manda cada um por
 * beacon. Nada acontece se a biblioteca já carregou — aí ela mesma cuida.
 *
 * Existe porque o fbevents.js só é injetado depois do `load` + 5s e de uma pausa do usuário (ver
 * MetaPixel.tsx). Quem sai antes disso levaria o PageView/ViewContent para o
 * túmulo junto com a fila. Chamado ao esconder/fechar a página e antes do
 * InitiateCheckout. Os eventos saem da fila — se a pessoa voltar para a aba e
 * a biblioteca carregar depois, ela não os reenvia. `init` e `set` ficam.
 */
export function esvaziarFilaPorBeacon() {
  try {
    if (typeof window === "undefined") return;
    const fila = window.fbq?.queue;
    if (!fila?.length || bibliotecaPronta()) return;
    const resto: unknown[] = [];
    for (const item of fila) {
      const args = Array.prototype.slice.call(item as ArrayLike<unknown>);
      if (args[0] === "track" && typeof args[1] === "string") {
        enviarBeacon(urlDoBeacon(args[1], args[2] as Params | undefined));
      } else {
        resto.push(item);
      }
    }
    // Muta o mesmo array: é a referência que o fbevents.js vai ler.
    fila.length = 0;
    for (const item of resto) fila.push(item);
  } catch {
    /* ignora */
  }
}

/**
 * Para evento que acontece no instante em que a pessoa sai da página — o
 * InitiateCheckout, cujo clique navega para a loja.
 *
 * Com a biblioteca carregada, é um `fbq` normal (ela já usa beacon na saída).
 * Antes disso, o `fbq` só enfileiraria e a fila morreria com a página: o evento
 * vai por beacon, junto com o que estiver pendente na fila, na ordem. Nunca os
 * dois caminhos para o mesmo evento — o popup de saída abre a loja em outra
 * aba, a página continua viva e a biblioteca ainda carregaria depois; se o
 * evento estivesse na fila também, contaria duas vezes.
 */
export function trackGarantido(evento: string, params?: Params) {
  try {
    if (typeof window === "undefined") return;
    if (bibliotecaPronta()) {
      window.fbq?.("track", evento, params);
      return;
    }
    esvaziarFilaPorBeacon();
    enviarBeacon(urlDoBeacon(evento, params));
  } catch {
    /* ignora */
  }
}

/** Valor do pedido por produto, para os eventos que precisam de valor. */
export const VALOR = {
  sache: 59.9,
  pack: 149.5,
} as const;
