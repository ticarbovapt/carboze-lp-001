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
 * O estado mora num cookie httpOnly, não em localStorage: httpOnly é o que
 * impede o próprio navegador de reescrever a contagem de giros por script.
 * Limpar os cookies zera o percurso — e tudo bem, o pior caso é a pessoa
 * refazer a mesma sequência e receber o mesmo desconto.
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
  };
}

function comCookie(corpo: ReturnType<typeof resposta>, e: Estado) {
  const res = NextResponse.json(corpo);
  res.cookies.set(COOKIE, escrever(e), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: VALIDADE_S,
  });
  return res;
}

/** Estado atual — usado na montagem da página, para restaurar quem já girou. */
export async function GET() {
  const e = ler((await cookies()).get(COOKIE)?.value);
  return NextResponse.json(resposta(e));
}

/** Gira. Devolve o prêmio deste giro. */
export async function POST() {
  const e = ler((await cookies()).get(COOKIE)?.value);

  // Acabaram os giros: devolve o que já estava guardado, sem avançar nada.
  // Cobre o clique duplo e o replay da requisição.
  if (e.n >= SEQUENCIA.length) return NextResponse.json(resposta(e));

  const novo: Estado = {
    n: e.n + 1,
    premio: SEQUENCIA[e.n],
    codigo: e.codigo ?? gerarCodigo(),
  };
  return comCookie(resposta(novo), novo);
}

/** Zera o percurso. Só serve ao `?reset=1`, que existe para teste. */
export async function DELETE() {
  return comCookie(resposta(VAZIO), VAZIO);
}
