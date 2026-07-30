# Snippet pós-compra → `/upsell`

Código que vai na **loja** (Nuvemshop), não neste repositório. Ele é a ponte
entre o pagamento aprovado e a página de upsell.

## Onde colar

Admin da Nuvemshop → **Configurações → Códigos externos → Códigos de conversão**.

Colar **nas duas abas**: "Página de finalização" e "Página de confirmação". A
guarda anti-duplicidade torna inofensivo rodar duas vezes, e assim não importa
em qual etapa a plataforma injeta o código.

### Por que as duas

O checkout da Nuvemshop tem duas telas, verificadas em pedido real:

| Etapa | URL |
|---|---|
| Pagamento concluindo | `/checkout/v3/**next**/<id>/...` |
| Pedido criado | `/checkout/v3/**success**/<id>/...` |

"Página de finalização" dispara na conclusão do pagamento — ou seja, ainda na
tela `next`. Uma guarda de URL fixa não serve: foi o que impediu a 1ª versão de
funcionar, porque testava contra "success" enquanto o código rodava em "next".

### `/success/` não significa pago

Esta é a armadilha principal, e ela **bloqueia venda** se for ignorada.

No Pix e no boleto, o pedido já existe na tela `/success/` **enquanto o
pagamento está pendente** — é ali que o QR code aparece. Um redirect nesse
momento tira o código da frente do cliente e ele não consegue pagar.

Por isso o snippet exige duas condições, não uma:

1. URL em `/success/`
2. Texto da página indicando pagamento confirmado, **e** sem nenhum sinal de
   pendência (QR code, "aguardando pagamento", "copiar código", boleto)

No cartão isso é imediato. No Pix, só depois que o cliente paga e a tela
atualiza. Se ele fechar antes, o upsell não roda — que é o comportamento
correto: não existe upsell de uma compra que não aconteceu.

## Código

```html
<script>
(function () {
  var DESTINO_UPSELL = "https://www.carboze.com.br/upsell";
  var DESTINO_FIM = "https://www.carboze.com.br/obrigado";

  // Espera os pixels de conversão dispararem antes de sair. Sem isso o
  // redirect pode cortar Meta/Google Ads/GTM e a venda perde atribuição.
  var ESPERA_MS = 1200;

  // ── Já ofertamos o upsell nesta sessão? ─────────────────────────────────
  // Se sim, este é o 2º pedido — o da própria oferta aceita. Não ofertar de
  // novo, mas também não deixar o cliente parado na tela da loja: fecha o
  // fluxo em /obrigado. Expira em 30min, para uma compra nova de verdade
  // mais tarde voltar a ver o upsell.
  var jaOfertou = false;
  try {
    var m = JSON.parse(sessionStorage.getItem("cz-upsell-redir") || "null");
    jaOfertou = !!(m && Date.now() - m.ts < 30 * 60 * 1000);
  } catch (e) {}

  // ── Pagamento confirmado de verdade? ────────────────────────────────────
  // /success/ na URL NÃO basta: no Pix e no boleto o pedido já existe nessa
  // tela enquanto o pagamento está pendente. Sair dali tira do cliente o QR
  // code e ele não consegue pagar.
  function pagamentoConfirmado() {
    var t = (document.body.innerText || "").toLowerCase();

    // Qualquer sinal de pendência barra o redirect.
    if (
      /aguardando pagamento|aguardando confirma|escaneie|qr ?code|copiar c[oó]digo|c[oó]digo pix|copia e cola|vencimento|boleto/.test(
        t
      )
    ) {
      return false;
    }

    // E exige o sinal positivo explícito.
    return /pagamento (foi |está )?(confirmado|aprovado)|pagamento confirmado/.test(t);
  }

  function sair() {
    try {
      sessionStorage.setItem("cz-upsell-redir", JSON.stringify({ ts: Date.now() }));
    } catch (e) {}

    var destino;
    if (jaOfertou) {
      // 2º pedido = a oferta foi aceita e paga. Fecha o fluxo.
      destino = DESTINO_FIM;
    } else {
      // Qual produto foi comprado → ?p=sache|pack
      // Pedido misto (sachê + frasco) → pack: ticket maior, e quem leva
      // frasco tem carro, então a recompra de frasco faz mais sentido.
      var txt = (document.body.innerText || "").toLowerCase();
      var temPack = txt.indexOf("frasco") > -1;
      var temSache = txt.indexOf("sach") > -1;
      var p = temPack ? "pack" : temSache ? "sache" : "";
      destino = DESTINO_UPSELL + (p ? "?p=" + p : "");
    }

    // replace: não deixa a tela da loja no histórico, então "voltar" não
    // devolve o cliente para o checkout já concluído.
    setTimeout(function () {
      location.replace(destino);
    }, ESPERA_MS);
  }

  // O checkout é uma SPA: o código pode rodar ainda em /next/. Em vez de
  // adivinhar a etapa, observa até estar em /success/ E com pagamento
  // confirmado. No Pix isso só acontece depois que o cliente paga — se ele
  // fechar a página antes, o upsell simplesmente não roda, que é o certo.
  var tentativas = 0;
  var LIMITE = 600; // 600 × 1s = 10min, tempo de sobra para pagar um Pix

  var timer = setInterval(function () {
    if (location.pathname.indexOf("/success/") > -1 && pagamentoConfirmado()) {
      clearInterval(timer);
      sair();
    } else if (++tentativas > LIMITE) {
      clearInterval(timer);
    }
  }, 1000);
})();
</script>
```

