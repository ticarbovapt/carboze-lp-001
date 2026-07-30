/* ─────────────────────────────────────────────────────────────────────────────
 * CarboZé — Oferta pós-compra na tela de sucesso (Nuvemshop)
 *
 * ONDE COLAR
 *   Admin da loja → Configurações → Códigos externos →
 *   Códigos de conversão e tracking → Códigos de conversão →
 *   campo "Página de finalização"     (NÃO no "Página de confirmação")
 *
 *   Cole envolvido em <script> ... </script>.
 *
 * NÃO HÁ REDIRECT
 *   O bloco é desenhado DENTRO da tela de sucesso, no topo do conteúdo.
 *   O cliente continua vendo número do pedido, prazo e rastreio logo abaixo.
 *   É isso que preserva o disparo dos pixels (GTM/Meta/Google) — um redirect
 *   pode cortar a tag antes dela completar e a venda desaparece do Meta.
 *
 * POR QUE O PREÇO COM DESCONTO É SEGURO AQUI
 *   A compra vira um SEGUNDO pedido (a Nuvemshop não recobra o cartão sem novo
 *   checkout). Como o 1º pedido já foi pago, o valor SOMA ao ticket. Os mesmos
 *   preços antes do checkout seriam desconto: o carrinho estaria vazio e o
 *   cliente pagaria o menor valor no lugar do cheio.
 *
 * MANUTENÇÃO
 *   `por` precisa bater com o preço do SKU "UpSell" na Nuvemshop. Se mudar o
 *   preço lá, mude aqui — senão a tela promete um valor e o checkout cobra outro.
 * ────────────────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  var OFERTAS = [
    {
      titulo: "Kit 10 Sachês 10ml",
      sub: "Ideal para moto · trata 100 litros",
      de: "R$ 59,90",
      por: "R$ 47,90",
      href: "https://loja.carboze.com.br/produtos/kit-10-saches-carboze-10ml-tratamento-de-combustivel-e-protecao-do-motor-copia-fovns/?utm_source=posvenda",
    },
    {
      titulo: "Kit 5 Frascos 100ml",
      sub: "Ideal para carro · trata 500 litros",
      de: "R$ 149,50",
      por: "R$ 119,60",
      href: "https://loja.carboze.com.br/produtos/carboze-kit-5-frascos-100ml-tratamento-de-combustivel-e-protecao-do-motor-copia-1p5z3/?utm_source=posvenda",
    },
  ];

  var CFG = {
    minutos: 15,
    limao: "#a9da00",
    verdeEscuro: "#093a30",
    fonte: "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif",
  };

  var FLAG = "__czUpsellPosCompra";
  if (window[FLAG]) return; // guarda contra dupla injeção

  function botao(o) {
    return (
      '<a href="' +
      o.href +
      '" style="display:flex;align-items:center;justify-content:space-between;gap:12px;' +
      "background:" +
      CFG.limao +
      ";color:" +
      CFG.verdeEscuro +
      ";text-decoration:none;border-radius:14px;padding:14px 18px;margin-bottom:10px\">" +
      "<span style=\"text-align:left\">" +
      '<span style="display:block;font-weight:800;text-transform:uppercase;font-size:15px;line-height:1.2">' +
      o.titulo +
      "</span>" +
      '<span style="display:block;font-size:11.5px;opacity:.62;margin-top:2px">' +
      o.sub +
      "</span>" +
      '<span style="display:block;margin-top:5px">' +
      '<span style="font-size:13px;opacity:.5;text-decoration:line-through;margin-right:7px">' +
      o.de +
      "</span>" +
      '<span style="font-size:22px;font-weight:800">' +
      o.por +
      "</span>" +
      "</span>" +
      "</span>" +
      '<span style="font-size:20px;font-weight:800">&rarr;</span>' +
      "</a>"
    );
  }

  function montar() {
    if (window[FLAG]) return;
    var alvo = document.querySelector("main") || document.body;
    if (!alvo) return;
    window[FLAG] = true;

    var box = document.createElement("div");
    box.setAttribute("role", "complementary");
    box.setAttribute("aria-label", "Oferta exclusiva pós-compra CarboZé");
    box.style.cssText = [
      "max-width:640px",
      "margin:16px auto 24px",
      "padding:24px 22px",
      "border-radius:20px",
      "background:" + CFG.verdeEscuro,
      "border:2px solid " + CFG.limao,
      "box-shadow:0 12px 44px rgba(9,58,48,.20)",
      "font-family:" + CFG.fonte,
      "color:#fff",
      "text-align:center",
      "position:relative",
      "z-index:5",
    ].join(";");

    box.innerHTML =
      '<p style="margin:0 0 6px;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;font-weight:800;color:' +
      CFG.limao +
      '">Pagamento confirmado</p>' +
      '<h2 style="margin:0 0 8px;font-size:22px;line-height:1.2;font-weight:800">' +
      'Só para clientes: <span style="color:' +
      CFG.limao +
      '">20% off agora.</span></h2>' +
      '<p style="margin:0 0 18px;font-size:13.5px;line-height:1.55;color:rgba(255,255,255,.65)">' +
      "Seu pedido já está garantido. Aproveite para reforçar o estoque — este preço não aparece na loja." +
      "</p>" +
      '<div style="text-align:left">' +
      OFERTAS.map(botao).join("") +
      "</div>" +
      '<p style="margin:12px 0 0;font-size:11.5px;color:rgba(255,255,255,.45)">' +
      "Frete grátis · desconto já no preço · " +
      '<strong id="cz-up-timer" style="color:' +
      CFG.limao +
      '">' +
      CFG.minutos +
      ":00</strong></p>" +
      '<button type="button" id="cz-up-dispensar" style="margin-top:16px;background:none;border:0;padding:4px;' +
      "font-family:" +
      CFG.fonte +
      ";font-size:12px;color:rgba(255,255,255,.32);text-decoration:underline;" +
      'text-underline-offset:4px;cursor:pointer">Não quero agora, desistir do meu desconto</button>';

    // Topo do conteúdo: aparece de imediato sem cobrir os dados do pedido
    alvo.insertBefore(box, alvo.firstChild);

    // Recusar apenas remove o bloco — o agradecimento da Nuvemshop, com número
    // do pedido, prazo e rastreio, já está logo abaixo. Não navegamos para fora.
    box.querySelector("#cz-up-dispensar").addEventListener("click", function () {
      box.remove();
    });

    var restante = CFG.minutos * 60;
    var el = box.querySelector("#cz-up-timer");
    var t = setInterval(function () {
      restante -= 1;
      if (restante <= 0) {
        clearInterval(t);
        restante = 0;
      }
      var m = Math.floor(restante / 60);
      var s = restante % 60;
      if (el) el.textContent = m + ":" + (s < 10 ? "0" : "") + s;
    }, 1000);
  }

  // A tela de sucesso é renderizada por JS: espera o conteúdo montar.
  function iniciar() {
    if (document.querySelector("main")) {
      montar();
      return;
    }
    var obs = new MutationObserver(function () {
      if (document.querySelector("main")) {
        obs.disconnect();
        montar();
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () {
      obs.disconnect();
      montar();
    }, 6000); // rede de segurança
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
