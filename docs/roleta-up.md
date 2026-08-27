# Roleta de prêmios — `/up`

`https://www.carboze.com.br/up`

Variante do upsell pós-compra. Onde o `/upsell` mostra o card de desconto
direto, aqui o cliente gira uma roleta. O desfecho que sustenta a página é o
mesmo — 20% off no kit — só que embalado em prêmio.

As duas rotas coexistem: `/upsell` segue no ar e não foi tocada. O snippet da
loja decide qual usar trocando o `DESTINO_UPSELL` (ver `snippet-upsell.md`)
de `/upsell` para `/up`.

## Como o giro é decidido

O sorteio é **por peso**, não em partes iguais — a roleta tem 5 gomos do mesmo
tamanho e chances diferentes. Os pesos estão em `ROLETA.premios`
(`lib/constants.ts`), relativos à soma:

| Gomo | `peso` | Chance | Resgate |
|---|---:|---:|---|
| Kit CarboZé 20% off | 62 | 62% | Checkout direto |
| Não foi dessa vez | 30 | 30% | Consolação: os mesmos 20% off |
| Kit vestuário | 5 | 5% | WhatsApp, com código |
| Vale-combustível R$ 200 | 2 | 2% | WhatsApp, com código |
| Viagem para Interlagos | 1 | 1% | WhatsApp, com código |

Mexer nos pesos é mexer só nesta tabela — o desenho, o giro e o som se ajustam
sozinhos. `peso: 0` mantém o gomo na roda e nunca o sorteia.

### Duas coisas para decidir antes de publicar

1. **A roleta é viciada por construção.** Isso é o padrão do mercado em roleta
   de oferta, mas se a promoção for divulgada como sorteio, ou os pesos viram
   iguais, ou as probabilidades vão anunciadas.
2. **Os prêmios físicos criam obrigação de entrega.** No Brasil, distribuição
   gratuita de prêmio por sorteio depende de autorização (Lei 5.768/71,
   SPA/MF). É decisão de negócio/jurídico — o código não presume nenhuma.
   Enquanto não estiver resolvido, `peso: 0` nos três prêmios físicos deixa a
   roleta rodando só entre desconto e gomo vazio.

## Resgate

- **Desconto (kit20 e a consolação do gomo vazio):** vai direto ao SKU "UpSell"
  da Nuvemshop, com o desconto já no preço — os mesmos SKUs do `/upsell`, com
  `utm_campaign=roleta` para separar as duas no admin. O card oferece o kit que
  casa com o que a pessoa comprou (`?p=` ou o clique gravado na LP), e um link
  para o outro kit com o mesmo desconto.
- **Prêmios físicos:** a página gera um código (`CZ-XXXXX`) e abre o WhatsApp
  com a mensagem pronta. **O código é o único registro do giro** — ele fica no
  `localStorage` do cliente, não em banco nenhum. Se a operação precisar de
  trilha de auditoria, é aqui que entra um `insertRow` (`lib/supabase.ts`) para
  uma tabela de giros.

Um giro por navegador, válido por 7 dias (`gravarGiroRoleta`). Quem volta
reencontra o prêmio e o código; o resultado não se perde num F5.

## Som

Sintetizado na Web Audio API (`lib/roletaAudio.ts`) — nenhum arquivo de áudio,
nenhuma requisição. São quatro sons:

- **tique** — um clique por pino que cruza o ponteiro, com timbre e volume
  variando conforme a velocidade da roda. É o que dá a sensação de peso.
- **giro** — o chiado do arranque.
- **vitória** — arpejo maior subindo, acorde e chuva de moedas.
- **derrota** — dois graves descendo, abafados.

Todo o áudio nasce **dentro do clique** em "GIRAR": fora de um gesto do
usuário, iOS e Chrome recusam o `AudioContext` e o giro sairia mudo. O botão
"Som ligado/desligado" grava a preferência no `localStorage`.

`ROLETA.pinos` controla o ritmo do clique e o número de lâmpadas desenhadas na
borda ao mesmo tempo — o que se ouve bate com o que passa pelo ponteiro.

## Testar

`?reset=1` zera o funil e recarrega limpo (`/up?reset=1`) — sem isso, cada
rodada exigiria limpar o `localStorage` na mão.

`?p=sache` ou `?p=pack` força o produto do card de desconto.

Com `prefers-reduced-motion: reduce` o giro cai para ~1,4s e as animações de
fundo param. O resultado é o mesmo: menos movimento, não menos roleta.
