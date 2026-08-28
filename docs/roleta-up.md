# Roleta de prêmios — `/up`

`https://www.carboze.com.br/up`

## A página

Uma tela e ponto final: `100svh` com `overflow-hidden`. O botão de girar é uma
pastilha translúcida no centro da roda, então nada precisa vir abaixo dela — e
rolar só afastaria a pessoa do único gesto que a página pede. O aviso legal
fica, mas dentro da tela. O som é um ícone no canto: em linha, ele custava
~50px de altura que a roda usa melhor.

A rota `/up1` existiu como teste A/B do botão (CTA abaixo da roda × pastilha no
centro). A pastilha venceu, virou a `/up`, e `/up1` hoje é um redirect 301 em
`next.config.ts` — o link foi compartilhado para teste e não dá para saber onde
ainda está colado.

O código vive em `components/roleta/`: `PaginaRoleta` (a casca), `RoletaClient`
(estado e animação), `Roleta` (o desenho) e `ResultadoPopup`.

### O popup vai por portal, e isso importa

`ResultadoPopup` é montado com `createPortal` no `<body>`, não no lugar onde
aparece no JSX. Não é preferência: `z-50` só vale dentro do contexto de
empilhamento em que o elemento nasce. Quando a página passou a ter a roda e o
texto de apoio em blocos irmãos com `z-10`, o popup renderizado dentro do bloco
da roda ficou preso nele — e o parágrafo seguinte, que vem depois no DOM,
passou a pintar por cima. O sintoma era um popup com pedaços não clicáveis, e
o botão do checkout entre eles. No `<body>` ele não tem ancestral com contexto
próprio, então nenhum rearranjo de layout futuro consegue enterrá-lo de novo.

### A pastilha de girar

Uma versão punha um botão sólido no miolo e encolhia a arte ~23% para ele caber
sem cobrir o "20% OFF" (que vive entre 13% e 30% do raio). Ficou ruim: gomo
pequeno, muito escuro entre as artes. A versão atual mantém a arte cheia e põe
por cima uma pastilha **translúcida**, com fundo em degradê que dissolve na
borda — o texto tem contraste no centro e a arte continua sendo lida através
dela, em vez de ser recortada por uma tampa.

A pastilha **some no primeiro giro e não volta**, porque não precisa: o segundo
giro sai do botão do popup. Ela só reaparece se a pessoa fechar o popup com
giro sobrando — senão ficaria sem nenhum jeito de girar. Essa é a razão de
`podeTocarGirar` no cliente não ser simplesmente `fase === "pronto"`.

## Como o giro é decidido

**No servidor, não no navegador.** Toda a decisão vive em
`app/api/roleta/route.ts`, que nunca vai para o bundle do cliente. A página só
pergunta "o que saiu?" e anima a roda até o gomo da resposta.

O percurso é um roteiro fixo, na constante `SEQUENCIA` da rota:

| Giro | Resultado | O que a pessoa vê |
|---|---|---|
| 1º | `nada` | Popup "Você ganhou mais 1 chance", com botão para girar de novo |
| 2º | `kit20` | Popup "20% OFF no Kit CarboZé", com o botão do checkout |

Depois do 2º giro não há mais giro. Os outros três gomos (viagem, vale e
vestuário) estão no desenho da roda mas não estão na `SEQUENCIA`, então nunca
saem.

O estado fica num **cookie httpOnly** (`cz_roleta`, 7 dias) com o número de
giros, o último prêmio e o código. httpOnly porque é isso que impede o próprio
navegador de reescrever a contagem por script. Limpar os cookies zera o
percurso — e tudo bem: o pior caso é a pessoa refazer a mesma sequência e
receber o mesmo desconto. Um POST a mais não avança nada; devolve o que já
estava guardado, o que cobre clique duplo e replay da requisição.

O que o bundle do navegador contém, e só: os cinco gomos, as artes e o texto de
cada resultado. Sem pesos, sem ordem, sem `SEQUENCIA`. Conferido com grep nos
chunks depois do build.

### O que isso não esconde

Mover a lógica para o servidor tira a regra do DevTools, mas não torna o
comportamento indetectável: duas pessoas comparando o percurso veem a mesma
sequência, e qualquer uma que gire duas vezes percebe que o 1º giro sempre
perde. Concealment por servidor é sobre não publicar a regra, não sobre
torná-la impossível de inferir.

### O ponto que continua aberto

