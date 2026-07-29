/* ─────────────────────────────────────────────────────────────────────────────
 * CarboZé — Upsell na tela de obrigado (Nuvemshop)
 *
 * ONDE COLAR
 *   Admin da loja → Configurações → Códigos externos →
 *   Códigos de conversão e tracking → Códigos de conversão →
 *   campo "Página de finalização"
 *
 *   Cole o conteúdo abaixo envolvido em <script> ... </script>.
 *
 * POR QUE INJETAR E NÃO REDIRECIONAR
 *   Os pixels de conversão (GTM/Meta/Google) disparam nessa página. Um
 *   redirect corre o risco de cortar a tag antes dela completar — a venda
 *   some do Meta e a otimização de campanha degrada. Aqui o pedido continua
 *   inteiro na tela e a oferta entra por cima.
 *
 * POR QUE AQUI TODA OFERTA É SEGURA
 *   A compra do upsell vira um SEGUNDO pedido (a Nuvemshop não permite
 *   cobrar o mesmo cartão sem novo checkout). Como o 1º pedido já fechou,
 *   qualquer preço ofertado aqui SOMA ao ticket — nunca substitui. É por
 *   isso que o SKU de R$ 41,90 funciona nesta tela e não funcionaria antes
 *   do checkout, onde o carrinho ainda está vazio.
 * ────────────────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  // ── Ofertas ──────────────────────────────────────────────────────────────
  var FRASCO = {
    nome: "Kit 5 Frascos 100ml",
    href: "https://loja.carboze.com.br/produtos/carboze-kit-5-frascos-100ml-tratamento-de-combustivel-e-protecao-do-motor-copia-1p5z3/?utm_source=posvenda",
    de: "R$ 149,50",
    por: "R$ 99,50",
    detalhe: "trata 500 litros",
  };

  var SACHE = {
    nome: "Kit 10 Sachês 10ml",
    href: "https://loja.carboze.com.br/produtos/kit-10-saches-carboze-10ml-tratamento-de-combustivel-e-protecao-do-motor-copia-fovns/?utm_source=posvenda",
    de: "R$ 59,90",
    por: "R$ 41,90",
    detalhe: "trata 100 litros",
  };

  var CFG = { minutos: 15, limao: "#a9da00", verdeEscuro: "#093a30" };

  var FLAG = "__czUpsellPosCompra";
  if (window[FLAG]) return; // não injeta duas vezes

  // ── Detecta o que foi comprado ───────────────────────────────────────────
  function detectarProduto() {
    var txt = (document.body.innerText || "").toLowerCase();
    var temFrasco = /frasco/.test(txt);
    var temSache = /sach/.test(txt);
    if (temFrasco && !temSache) return "frasco";
    if (temSache && !temFrasco) return "sache";
    return null;
  }

  /**
   * Quem comprou sachê escolhe entre subir para o frasco (R$ 99,50) ou
   * levar outro kit de sachês (R$ 41,90). Quem comprou frasco recebe o
   * 2º kit de frascos, com o sachê como complemento para a moto.
   */
  function montarOfertas(produto) {
    if (produto === "frasco") {
      return {
        titulo: "Aproveite para reforçar o estoque",
        sub: "Seu pedido já está confirmado. Estes preços valem só agora, nesta tela.",
        ofertas: [
          { o: FRASCO, tag: "2º kit", destaque: true, cta: "Quero o 2º kit" },
          { o: SACHE, tag: "Para a moto", destaque: false, cta: "Adicionar sachês" },
        ],
      };
    }
    // sachê ou indefinido
    return {
      titulo: "Aproveite para reforçar o estoque",
      sub: "Seu pedido já está confirmado. Estes preços valem só agora, nesta tela.",
      ofertas: [
        { o: FRASCO, tag: "Rende 5×", destaque: true, cta: "Subir para frascos" },
        { o: SACHE, tag: "2º kit", destaque: false, cta: "Quero mais sachês" },
      ],
    };
  }

  function cardOferta(item) {
    var o = item.o;
    var borda = item.destaque
      ? "2px solid " + CFG.limao
      : "1px solid rgba(255,255,255,.18)";
    var fundo = item.destaque ? "rgba(169,218,0,.10)" : "rgba(255,255,255,.05)";
    var btnBg = item.destaque ? CFG.limao : "transparent";
    var btnCor = item.destaque ? CFG.verdeEscuro : CFG.limao;
    var btnBorda = item.destaque ? "0" : "1px solid rgba(169,218,0,.45)";

    return (
      '<div style="flex:1 1 240px;min-width:240px;background:' +
      fundo +
      ";border:" +
      borda +
      ';border-radius:14px;padding:16px">' +
      '<p style="margin:0 0 6px;font-size:10px;letter-spacing:.14em;text-transform:uppercase;font-weight:800;color:' +
      CFG.limao +
      '">' +
      item.tag +
      "</p>" +
      '<p style="margin:0 0 8px;font-size:15px;font-weight:700;line-height:1.25">' +
      o.nome +
      "</p>" +
      '<div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap">' +
      '<span style="font-size:26px;font-weight:800;color:' +
      CFG.limao +
      '">' +
      o.por +
      "</span>" +
      '<span style="font-size:13px;color:rgba(255,255,255,.4);text-decoration:line-through">' +
      o.de +
      "</span>" +
      "</div>" +
      '<p style="margin:4px 0 14px;font-size:12px;color:rgba(255,255,255,.55)">' +
      o.detalhe +
      " · frete grátis</p>" +
      '<a href="' +
      o.href +
      '" style="display:block;text-align:center;background:' +
      btnBg +
      ";color:" +
      btnCor +
      ";border:" +
      btnBorda +
      ';text-decoration:none;font-weight:800;text-transform:uppercase;font-size:13px;padding:12px 16px;border-radius:10px">' +
      item.cta +
      " &rarr;</a>" +
      "</div>"
    );
  }

  // ── Monta o bloco ────────────────────────────────────────────────────────
  function montar() {
    if (window[FLAG]) return;
    var alvo = document.querySelector("main") || document.body;
    if (!alvo) return;
    window[FLAG] = true;

    var c = montarOfertas(detectarProduto());

    var box = document.createElement("div");
    box.setAttribute("role", "complementary");
    box.setAttribute("aria-label", "Ofertas pós-compra CarboZé");
    box.style.cssText = [
      "max-width:960px",
      "margin:16px auto",
      "padding:22px",
      "border-radius:18px",
      "background:" + CFG.verdeEscuro,
      "border:2px solid " + CFG.limao,
      "box-shadow:0 10px 40px rgba(9,58,48,.18)",
      "font-family:system-ui,-apple-system,'Segoe UI',sans-serif",
      "color:#fff",
      "position:relative",
      "z-index:5",
    ].join(";");

    box.innerHTML =
      '<button type="button" aria-label="Fechar ofertas" style="position:absolute;top:10px;right:12px;background:transparent;border:0;color:rgba(255,255,255,.5);font-size:22px;line-height:1;cursor:pointer">&times;</button>' +
      '<p style="margin:0 0 6px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:' +
      CFG.limao +
      ';font-weight:700">Só para quem acabou de comprar</p>' +
      '<h2 style="margin:0 0 8px;font-size:22px;line-height:1.2;font-weight:800">' +
      c.titulo +
      "</h2>" +
      '<p style="margin:0 0 16px;font-size:14px;line-height:1.55;color:rgba(255,255,255,.72);max-width:60ch">' +
      c.sub +
      "</p>" +
      '<div style="display:flex;gap:12px;flex-wrap:wrap">' +
      c.ofertas.map(cardOferta).join("") +
      "</div>" +
      '<p style="margin:14px 0 0;font-size:12px;color:rgba(255,255,255,.45)">Preços válidos por <strong id="cz-up-timer" style="color:' +
      CFG.limao +
      '">' +
      CFG.minutos +
      ':00</strong> · seu pedido atual não é alterado</p>';

    // Insere no topo do conteúdo, sem cobrir os dados do pedido
    alvo.insertBefore(box, alvo.firstChild);

    box.querySelector("button").addEventListener("click", function () {
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

  // ── A tela de sucesso é renderizada por JS: espera o conteúdo aparecer ────
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
    }, 6000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
