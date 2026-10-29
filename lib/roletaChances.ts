// Cálculo das chances da roleta e sorteio.
// Roda no servidor (rota /api) e também no cliente (painel, para mostrar a
// chance ao vivo de cada fatia e a previsão de sobra).
//
// Realidade do evento: estoque alto (≈168 brindes) e fluxo de gente incerto.
// Por isso a equipe escolhe um MODO conforme o movimento, e as chances se
// ajustam. Em todos os modos a chance de cada prêmio é proporcional ao
// estoque que resta (tudo esvazia junto), mas o peso de cada prêmio também
// leva em conta o seu VALOR — quanto mais "baixo" o fluxo, mais a roleta
// empurra os prêmios bons (vale, bag, guarda-sol) para não sobrar o que é caro.

export type PremioEstado = {
  slug: string;
  nome: string;
  tipo: string; // premio | vale | tente | nada
  estoque: number | null;
  estoque_inicial: number | null;
  chance_base: number; // mantido por compatibilidade (não usado)
};

export type Modo = "baixo" | "normal" | "alto";

const HORA_INI = 9;
const HORA_FIM = 14;

// Prioridade por valor do prêmio (quanto mais alto, mais a roleta empurra).
const PRIORIDADE: Record<string, number> = {
  bag: 3,
  guardasol: 3,
  vale: 2.2,
  bone: 1.8,
  carboze100: 1.2,
  sache: 1,
};

// Config por modo:
//  - nadaIni/nadaFim: "Não foi dessa vez" no início e no fim do dia
//  - tente: chance de "gire de novo" no 1º giro
//  - k: ênfase no valor (0 = proporcional puro ao estoque; alto = puxa os bons)
const CFG: Record<Modo, { nadaIni: number; nadaFim: number; tente: number; k: number }> = {
  baixo: { nadaIni: 0.03, nadaFim: 0.02, tente: 0.06, k: 1.6 },
  normal: { nadaIni: 0.08, nadaFim: 0.03, tente: 0.08, k: 0.7 },
  alto: { nadaIni: 0.14, nadaFim: 0.06, tente: 0.1, k: 0 },
};

const NADA_EXTRA = 0.04; // no giro extra (quem tirou "tente")
const TENTE_EXTRA = 0;

// Quantas unidades de bag já estão liberadas no horário (10h30 e 12h30).
export function bagLiberadas(hora: number) {
  return (hora >= 10.5 ? 1 : 0) + (hora >= 12.5 ? 1 : 0);
}

/** Estoque que "conta" agora (a bag só libera nos horários). */
export function estoqueEfetivo(p: PremioEstado, hora: number, bagGanhos: number) {
  const est = p.estoque ?? 0;
  if (p.slug === "bag") return Math.max(0, Math.min(est, bagLiberadas(hora) - bagGanhos));
  return est;
}

/**
 * Chances (fração 0..1) por slug, somando 1.
 */
export function calcularChances(
  premios: PremioEstado[],
  hora: number,
  extra: boolean,
  bagGanhos: number,
  modo: Modo = "normal",
): Record<string, number> {
  const cfg = CFG[modo] ?? CFG.normal;
  const prog = Math.min(1, Math.max(0, (hora - HORA_INI) / (HORA_FIM - HORA_INI)));
  const nada = extra ? NADA_EXTRA : cfg.nadaIni - (cfg.nadaIni - cfg.nadaFim) * prog;
  const tente = extra ? TENTE_EXTRA : cfg.tente;
  const orcamento = Math.max(0, 1 - nada - tente);

  const pesos: Record<string, number> = {};
  let soma = 0;
  for (const p of premios) {
    if (p.tipo !== "premio" && p.tipo !== "vale") continue;
    const est = estoqueEfetivo(p, hora, bagGanhos);
    const prio = PRIORIDADE[p.slug] ?? 1;
    const w = est * Math.pow(prio, cfg.k);
    pesos[p.slug] = w;
    soma += w;
  }

  const chances: Record<string, number> = {};
  if (soma <= 0) {
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
