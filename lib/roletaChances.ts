// Cálculo das chances da roleta e sorteio.
// Roda no servidor (rota /api) e também no cliente (painel, para mostrar a
// chance ao vivo de cada fatia).
//
// Objetivo do evento: POUCA gente passando o dia todo e MUITO prêmio em
// estoque (≈168 brindes). Então a regra é dar prêmio quase sempre — o
// "Não foi dessa vez" é só um tempero pequeno, que ainda diminui ao longo
// do dia para não sobrar brinde no fim.
//
// Como a chance de cada prêmio é PROPORCIONAL ao estoque que resta, tudo
// esvazia junto, no mesmo ritmo, independente de quanta gente aparece:
// prêmio que sai pouco mantém a chance alta, prêmio que sai muito cede a vez.

export type PremioEstado = {
  slug: string;
  nome: string;
  tipo: string; // premio | vale | tente | nada
  estoque: number | null;
  estoque_inicial: number | null;
  chance_base: number; // mantido por compatibilidade (não usado no cálculo novo)
};

const HORA_INI = 9;
const HORA_FIM = 14;

// "Não foi dessa vez": começa baixo e termina quase nulo.
const NADA_INICIO = 0.1; // 10% às 9h
const NADA_FIM = 0.03; // 3% às 14h
const NADA_EXTRA = 0.05; // no giro extra (quem tirou "tente")

const TENTE_1 = 0.08; // 8% de "gire de novo" no 1º giro
const TENTE_EXTRA = 0; // o giro extra não dá outro giro

// Quantas unidades de bag já estão liberadas no horário (10h30 e 12h30).
export function bagLiberadas(hora: number) {
  return (hora >= 10.5 ? 1 : 0) + (hora >= 12.5 ? 1 : 0);
}

/**
 * Chances (fração 0..1) por slug, somando 1.
 * - cada prêmio real: fatia do "orçamento de vitória" proporcional ao estoque
 *   efetivo que resta (a bag é liberada só nos horários).
 * - tente: fixo no 1º giro, 0 no extra.
 * - nada: o resto (pequeno, caindo ao longo do dia).
 */
export function calcularChances(
  premios: PremioEstado[],
  hora: number,
  extra: boolean,
  bagGanhos: number,
): Record<string, number> {
  const prog = Math.min(1, Math.max(0, (hora - HORA_INI) / (HORA_FIM - HORA_INI)));
  const nada = extra ? NADA_EXTRA : NADA_INICIO - (NADA_INICIO - NADA_FIM) * prog;
  const tente = extra ? TENTE_EXTRA : TENTE_1;
  const orcamento = Math.max(0, 1 - nada - tente); // fatia total dos prêmios reais

  const pesos: Record<string, number> = {};
  let soma = 0;
  for (const p of premios) {
    if (p.tipo !== "premio" && p.tipo !== "vale") continue;
    let est = p.estoque ?? 0;
    if (p.slug === "bag") est = Math.max(0, Math.min(est, bagLiberadas(hora) - bagGanhos));
    pesos[p.slug] = est;
    soma += est;
  }

  const chances: Record<string, number> = {};
  if (soma <= 0) {
    // Acabaram os prêmios → vira tudo "não foi" (mantém o tente do 1º giro).
    chances.tente = tente;
    chances.nada = Math.max(0, 1 - tente);
    return chances;
  }
  for (const slug of Object.keys(pesos)) {
    chances[slug] = (pesos[slug] / soma) * orcamento;
  }
  chances.tente = tente;
  chances.nada = nada;
  return chances;
}

/** Sorteia um slug com base nas chances (fração). */
export function sortear(chances: Record<string, number>, rnd = Math.random()): string {
  let acc = 0;
  for (const slug of Object.keys(chances)) {
    acc += chances[slug];
    if (rnd < acc) return slug;
  }
  return "nada";
}
