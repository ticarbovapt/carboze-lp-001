// ─── URLs base da loja (domínio oficial: loja.carboze.com.br) ─────────────────
const NS_MOTOS  = "https://loja.carboze.com.br/produtos/kit-10-saches-carboze-moto-10ml-tratamento-de-combustivel-e-protecao-do-motor/";
const NS_CARROS = "https://loja.carboze.com.br/produtos/carboze-kit-5-frascos-100ml-tratamento-de-combustivel-e-protecao-do-motor/";

// ─── VSL hospedada no VTurb ──────────────────────────────────────────────────
// Mesma VSL na seção "A ciência" de todas as LPs. Trocar o vídeo é editar
// estes dois IDs aqui — não em cada página.
export const VSL_VTURB = {
  playerId: "6a7b81237f05f7fc40d60445",
  /** ID do vídeo no CDN. Só para inspeção do manifesto HLS em diagnóstico. */
  videoId: "6a7b80dedc6ab33a6aa04626",
} as const;

// ─── Rota do funil ───────────────────────────────────────────────────────────
// Vai em utm_source para o pedido nascer identificado no admin da loja.
// A campanha (jean, carpower...) vai em utm_campaign, senão as duas
// informações disputariam o mesmo campo e uma se perderia.
export const ROTA = {
  /** LP → checkout. Compra direta, sem oferta no meio. */
  direta: "rotaA",
  /** Oferta pós-compra (/upsell). Gera um 2º pedido que soma ao ticket. */
  upsell: "rotaB",
  /** Popup de saída (Back). Desconto para quem ia embora. */
  back: "rotaC",
} as const;

/** Monta a URL da loja com rota e, quando houver, campanha. */
function comUtm(base: string, rota: string, campanha?: string) {
  const q = new URLSearchParams({ utm_source: rota });
  if (campanha) q.set("utm_campaign", campanha);
  return `${base}?${q.toString()}`;
}

// ─── Checkout padrão ─────────────────────────────────────────────────────────
export const CHECKOUT_MOTOS  = comUtm(NS_MOTOS, ROTA.direta);
export const CHECKOUT_CARROS = comUtm(NS_CARROS, ROTA.direta);
export const CHECKOUT_URL    = CHECKOUT_MOTOS;

// ─── Checkout da oferta de saída ("Back") ────────────────────────────────────
// SKUs espelho cadastrados na loja já com 5% aplicado no preço:
//   sachê  R$ 59,90 → R$ 56,90      frascos  R$ 149,50 → R$ 142,00
// Preço conferido em nuvemshop:price. Como o desconto vem do produto, o
// usuário não digita cupom nenhum — é o que tira a fricção do popup.
const NS_BACK_MOTOS  = "https://loja.carboze.com.br/produtos/kit-10-saches-carboze-10ml-tratamento-de-combustivel-e-protecao-do-motor-copia-1lk26/";
const NS_BACK_CARROS = "https://loja.carboze.com.br/produtos/upsell-carboze-kit-5-frascos-100ml-tratamento-de-combustivel-e-protecao-do-motor-copia-1wgnb/";

/**
 * Link do desconto de saída. `utm_source=rotaC` marca o pedido como vindo do
 * Back; a campanha da LP vai em utm_campaign para não perder a origem.
 */
export function backCheckout(produto: "motos" | "carros", campanha?: string) {
  const base = produto === "motos" ? NS_BACK_MOTOS : NS_BACK_CARROS;
  return comUtm(base, ROTA.back, campanha);
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
      href: comUtm(NS_UPSELL_MOTOS, ROTA.upsell),
    },
    carro: {
      titulo: "Kit 5 frascos 100ml",
      subtitulo: "Ideal para carro · trata 500 litros",
      de: "R$ 149,50",
      por: "R$ 119,60",
      href: comUtm(NS_UPSELL_CARROS, ROTA.upsell),
    },
  },
} as const;

// ─── Kit 6 meses (oferta pós-NPS) ─────────────────────────────────────────────
// PROVISÓRIO: aponta p/ o kit de carros até existir o produto "6 meses".
// Trocar a URL abaixo quando o produto real for criado na loja.
export const CHECKOUT_KIT6M = comUtm(NS_CARROS, ROTA.direta, "nps");

// ─── Influencer (genérico) ───────────────────────────────────────────────────
export const CHECKOUT_INFLUENCER_MOTOS  = comUtm(NS_MOTOS, ROTA.direta, "influencer");
export const CHECKOUT_INFLUENCER_CARROS = comUtm(NS_CARROS, ROTA.direta, "influencer");

