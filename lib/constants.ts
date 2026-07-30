// ─── URLs base da loja (domínio oficial: loja.carboze.com.br) ─────────────────
const NS_MOTOS  = "https://loja.carboze.com.br/produtos/kit-10-saches-carboze-moto-10ml-tratamento-de-combustivel-e-protecao-do-motor/";
const NS_CARROS = "https://loja.carboze.com.br/produtos/carboze-kit-5-frascos-100ml-tratamento-de-combustivel-e-protecao-do-motor/";

// ─── Checkout padrão ─────────────────────────────────────────────────────────
export const CHECKOUT_MOTOS  = NS_MOTOS;
export const CHECKOUT_CARROS = NS_CARROS;
export const CHECKOUT_URL    = NS_MOTOS;

// ─── Checkout da oferta de saída ("Back") ────────────────────────────────────
// SKUs espelho cadastrados na loja já com 5% aplicado no preço:
//   sachê  R$ 59,90 → R$ 56,90      frascos  R$ 149,50 → R$ 142,00
// Preço conferido em nuvemshop:price. Como o desconto vem do produto, o
// usuário não digita cupom nenhum — é o que tira a fricção do popup.
const NS_BACK_MOTOS  = "https://loja.carboze.com.br/produtos/kit-10-saches-carboze-10ml-tratamento-de-combustivel-e-protecao-do-motor-copia-1lk26/";
const NS_BACK_CARROS = "https://loja.carboze.com.br/produtos/upsell-carboze-kit-5-frascos-100ml-tratamento-de-combustivel-e-protecao-do-motor-copia-1wgnb/";

/**
 * Link do desconto de saída, preservando a atribuição da campanha.
 * Sem o utm_source, a venda vinda de uma LP de influencer fica sem origem.
 */
export function backCheckout(produto: "motos" | "carros", utmSource?: string) {
  const base = produto === "motos" ? NS_BACK_MOTOS : NS_BACK_CARROS;
  return utmSource ? `${base}?utm_source=${utmSource}` : base;
}

// ─── Upsell PÓS-COMPRA (/upsell) ─────────────────────────────────────────────
// SKUs "UpSell" cadastrados na loja com 20% abatido no preço:
//   sachê  R$ 59,90 → R$ 47,90      frascos  R$ 149,50 → R$ 119,60
//
// Esta oferta roda DEPOIS do pagamento confirmado. É o que a torna segura:
// como o 1º pedido já fechou, a compra aqui vira um segundo pedido e SOMA ao
// ticket. Os mesmos preços antes do checkout seriam desconto, não upsell —
// o carrinho estaria vazio e o cliente pagaria o menor valor no lugar do cheio.
const NS_UPSELL_MOTOS =
  "https://loja.carboze.com.br/produtos/kit-10-saches-carboze-10ml-tratamento-de-combustivel-e-protecao-do-motor-copia-fovns/";
const NS_UPSELL_CARROS =
  "https://loja.carboze.com.br/produtos/carboze-kit-5-frascos-100ml-tratamento-de-combustivel-e-protecao-do-motor-copia-1p5z3/";

export const UPSELL = {
  /** Minutos do contador de urgência. */
  urgencyMinutes: 15,
  /** Para onde vai quem recusa a oferta. */
  declineHref: "/obrigado",
  /**
   * `por` PRECISA bater com o preço do SKU "UpSell" correspondente na
   * Nuvemshop — é o número que o cliente vê aqui e espera no checkout.
   */
  produtos: {
    moto: {
      titulo: "Kit 10 sachês 10ml",
      subtitulo: "Ideal para moto · trata 100 litros",
      de: "R$ 59,90",
      por: "R$ 47,90",
      href: NS_UPSELL_MOTOS + "?utm_source=upsell",
    },
    carro: {
      titulo: "Kit 5 frascos 100ml",
      subtitulo: "Ideal para carro · trata 500 litros",
      de: "R$ 149,50",
      por: "R$ 119,60",
      href: NS_UPSELL_CARROS + "?utm_source=upsell",
    },
  },
} as const;

