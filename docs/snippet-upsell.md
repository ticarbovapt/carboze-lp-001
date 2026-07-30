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
| Pedido confirmado | `/checkout/v3/**success**/<id>/...` |

"Página de finalização" dispara no momento da conclusão do pagamento — ou seja,
ainda na tela `next`. Redirecionar dali levaria o cliente embora antes da
confirmação aparecer. Por isso o snippet **não redireciona na hora**: ele espera
a URL virar `success` e só então sai.

Uma guarda de URL fixa não serve — foi o que impediu a primeira versão de
funcionar, porque testava contra "success" enquanto o código rodava em "next".

## Código

```html
<script>
(function () {
  var DESTINO = "https://www.carboze.com.br/upsell";

  // Espera os pixels de conversão dispararem antes de sair. Sem isso o
  // redirect pode cortar Meta/Google Ads/GTM e a venda perde atribuição.
  var ESPERA_MS = 1200;

  // ── Guarda: uma vez por compra ──────────────────────────────────────────
  // Cobre dois casos: o snippet colado nas duas abas, e o 2º pedido gerado
  // por quem aceita o upsell (que cairia aqui de novo). Expira em 30min para
  // não bloquear uma compra nova de verdade mais tarde.
  try {
    var m = JSON.parse(sessionStorage.getItem("cz-upsell-redir") || "null");
    if (m && Date.now() - m.ts < 30 * 60 * 1000) return;
  } catch (e) {}

  function irParaUpsell() {
    try {
      sessionStorage.setItem("cz-upsell-redir", JSON.stringify({ ts: Date.now() }));
    } catch (e) {}

    // Qual produto foi comprado → ?p=sache|pack
    // Pedido misto (sachê + frasco) → pack: ticket maior, e quem leva frasco
    // tem carro, então a recompra de frasco faz mais sentido.
    var txt = (document.body.innerText || "").toLowerCase();
    var temPack = txt.indexOf("frasco") > -1;
    var temSache = txt.indexOf("sach") > -1;
    var p = temPack ? "pack" : temSache ? "sache" : "";

    // replace: não deixa a tela da loja no histórico, então "voltar" não
    // devolve o cliente para o checkout já concluído.
    setTimeout(function () {
      location.replace(DESTINO + (p ? "?p=" + p : ""));
    }, ESPERA_MS);
  }

  // O checkout é uma SPA: o código pode rodar ainda em /next/. Em vez de
  // adivinhar a etapa, espera a URL chegar em /success/ — que é quando o
  // pedido está confirmado e o nome do produto já está na tela.
  if (location.pathname.indexOf("/success/") > -1) return irParaUpsell();

  var tentativas = 0;
  var timer = setInterval(function () {
    if (location.pathname.indexOf("/success/") > -1) {
      clearInterval(timer);
      irParaUpsell();
    } else if (++tentativas > 120) {
      clearInterval(timer); // desiste após 60s
    }
  }, 500);
})();
</script>
```

## Como testar

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
