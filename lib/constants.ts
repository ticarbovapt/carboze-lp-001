// ─── URLs base Nuvemshop ──────────────────────────────────────────────────────
const NS_MOTOS  = "https://carboze.lojavirtualnuvem.com.br/produtos/kit-10-saches-carboze-moto-10ml-tratamento-de-combustivel-e-protecao-do-motor/";
const NS_CARROS = "https://carboze.lojavirtualnuvem.com.br/produtos/carboze-kit-5-frascos-100ml-tratamento-de-combustivel-e-protecao-do-motor/";

// ─── Checkout padrão ─────────────────────────────────────────────────────────
export const CHECKOUT_MOTOS  = NS_MOTOS;
export const CHECKOUT_CARROS = NS_CARROS;
export const CHECKOUT_URL    = NS_MOTOS;

// ─── Kit 6 meses (oferta pós-NPS) ─────────────────────────────────────────────
// PROVISÓRIO: aponta p/ o kit de carros até existir o produto "6 meses".
// Trocar a URL abaixo quando o produto real for criado na loja.
export const CHECKOUT_KIT6M = NS_CARROS + "?utm_source=nps";

// ─── Influencer (genérico) ───────────────────────────────────────────────────
export const CHECKOUT_INFLUENCER_MOTOS  = NS_MOTOS  + "?utm_source=influencer";
export const CHECKOUT_INFLUENCER_CARROS = NS_CARROS + "?utm_source=influencer";

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