// ─── Kit 6 meses (oferta pós-NPS) ─────────────────────────────────────────────
// PROVISÓRIO: aponta p/ o kit de carros até existir o produto "6 meses".
// Trocar a URL abaixo quando o produto real for criado na loja.
export const CHECKOUT_KIT6M = NS_CARROS + "?utm_source=nps";

// ─── Influencer (genérico) ───────────────────────────────────────────────────
export const CHECKOUT_INFLUENCER_MOTOS  = NS_MOTOS  + "?utm_source=influencer";
export const CHECKOUT_INFLUENCER_CARROS = NS_CARROS + "?utm_source=influencer";

// ─── Jean ────────────────────────────────────────────────────────────────────
export const CHECKOUT_JEAN_MOTOS  = NS_MOTOS  + "?utm_source=jean";
export const CHECKOUT_JEAN_CARROS = NS_CARROS + "?utm_source=jean";

// ─── CarPower (LP espelhada da /jean, com UTM próprio) ───────────────────────
export const CHECKOUT_CARPOWER_MOTOS  = NS_MOTOS  + "?utm_source=carpower";
export const CHECKOUT_CARPOWER_CARROS = NS_CARROS + "?utm_source=carpower";

// ─── Dionísio ────────────────────────────────────────────────────────────────
export const CHECKOUT_DIONISIO_MOTOS  = NS_MOTOS  + "?utm_source=dionisio";
export const CHECKOUT_DIONISIO_CARROS = NS_CARROS + "?utm_source=dionisio";

// ─── TarjaPreta ──────────────────────────────────────────────────────────────
export const CHECKOUT_TARJAPRETA_MOTOS  = NS_MOTOS  + "?utm_source=tarjapreta";
export const CHECKOUT_TARJAPRETA_CARROS = NS_CARROS + "?utm_source=tarjapreta";

// ─── Nenel ───────────────────────────────────────────────────────────────────
export const CHECKOUT_NENEL_MOTOS  = NS_MOTOS  + "?utm_source=nenel";
export const CHECKOUT_NENEL_CARROS = NS_CARROS + "?utm_source=nenel";

// ─── Contato e social ─────────────────────────────────────────────────────────
export const WHATSAPP_NUMBER = "5511400021128";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/ocarboze",
  youtube: "https://youtube.com/@carboze",
  website: "https://carboze.com.br",
};

export const STORES = {
  mercadolivre: "#",
  amazon: "#",
};

// ─── Oferta de saída (/cupom + popup de exit intent) ─────────────────────────
// O desconto vem dos SKUs "Back" acima (preço já abatido), não de cupom.
// Ao mudar `percent` aqui, ajuste também o preço desses SKUs na Nuvemshop —
// senão o popup anuncia um percentual diferente do que o checkout cobra.
export const EXIT_OFFER = {
  /**
   * Liga/desliga o popup de saída em TODAS as LPs de uma vez (home, /jean,
   * /carpower, /dionisio). Desligado também ignora o `?cupom=1`.
   * A rota /cupom segue a mesma flag: desligada, redireciona para a home.
   */
  enabled: true,
  percent: 5,
  /** Minutos do contador de urgência exibido no popup. */
  urgencyMinutes: 10,
  /**
   * Preços exibidos no popup. `por` PRECISA bater com o preço do SKU "Back"
   * correspondente na Nuvemshop — é o número que o cliente vê aqui e espera
   * encontrar no checkout. Conferir em nuvemshop:price ao mexer.
   */
  produtos: {
    moto: {
      titulo: "Moto · Kit 10 sachês",
      de: "R$ 59,90",
      por: "R$ 56,90",
    },
    carro: {
      titulo: "Carro · Kit 5 frascos",
      de: "R$ 149,50",
      por: "R$ 142,00",
    },
  },
} as const;