Três prêmios estão desenhados na roda e não podem ser ganhos. A página diz
"concorra a prêmios incríveis" e o gomo do Interlagos aparece girando junto dos
outros. Isso é diferente de uma roleta com chances desiguais: é anunciar prêmio
com probabilidade zero, o que no CDC (art. 37) é publicidade enganosa, e não
tem correção possível no código — a correção é no desenho da roda.

Duas saídas, as duas simples:

1. **Tirar os três da roda.** A roleta fica com "20% OFF" e "não foi dessa
   vez" repetidos nos cinco gomos (ou vira uma roda de 2–3 gomos). O mecanismo
   de perde-e-ganha continua idêntico, e nada anunciado deixa de existir.
2. **Torná-los reais**, como sorteio de verdade entre quem girou — o que exige
   autorização (Lei 5.768/71, SPA/MF) e um sorteio que aconteça.

Enquanto nenhuma das duas for feita, a exposição é essa e está registrada aqui.

## As artes dos gomos

Cada prêmio aponta para um arquivo em `public/roleta/<id>.webp` (campo `arte`).
O gomo não desenha nada sozinho: **prêmio novo exige arte nova**.

A arte precisa chegar no mesmo formato das cinco atuais, senão não encaixa:

- cunha com a **ponta para baixo**, fundo transparente (PNG/WebP com alpha);
- recortada rente ao conteúdo e **centralizada na horizontal**;
- **quadrada**, com a ponta encostada na borda de baixo.

O componente apoia a ponta no eixo da roda e o topo no aro, então é essa
geometria que faz a arte cair certinho dentro da fatia. O `clipPath` por gomo
apara o que sobrar.

Para normalizar uma arte nova, o caminho é: recortar na área opaca (`getbbox`
do canal alfa), colar num quadrado de lado `max(largura, altura)` centrando na
horizontal e encostando embaixo, redimensionar para 560×560 e salvar em WebP
qualidade 82. As cinco atuais ficaram em ~60–75 KB cada.

## Resgate

- **`kit20`:** o botão principal é **compra em 1 clique da Payt**
  (`PAYT_ONECLICK` em `lib/constants.ts`). Não há checkout para preencher: a
  Payt reusa o cartão do pedido que a pessoa acabou de fazer. O link secundário
  ("quero o outro kit") continua indo ao SKU "UpSell" da Nuvemshop, com
  `utm_campaign=roleta`.
- **`nada`:** não é o fim. O popup anuncia a chance extra e devolve o botão de
  girar.
- **Prêmios com `resgate: "whatsapp"`:** o popup mostra o código do giro e abre
  o WhatsApp com a mensagem pronta. Hoje nenhum deles sai da `SEQUENCIA`, mas o
  popup é um renderizador genérico — ele desenha o que o servidor mandar, seja
  qual for.

## O botão da Payt

O script da Payt varre o DOM atrás de elementos com `payt_action` e liga o
clique neles. Isso impõe duas coisas, e as duas estão no código por causa
disto:

1. **O script carrega depois do botão existir.** Ele é montado dentro de
   `BotaoPayt`, junto do `<a>`, e não no layout. No layout ele varreria um DOM
   em que o botão ainda não existe — o popup do prêmio só aparece uns 20s
   depois, no fim do segundo giro. Conferido no navegador: o script é pedido
   uma vez só, depois do prêmio final, e quando roda já enxerga o botão.
2. **O botão não é destruído e recriado.** Por isso o popup **se esconde** ao
   fechar em vez de desmontar (`aberto` em `ResultadoPopup`), e o `key` pelo id
   do prêmio preserva a animação de entrada sem remontar no abre/fecha. Se a
   Payt guardou referência ao nó, um `<a>` novo nasceria sem vínculo e o
   cliente clicaria num botão morto.

`payt_action` e `payt_element` não são atributos de HTML; o React os repassa,
mas o TypeScript precisa da declaração que está no topo de `BotaoPayt.tsx`.

### O que não deu para testar aqui

`checkout.payt.com.br` não é alcançável do ambiente de build, então a compra em
si nunca rodou. O que foi verificado é a montagem: atributos no DOM, ordem de
carga do script e sobrevivência do nó ao fechar e reabrir o popup. **A compra
de ponta a ponta precisa de um teste com pedido real.**

### O preço não sai daqui

