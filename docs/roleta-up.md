# Roleta de prêmios — `/up` e `/up1`

`https://www.carboze.com.br/up` · `https://www.carboze.com.br/up1`

## As duas rotas

São a **mesma página** com uma diferença só, para teste A/B:

| | `/up` | `/up1` |
|---|---|---|
| Botão de girar | CTA largo abaixo da roda | Pastilha translúcida no centro |
| Layout | a página rola | uma tela, `100svh`, sem rolagem |
| Abaixo da roda | CTA, texto de apoio e aviso legal | só o aviso legal |
| Som | botão com rótulo, em linha | ícone no canto superior direito |

A **roda é idêntica** nas duas: arte em tamanho cheio, ponta no centro, eixo
minúsculo. Tudo o mais — servidor, sequência, popup, som, artes — é código
compartilhado em `components/roleta/`, e as rotas são só
`<PaginaRoleta variante="..." />`. Se cada uma tivesse a própria página, o
primeiro ajuste de texto deixaria uma para trás e o teste passaria a medir a
divergência em vez do botão.

### O popup vai por portal, e isso importa

`ResultadoPopup` é montado com `createPortal` no `<body>`, não no lugar onde
aparece no JSX. Não é preferência: `z-50` só vale dentro do contexto de
empilhamento em que o elemento nasce. Quando a página passou a ter a roda e o
texto de apoio em blocos irmãos com `z-10`, o popup renderizado dentro do bloco
da roda ficou preso nele — e o parágrafo seguinte, que vem depois no DOM,
passou a pintar por cima. O sintoma era um popup com pedaços não clicáveis, e
o botão do checkout entre eles. No `<body>` ele não tem ancestral com contexto
próprio, então nenhum rearranjo de layout futuro consegue enterrá-lo de novo.

### A pastilha da /up1

Uma primeira versão punha um botão sólido no miolo e encolhia a arte ~23% para
ele caber sem cobrir o "20% OFF" (que vive entre 13% e 30% do raio). Ficou
ruim: gomo pequeno, muito escuro entre as artes. A versão atual mantém a arte
cheia e põe por cima uma pastilha **translúcida**, com fundo em degradê que
dissolve na borda — o texto tem contraste no centro e a arte continua sendo
lida através dela, em vez de ser recortada por uma tampa.

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

### Por que o botão não fica no miolo

Ele ficava, e cobria a oferta. O conteúdo das artes desce até 13% do raio — o
"20% OFF" da arte do kit vive entre 13% e 30% —, então qualquer miolo grande o
bastante para caber "GIRAR ROLETA" apagava justamente o que a página vende. O
botão virou CTA abaixo da roda, o que de quebra deu uma área de toque de
verdade no celular. O miolo hoje é só o eixo que arremata as cinco pontas.

## Resgate

- **`kit20`:** vai direto ao SKU "UpSell" da Nuvemshop, com o desconto já no
  preço — os mesmos SKUs do `/upsell`, com `utm_campaign=roleta` para separar
  as duas no admin. O popup oferece o kit que casa com o que a pessoa comprou
  (`?p=` ou o clique gravado na LP), e um link para o outro kit com o mesmo
  desconto.
- **`nada`:** não é o fim. O popup anuncia a chance extra e devolve o botão de
  girar.
- **Prêmios com `resgate: "whatsapp"`:** o popup mostra o código do giro e abre
  o WhatsApp com a mensagem pronta. Hoje nenhum deles sai da `SEQUENCIA`, mas o
  popup é um renderizador genérico — ele desenha o que o servidor mandar, seja
  qual for.

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

`duracaoGiroMs: 8000`, `voltasMin/Max: 8/12`. Os dois andam juntos: giro longo
com poucas voltas vira uma roda rastejando.

A desaceleração é **easeOutQuad**, e o expoente 2 não é gosto — é o que faz a
velocidade cair linearmente até zero, que é o que o atrito constante produz numa
roda de verdade. Expoentes maiores (quart, quint) chegam a 99,99% do caminho na
metade do tempo e depois rastejam invisíveis: a roda parece travar cedo em vez
de ir morrendo.

Medido no navegador: giro de 7,9s, ~9,6 voltas, **78° nos últimos 1s** e 268°
nos últimos 2s. Como o gomo tem 72°, o último segundo cobre um prêmio inteiro
devagar — dá tempo de ver o ponteiro cruzar a divisória sem saber se para antes
ou depois dela.

O ponto de parada é sorteado dentro do gomo (`PASSO - 12`, ou ±30°, com 6° de
folga de cada divisória), inclusive no caminho de `prefers-reduced-motion`.
Sem isso a roda pararia sempre no mesmo pixel e dois giros entregariam que o
destino é fixo. Conferido: 8 giros, 8 pontos distintos, todos dentro do gomo.

## Testar

`?reset=1` zera o percurso e recarrega limpo (`/up?reset=1`, `/up1?reset=1` —
o recarregamento volta para a rota atual, não para `/up` fixo).

As duas rotas dividem o mesmo cookie: quem passa pela `/up` chega na `/up1` com
o percurso gasto. Para comparar as variantes, `?reset=1` ou janelas anônimas
separadas: apaga o cookie do
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
