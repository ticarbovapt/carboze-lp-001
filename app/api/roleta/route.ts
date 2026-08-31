import { randomInt } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Resultado da roleta de `/up`.
 *
 * Este arquivo roda SÓ no servidor — nada aqui vai para o bundle do navegador.
 * É de propósito: o resultado do giro é regra de campanha, e regra de campanha
 * no cliente é regra que qualquer pessoa lê no DevTools e, pior, edita. O
 * cliente aqui só pergunta "o que saiu?" e anima a roda até o gomo que a
 * resposta indicar.
 *
 * O estado mora num cookie httpOnly E numa contagem que o cliente manda. Os
 * dois, porque nenhum dos dois basta sozinho:
 *
 * - A página roda DENTRO DE UM IFRAME na página de upsell da Payt. Num iframe
 *   de outro site o cookie é de terceiro: `SameSite=Lax` nem chega a ser
 *   guardado, e mesmo `None; Secure; Partitioned` é bloqueado no Safari e em
 *   qualquer navegador com bloqueio de rastreadores ligado. Só com cookie, o
 *   servidor via "zero giros" a cada chamada e devolvia `nada` para sempre —
 *   a pessoa ganhava chance extra eternamente e nunca chegava aos 20%.
 * - Só com a contagem do cliente, um F5 zeraria o percurso.
 *
 * Então vale `max(cookie, cliente)`: o cookie, quando existe, impede o cliente
 * de VOLTAR no percurso; a contagem do cliente faz o percurso ANDAR onde o
 * cookie não sobrevive. O que continua exclusivo do servidor é o que importa —
 * QUAL prêmio sai em cada giro. O cliente sabe em que giro está, nunca o que
 * ele vale.
 */

export const dynamic = "force-dynamic";

const COOKIE = "cz_roleta";
const VALIDADE_S = 7 * 24 * 60 * 60;

/**
 * Roteiro da campanha, na ordem dos giros. O índice é o número do giro:
 * o 1º giro devolve SEQUENCIA[0], o 2º devolve SEQUENCIA[1], e o último item
 * é o desfecho definitivo — a partir dele não há mais giro.
 *
 * Os ids têm de existir em ROLETA.premios (lib/constants.ts), senão o cliente
 * não acha o gomo para parar.
 */
const SEQUENCIA = ["nada", "kit20"] as const;

type Estado = {
  /** Giros já feitos neste navegador. */
  n: number;
  premio: string | null;
  codigo: string | null;
};

const VAZIO: Estado = { n: 0, premio: null, codigo: null };

function ler(bruto: string | undefined): Estado {
  if (!bruto) return VAZIO;
  try {
    const o = JSON.parse(Buffer.from(bruto, "base64url").toString("utf8")) as Estado;
    if (typeof o?.n !== "number" || o.n < 0) return VAZIO;
    return {
      n: Math.min(o.n, SEQUENCIA.length),
      premio: typeof o.premio === "string" ? o.premio : null,
      codigo: typeof o.codigo === "string" ? o.codigo : null,
    };
  } catch {
    return VAZIO;
  }
}

function escrever(e: Estado) {
  return Buffer.from(JSON.stringify(e), "utf8").toString("base64url");
}

/** Código do giro. Sem O/0, I/1, S/5 e B/8 — vai ser ditado no WhatsApp. */
function gerarCodigo() {
  const alfabeto = "ACDEFGHJKLMNPQRTUVWXYZ2346789";
  let s = "";
  for (let i = 0; i < 5; i++) s += alfabeto[randomInt(alfabeto.length)];
  return `CZ-${s}`;
}

/** O que o cliente precisa saber, e nada além disso. */
function resposta(e: Estado) {
  return {
    premio: e.premio,
    codigo: e.codigo,
    /** Ainda há giro pela frente? É o que reabilita o botão. */
    podeGirar: e.n < SEQUENCIA.length,
    /** Giros já feitos. O cliente devolve isto no POST seguinte. */
    giros: e.n,
  };
}

function comCookie(corpo: ReturnType<typeof resposta>, e: Estado) {
  const res = NextResponse.json(corpo);
  res.cookies.set(COOKIE, escrever(e), {
    httpOnly: true,
    // `none` + `partitioned` porque a página vive num iframe na Payt: com
    // `lax` o cookie nem é guardado ali. `partitioned` (CHIPS) é o que o
    // Chrome exige para aceitar cookie de terceiro — e ele fica preso ao site
    // de cima, que é exatamente o escopo que queremos.
    sameSite: "none",
    secure: true,
    partitioned: true,
    path: "/",
    maxAge: VALIDADE_S,
  });
  return res;
}

/** Normaliza a contagem que o cliente afirma. Lixo e negativo viram zero. */
function normalizarGiros(bruto: unknown) {
  const n = Number(bruto);
  if (!Number.isInteger(n) || n < 0) return 0;
  return Math.min(n, SEQUENCIA.length);
}

/**
 * Estado atual — usado na montagem da página, para restaurar quem já girou.
 *
 * `?giros=` é a contagem que o navegador guardou. Vem na query e não no corpo
 * porque GET não tem corpo; e precisa vir porque no iframe da Payt o cookie
 * não existe, e sem ela a resposta diria "ninguém girou" para quem já girou.
 */
export async function GET(req: Request) {
  const doCookie = ler((await cookies()).get(COOKIE)?.value);
  const doCliente = normalizarGiros(new URL(req.url).searchParams.get("giros"));
  return NextResponse.json(
    resposta({ ...doCookie, n: Math.max(doCookie.n, doCliente) }),
  );
}

async function girosDoCliente(req: Request) {
  try {
    const corpo = (await req.json()) as { giros?: unknown };
    return normalizarGiros(corpo?.giros);
  } catch {
    return 0;
  }
}

/** Gira. Devolve o prêmio deste giro. */
export async function POST(req: Request) {
  const doCookie = ler((await cookies()).get(COOKIE)?.value);
  const doCliente = await girosDoCliente(req);

  // O maior dos dois: o cookie impede voltar, o cliente faz andar. Ver o
  // comentário no topo do arquivo.
  const n = Math.max(doCookie.n, doCliente);
  const e: Estado = { ...doCookie, n };

  // Acabaram os giros: devolve o que já estava guardado, sem avançar nada.
  // Cobre o clique duplo e o replay da requisição.
  if (n >= SEQUENCIA.length) return NextResponse.json(resposta(e));

  const novo: Estado = {
    n: n + 1,
    premio: SEQUENCIA[n],
    codigo: e.codigo ?? gerarCodigo(),
  };
  return comCookie(resposta(novo), novo);
}

/** Zera o percurso. Só serve ao `?reset=1`, que existe para teste. */
export async function DELETE() {
  return comCookie(resposta(VAZIO), VAZIO);
}
