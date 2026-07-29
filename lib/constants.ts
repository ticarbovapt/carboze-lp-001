// ─── URLs base da loja (domínio oficial: loja.carboze.com.br) ─────────────────
const NS_MOTOS  = "https://loja.carboze.com.br/produtos/kit-10-saches-carboze-moto-10ml-tratamento-de-combustivel-e-protecao-do-motor/";
const NS_CARROS = "https://loja.carboze.com.br/produtos/carboze-kit-5-frascos-100ml-tratamento-de-combustivel-e-protecao-do-motor/";

// ─── Checkout padrão ─────────────────────────────────────────────────────────
export const CHECKOUT_MOTOS  = NS_MOTOS;
export const CHECKOUT_CARROS = NS_CARROS;
export const CHECKOUT_URL    = NS_MOTOS;

// ─── Upsell pré-checkout ──────────────────────────────────────────────────────
// SKU espelho do kit de frascos, cadastrado na loja a preço promocional.
// Só é ofertado a quem ia comprar o KIT SACHÊ (R$ 59,90): o ticket sobe para
// R$ 99,50 (+66%) e o "de R$ 149,50" é o preço real do kit normal.
// NÃO ofertar a quem já vai comprar o kit de frascos — ali seria desconto.
const NS_UPSELL_FRASCOS =
  "https://loja.carboze.com.br/produtos/carboze-kit-5-frascos-100ml-tratamento-de-combustivel-e-protecao-do-motor-copia-1p5z3/";

export const UPSELL = {
  /** Destino do upsell (kit 5 frascos a preço promocional). */
  href: NS_UPSELL_FRASCOS + "?utm_source=upsell",
  /** Para onde vai quem recusa: o kit sachê que ele já tinha escolhido. */
  declineHref: NS_MOTOS,
  precoDe: 149.5,
  precoPor: 99.5,
  /** O que o cliente ia levar antes da oferta. */
  origemPreco: 59.9,
  origemLitros: 100,
  litros: 500,
  /** Minutos do contador de urgência. */
  urgencyMinutes: 10,
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

// ─── Oferta de saída (/oferta + popup de exit intent) ─────────────────────────
// ATENÇÃO: o cupom precisa existir e estar ATIVO no admin da Nuvemshop.
// Sem isso a página promete um desconto que não aplica no carrinho.
// Trocar percentual/código aqui muda em todos os lugares de uma vez.
export const EXIT_OFFER = {
  code: "VOLTA10",
  percent: 10,
  /** Minutos do contador de urgência exibido no popup. */
  urgencyMinutes: 10,
} as const;
