# Snippet pós-compra → `/upsell`

Código que vai na **loja** (Nuvemshop), não neste repositório. Ele é a ponte
entre o pagamento aprovado e a página de upsell.

## Onde colar

Admin da Nuvemshop → **Configurações → Códigos externos → Códigos de conversão
→ aba "Página de finalização"**.

É a aba certa: dispara no momento em que o pagamento é concluído, que é onde o
upsell precisa entrar. A aba "Página de confirmação" é a tela que o cliente
pode revisitar depois — redirecionar dali pegaria quem só voltou a consultar o
pedido.

Como o admin já escopa o código nessa página, **não use guarda de URL**. Testar
`location.pathname` contra um padrão adivinhado só cria a chance de o redirect
nunca acontecer.

## Código

```html
<script>
(function () {
  var DESTINO = "https://www.carboze.com.br/upsell";

  // Espera os pixels da página de conversão dispararem antes de sair.
  // Sem isso, o redirect pode cortar Meta/Google Ads/GTM no meio e a venda
  // deixa de ser atribuída. 1,2s costuma bastar.
  var ESPERA_MS = 1200;

  // ── Guarda: não redirecionar o pedido do próprio upsell ─────────────────
  // Quem aceita a oferta gera um 2º pedido, que cai nesta mesma tela. Sem
  // isso o cliente voltaria ao /upsell logo após comprar. Expira em 30min
  // para não bloquear uma compra nova de verdade mais tarde.
  try {
    var m = JSON.parse(sessionStorage.getItem("cz-upsell-redir") || "null");
    if (m && Date.now() - m.ts < 30 * 60 * 1000) return;
    sessionStorage.setItem("cz-upsell-redir", JSON.stringify({ ts: Date.now() }));
  } catch (e) {}

  // ── Qual produto foi comprado ───────────────────────────────────────────
  // Vira ?p=sache|pack e faz o /upsell oferecer o mesmo produto.
  // Pedido misto (sachê + frasco) → pack: é o ticket maior, e quem já leva
  // frasco tem carro, então a recompra de frasco faz mais sentido.
  var txt = (document.body.innerText || "").toLowerCase();
  var temPack = txt.indexOf("frasco") > -1;
  var temSache = txt.indexOf("sach") > -1;
  var p = temPack ? "pack" : temSache ? "sache" : "";

  // replace: não deixa a tela da loja no histórico, então "voltar" não
  // devolve o cliente para cá.
  setTimeout(function () {
    location.replace(DESTINO + (p ? "?p=" + p : ""));
  }, ESPERA_MS);
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
