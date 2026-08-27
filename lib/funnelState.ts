/**
 * Estado do funil, do lado do cliente.
 *
 * Por que localStorage e não sessionStorage: o caminho de compra sai do nosso
 * domínio (loja.carboze.com.br) e volta pelo snippet pós-compra. O popup de
 * saída abre a loja em outra aba, e sessionStorage é por aba — a marca ficaria
 * na aba errada. localStorage é por origem, então sobrevive ao trajeto.
 *
 * Tudo tem validade: a marca vale para a compra em curso, não para sempre.
 * Sem isso, quem recusou o upsell hoje nunca mais veria a oferta.
 */

export type ProdutoFunil = "sache" | "pack";

const K_PRODUTO = "cz-funil-produto";
const K_RESOLVIDO = "cz-upsell-resolvido";
const K_ROLETA = "cz-roleta-giro";

/** Janela em que a marca é considerada válida. */
const TTL_MS = 24 * 60 * 60 * 1000;

type Marca = { valor: string; ts: number };

function gravar(chave: string, valor: string) {
  try {
    localStorage.setItem(chave, JSON.stringify({ valor, ts: Date.now() } satisfies Marca));
  } catch {
    /* storage bloqueado — o funil degrada para o comportamento neutro */
  }
}

function ler(chave: string): string | null {
  try {
    const cru = localStorage.getItem(chave);
    if (!cru) return null;
    const m = JSON.parse(cru) as Marca;
    if (!m?.ts || Date.now() - m.ts > TTL_MS) {
      localStorage.removeItem(chave);
      return null;
    }
    return m.valor;
  } catch {
    return null;
  }
}

/**
 * Descobre o produto a partir de uma URL de compra. Cobre as três variantes
 * de cada produto (normal, Back e UpSell), porque todas carregam o mesmo
 * trecho no slug.
 */
export function produtoDaUrl(href: string): ProdutoFunil | null {
  const h = href.toLowerCase();
  if (h.includes("kit-10-saches") || h.includes("/checkoutsache")) return "sache";
  if (h.includes("kit-5-frascos") || h.includes("/checkoutpack100")) return "pack";
  return null;
}

export function marcarProduto(p: ProdutoFunil) {
  // Pedido misto → pack. Se o cliente já passou pelo pack, um clique posterior
  // em sachê não rebaixa a marca — mesma regra que o snippet aplica quando lê
  // o pedido com os dois produtos.
  if (p === "sache" && ler(K_PRODUTO) === "pack") return;
  gravar(K_PRODUTO, p);
}

export function lerProduto(): ProdutoFunil | null {
  const v = ler(K_PRODUTO);
  return v === "sache" || v === "pack" ? v : null;
}

/** Aceitou ou recusou o upsell — nos dois casos a oferta não volta. */
export function marcarUpsellResolvido() {
  gravar(K_RESOLVIDO, "1");
}

export function upsellJaResolvido(): boolean {
  return ler(K_RESOLVIDO) === "1";
}

// ─── Roleta (/up) ────────────────────────────────────────────────────────────

export type GiroRoleta = {
  /** `id` do prêmio em ROLETA.premios. */
  premio: string;
  /** Código do giro, o que o cliente leva para o WhatsApp ao resgatar. */
  codigo: string;
};

/**
 * Validade do giro. Sete dias, não as 24h do resto do funil: o resultado aqui
 * não é só uma marca de "já ofertamos", é o comprovante de um prêmio. Quem
 * tirou o vale-combustível numa sexta e só foi resgatar na segunda precisa
 * reencontrar o código na tela.
 */
const TTL_ROLETA_MS = 7 * 24 * 60 * 60 * 1000;

/** Grava o resultado do giro. Um giro por navegador — não sobrescreve. */
export function gravarGiroRoleta(premio: string, codigo: string) {
  try {
    localStorage.setItem(
      K_ROLETA,
      JSON.stringify({ premio, codigo, ts: Date.now() }),
    );
  } catch {
    /* storage bloqueado: o giro vale só enquanto a aba estiver aberta */
  }
}

/** Resultado do giro anterior, ou null se nunca girou / passou da validade. */
export function lerGiroRoleta(): GiroRoleta | null {
  try {
    const cru = localStorage.getItem(K_ROLETA);
    if (!cru) return null;
    const g = JSON.parse(cru) as GiroRoleta & { ts?: number };
    if (!g?.ts || !g.premio || !g.codigo) return null;
    if (Date.now() - g.ts > TTL_ROLETA_MS) {
      localStorage.removeItem(K_ROLETA);
      return null;
    }
    return { premio: g.premio, codigo: g.codigo };
  } catch {
    return null;
  }
}

/**
 * Zera o funil. Existe para teste: refazer o percurso no mesmo navegador
 * exigiria abrir o DevTools a cada rodada. Chamado por `/upsell?reset=1` e
 * por `/up?reset=1`.
 */
export function limparFunil() {
  try {
    localStorage.removeItem(K_PRODUTO);
    localStorage.removeItem(K_RESOLVIDO);
    localStorage.removeItem(K_ROLETA);
  } catch {
    /* ignora */
  }
}