// ─── Jean ────────────────────────────────────────────────────────────────────
export const CHECKOUT_JEAN_MOTOS  = comUtm(NS_MOTOS, ROTA.direta, "jean");
export const CHECKOUT_JEAN_CARROS = comUtm(NS_CARROS, ROTA.direta, "jean");

// ─── CarPower (LP espelhada da /jean, com UTM próprio) ───────────────────────
export const CHECKOUT_CARPOWER_MOTOS  = comUtm(NS_MOTOS, ROTA.direta, "carpower");
export const CHECKOUT_CARPOWER_CARROS = comUtm(NS_CARROS, ROTA.direta, "carpower");

// ─── Dionísio ────────────────────────────────────────────────────────────────
export const CHECKOUT_DIONISIO_MOTOS  = comUtm(NS_MOTOS, ROTA.direta, "dionisio");
export const CHECKOUT_DIONISIO_CARROS = comUtm(NS_CARROS, ROTA.direta, "dionisio");

// ─── TarjaPreta ──────────────────────────────────────────────────────────────
export const CHECKOUT_TARJAPRETA_MOTOS  = comUtm(NS_MOTOS, ROTA.direta, "tarjapreta");
export const CHECKOUT_TARJAPRETA_CARROS = comUtm(NS_CARROS, ROTA.direta, "tarjapreta");

// ─── Nenel ───────────────────────────────────────────────────────────────────
export const CHECKOUT_NENEL_MOTOS  = comUtm(NS_MOTOS, ROTA.direta, "nenel");
export const CHECKOUT_NENEL_CARROS = comUtm(NS_CARROS, ROTA.direta, "nenel");

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

// ─── Roleta de prêmios (/up) ─────────────────────────────────────────────────
// Variante do upsell pós-compra: em vez do card de desconto direto (/upsell),
// o cliente gira uma roleta. O prêmio que sustenta a página é o mesmo kit com
// 20% off — os demais são reais, mas raros.
//
// LEIA ANTES DE MEXER NOS PESOS:
//
// 1. A roleta é sorteada por peso, não em partes iguais. `peso` é relativo à
//    soma de todos os pesos: com a tabela abaixo (soma 100), `peso: 62` é 62%.
//    Isso é o padrão do mercado para roleta de oferta, mas é uma roleta viciada
//    — o desenho tem 5 gomos iguais e as chances não são iguais. Se a promoção
//    for divulgada como sorteio, iguale os pesos ou informe as probabilidades.
//
// 2. Os prêmios físicos (viagem, vale-combustível, vestuário) criam obrigação
//    real de entrega para quem tirar. No Brasil, distribuição gratuita de
//    prêmios por sorteio depende de autorização (Lei 5.768/71, SPA/MF): isso é
//    decisão de negócio/jurídico, não do código. Para desligar um prêmio sem
//    tirá-lo da roda, ponha `peso: 0` — ele aparece no desenho e nunca sai.
//
// 3. `peso: 0` em TODOS os prêmios trava o sorteio. Ao menos um peso > 0.
//
// Os SKUs são os mesmos "UpSell" do /upsell — o desconto é o mesmo, muda só a
// embalagem da oferta. `utm_campaign=roleta` é o que separa as duas no admin.

/** Como o cliente resgata o que tirou. */
export type ResgateRoleta =
  /** Vai direto ao checkout do SKU com desconto já no preço. */
  | "checkout"
  /** Fala com o time no WhatsApp levando o código do giro. */
  | "whatsapp"
  /** Não ganhou: segue para a oferta de consolação. */
  | "consolo";

export type PremioRoleta = {
  id: string;
  /**
   * Arte do gomo, em /public/roleta. Normalizada em quadrado, com a ponta da
   * cunha encostada embaixo — é o que faz as cinco encaixarem igual. Prêmio
   * novo exige arte nova no mesmo formato: o gomo não desenha nada sozinho.
   */
  arte: string;
  /** O que a arte diz, em texto. É a legenda que o leitor de tela anuncia. */
  linhas: readonly string[];
  /** Peso do sorteio. Ver observação 1 acima. */
  peso: number;
  /** Muda a cor do gomo e do card: `nada` é o único vermelho. */
  tom: "oferta" | "premio" | "nada";
  titulo: string;
  descricao: string;
  ctaLabel: string;
  resgate: ResgateRoleta;
};