Quem cobra é a Payt, pelo produto `RD33AW-LJA2G7`. O `R$ 119,60` que aparece na
tela vem de `ROLETA.checkout.carro.por`. Mudar um sem o outro faz a tela
prometer um valor e o cartão cobrar outro.

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

## O giro

`duracaoGiroMs: 10000`, dos quais os últimos `duracaoRastejoMs: 3500` são
rastejo. `voltasMin/Max: 8/12`.

### Por que duas fases, e não uma curva só

A animação não usa easing pronto. São duas fases coladas pela velocidade:

- **A — arranque (6,5s).** A velocidade cai linearmente de `v0` (~900°/s) até
  `v1`. Desaceleração constante, que é o que o atrito de um eixo faz.
- **B — rastejo (3,5s).** Começa exatamente em `v1` e cai até `v2`, cobrindo
  `grausRastejo: 150` — pouco mais de dois gomos.

Uma curva só não faz as duas coisas. Com easeOutQuad (que já esteve aqui), a
velocidade cai até zero de uma vez: para o fim ser lento o bastante, o arranque
tem de ser fraco; para o arranque ter força, o fim chega rápido demais.
Quebrando em duas, `v1` é escolhido pelo rastejo que se quer — 150° em 3,5s dão
~76°/s — e o arranque fica livre para ser violento.

`v1` é o mesmo número no fim de A e no início de B, então não há degrau na
emenda. E `v0` **sai da duração**: mexer em `duracaoGiroMs` reajusta o arranque
sozinho, sem tocar em mais nada.

### Por que `velocidadeFinalGrausS` não é zero

Desacelerando até zero, o último segundo cobria 3°: a roda parecia ter parado
antes e o fim morria. Terminando a ~10°/s e travando ali — que é o que um pino
faz — o último segundo ainda anda ~19°, um pino inteiro: dá um tique final e só
então para.

### Medido no navegador

Sondado amostrando o transform quadro a quadro **até a roda parar de verdade**.
Medir até o popup abrir dá números menores, porque o popup aparece antes do
último grau — foi o que mascarou o problema do fim morto na primeira versão.

| | projetado | medido |
|---|---:|---:|
| duração | 10,0s | 10,3s |
| últimos 3s | 114° | 113° |
| últimos 2s | 58° | 58° |
| último 1s | 19° | 19° |
| velocidade ao travar | 10°/s | 10°/s |

Com pinos a cada 18°, o rastejo é um tique a cada ~0,25s virando um a cada ~2s
— o "tic... tic..... tic" que faz parecer que ainda pode cair no gomo vizinho.

### A parada

O ponto de parada é sorteado dentro do gomo (`PASSO - 12`, ou ±30°, com 6° de
folga de cada divisória), inclusive no caminho de `prefers-reduced-motion` —
onde o giro encurta para 1,2s, mas continua parando em lugar diferente. Sem
isso a roda pararia sempre no mesmo pixel e dois giros entregariam que o
destino é fixo. Conferido: 8 giros, 7–8 pontos distintos, todos dentro do gomo.

## Testar

`?reset=1` zera o percurso e recarrega limpo (`/up?reset=1`): apaga o cookie do
servidor (via `DELETE /api/roleta`) e o storage do funil. Sem isso, cada rodada
exigiria limpar cookie e storage na mão.

A API dá para exercitar direto, sem navegador:

```bash
curl -s -c j -b j       localhost:3000/api/roleta   # estado
curl -s -c j -b j -XPOST localhost:3000/api/roleta  # 1º giro -> nada
curl -s -c j -b j -XPOST localhost:3000/api/roleta  # 2º giro -> kit20
curl -s -c j -b j -XPOST localhost:3000/api/roleta  # não avança
```

`?p=sache` ou `?p=pack` força o produto do card de desconto.

O tamanho da roda é limitado por três coisas ao mesmo tempo (`.roleta-caixa`
em `globals.css`): 94vw, um teto de 520px e — o que importa — a altura que
sobra da tela depois do cabeçalho e do botão. É esse terceiro limite que
mantém o "GIRAR ROLETA" na dobra do iPhone SE ao notebook de 900px. Conferido
em 320, 375, 390, 430, 768 e 1280 de largura: sem rolagem horizontal, roda
inteira na tela e botão visível sem rolar em todos.

Com `prefers-reduced-motion: reduce` o giro cai para ~1,4s e as animações de
fundo param. O resultado é o mesmo: menos movimento, não menos roleta.