## Como testar

Testar **com Pix**, não só com cartão — é no Pix que o erro aparece.

0. **Pix, até o QR code:** o código precisa ficar na tela, sem redirect. Só
   depois de pagar é que a página pode sair para o `/upsell`.
1. Fazer um pedido real de baixo valor (o kit sachê).
2. Ao confirmar o pagamento, a tela deve sair sozinha para
   `carboze.com.br/upsell?p=sache`.
3. Conferir que aparece **só** a oferta de sachê.
4. Recusar. Deve ir para `/obrigado`.
5. Tentar voltar para `/upsell` — precisa cair em `/obrigado` sem oferta.
6. Repetir comprando o kit de frascos: esperado `?p=pack` e só a oferta de pack.
7. Pedido misto (sachê + frasco no mesmo carrinho): esperado `?p=pack`.

## Se não redirecionar

Abrir o DevTools na tela de confirmação e rodar no console:

```js
sessionStorage.getItem("cz-upsell-redir")
```

- **Retorna um valor** → o snippet rodou e marcou. Se mesmo assim não saiu, o
  problema está no `setTimeout` ou no `location.replace` (bloqueio de popup,
  extensão). Testar em aba anônima.
- **Retorna `null`** → o código não chegou a rodar nessa página. Conferir se
  está salvo nas duas abas de Códigos de conversão.

Para repetir o teste no mesmo navegador, limpar a marca antes:

```js
sessionStorage.removeItem("cz-upsell-redir");
localStorage.removeItem("cz-upsell-resolvido");
localStorage.removeItem("cz-funil-produto");
```

## Se o `?p=` não vier

O `/upsell` tem um segundo caminho: `FunnelTracker` grava o produto no
`localStorage` do nosso domínio quando o cliente clica em comprar na LP. Se o
snippet não conseguir identificar o produto, esse registro assume.

A URL tem prioridade sobre o registro — é a fonte mais confiável, porque não
depende de storage nem de o cliente ter vindo pela LP.

## Limite conhecido

A detecção de produto lê o texto da tela de confirmação. Se o tema não listar o
nome do produto ali, `p` vem vazio e o `/upsell` mostra as duas ofertas — que é
o comportamento seguro. Para algo mais robusto seria preciso ler o objeto do
pedido exposto pelo tema, o que varia de tema para tema.