export const ROLETA = {
  /**
   * Desliga a roleta inteira. Desligada, /up manda para /upsell — que oferece
   * o mesmo kit com 20%, só sem a roda. Nunca 404: o link vai em snippet de
   * pós-compra e em campanha, e some do nosso controle depois de publicado.
   */
  enabled: true,

  /** Para onde vai quem gira e não quer o prêmio. */
  declineHref: "/obrigado",

  /** Duração do giro, em ms. Abaixo de ~4s a roda não parece pesada. */
  duracaoGiroMs: 5200,

  /** Voltas completas antes de mirar o gomo sorteado. */
  voltasMin: 6,
  voltasMax: 9,

  /**
   * Pinos na borda. Definem o ritmo do clique: um tique a cada 360/pinos graus.
   * O desenho da borda usa o mesmo número, para o som bater com o que se vê.
   */
  pinos: 20,

  /**
   * Ordem HORÁRIA a partir do ponteiro (12h). O primeiro item é o gomo que
   * está sob o ponteiro com a roda parada — mexer na ordem gira o desenho.
   */
  premios: [
    {
      id: "kit20",
      arte: "/roleta/kit20.webp",
      linhas: ["KIT CARBOZÉ", "5 FRASCOS", "20% OFF"],
      peso: 62,
      tom: "oferta",
      titulo: "20% OFF no Kit CarboZé",
      descricao:
        "O desconto já vem aplicado no preço, com frete grátis — não precisa digitar cupom nenhum.",
      ctaLabel: "Resgatar meus 20% off",
      resgate: "checkout",
    },
    {
      id: "vale200",
      arte: "/roleta/vale200.webp",
      linhas: ["VALE COMBUSTÍVEL", "R$200,00"],
      peso: 2,
      tom: "premio",
      titulo: "Vale-combustível de R$ 200",
      descricao:
        "Mande o código do seu giro no WhatsApp para o time confirmar o prêmio e combinar como você recebe o vale.",
      ctaLabel: "Falar com o time e resgatar",
      resgate: "whatsapp",
    },
    {
      id: "nada",
      arte: "/roleta/nada.webp",
      linhas: ["NÃO FOI", "DESSA VEZ"],
      peso: 30,
      tom: "nada",
      titulo: "Não foi dessa vez",
      descricao:
        "A roda parou no gomo vazio. Mas você não sai daqui de mãos abanando: como cliente, seus 20% off no kit continuam de pé.",
      ctaLabel: "Pegar meus 20% off assim mesmo",
      resgate: "consolo",
    },
    {
      id: "vestuario",
      arte: "/roleta/vestuario.webp",
      linhas: ["KIT VESTUÁRIO", "CARBOZÉ", "BONÉ + CASACO"],
      peso: 5,
      tom: "premio",
      titulo: "Kit vestuário CarboZé",
      descricao:
        "Boné + casaco CarboZé. Mande o código do seu giro no WhatsApp para o time confirmar o tamanho e o endereço de entrega.",
      ctaLabel: "Falar com o time e resgatar",
      resgate: "whatsapp",
    },
    {
      id: "interlagos",
      arte: "/roleta/interlagos.webp",
      linhas: ["VIAGEM PARA", "INTERLAGOS"],
      peso: 1,
      tom: "premio",
      titulo: "Viagem para Interlagos",
      descricao:
        "Mande o código do seu giro no WhatsApp para o time confirmar o prêmio e combinar as datas com você.",
      ctaLabel: "Falar com o time e resgatar",
      resgate: "whatsapp",
    },
  ] as const satisfies readonly PremioRoleta[],

  /** Checkout do prêmio `kit20` e da consolação do `nada`. */
  checkout: {
    carro: {
      titulo: "Kit 5 frascos 100ml",
      subtitulo: "Ideal para carro · trata 500 litros",
      de: "R$ 149,50",
      por: "R$ 119,60",
      href: comUtm(NS_UPSELL_CARROS, ROTA.upsell, "roleta"),
    },
    moto: {
      titulo: "Kit 10 sachês 10ml",
      subtitulo: "Ideal para moto · trata 100 litros",
      de: "R$ 59,90",
      por: "R$ 47,90",
      href: comUtm(NS_UPSELL_MOTOS, ROTA.upsell, "roleta"),
    },
  },
} as const;

/** Link de resgate no WhatsApp, já com o código do giro na mensagem. */
export function resgateWhatsApp(premio: string, codigo: string) {
  const texto = `Olá! Girei a roleta CarboZé e ganhei: ${premio}. Meu código é ${codigo}.`;
  return `${WHATSAPP_URL}?text=${encodeURIComponent(texto)}`;
}
