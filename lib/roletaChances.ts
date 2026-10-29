// Cálculo das chances da roleta (chance fixa + reforço anti-sobra) e sorteio.
// Roda no servidor (rota /api) e também no cliente (painel, para mostrar a
// chance ao vivo de cada fatia).

export type PremioEstado = {
  slug: string;
  nome: string;
  tipo: string; // premio | vale | tente | nada
  estoque: number | null;
  estoque_inicial: number | null;
  chance_base: number; // %
};

const HORA_INI = 9;
const HORA_FIM = 14;
const BOOST_MAX = 4; // reforço máximo sobre a chance base
const CHANCE_ABS_MAX = 0.5; // teto absoluto por prêmio

// Quantas unidades de bag já estão liberadas no horário (10h30 e 12h30).
export function bagLiberadas(hora: number) {
  return (hora >= 10.5 ? 1 : 0) + (hora >= 12.5 ? 1 : 0);
}

/**
 * Chances (fração 0..1) por slug, somando 1.
 * - base = chance fixa da tabela
 * - reforço: se o prêmio está "atrasado" (estoque acima do esperado para o
 *   horário), a chance sobe (até BOOST_MAX×), para não sobrar prêmio.
 * - tente: 10% no 1º giro, 0% no extra. nada = o que sobrar.
 */
export function calcularChances(
  premios: PremioEstado[],
  hora: number,
  extra: boolean,
  bagGanhos: number,
): Record<string, number> {
  const fracTempo = Math.min(1, Math.max(0, (HORA_FIM - hora) / (HORA_FIM - HORA_INI)));
  const chances: Record<string, number> = {};
  let somaReais = 0;

  for (const p of premios) {
    if (p.tipo !== "premio" && p.tipo !== "vale") continue;
    const estoque = p.estoque ?? 0;
    let estoqueEfetivo = estoque;
    if (p.slug === "bag") {
      estoqueEfetivo = Math.max(0, Math.min(estoque, bagLiberadas(hora) - bagGanhos));
    }

    let c = 0;
    if (estoqueEfetivo > 0) {
      const base = p.chance_base / 100;
      const esperado = (p.estoque_inicial ?? 0) * fracTempo; // quanto deveria sobrar agora
      const boost = estoque > esperado ? Math.min(estoque / Math.max(esperado, 1), BOOST_MAX) : 1;
      c = Math.min(base * boost, base * BOOST_MAX, CHANCE_ABS_MAX);
    }
    chances[p.slug] = c;
    somaReais += c;
  }

  const tente = extra ? 0 : 0.1;
  const tetoReais = extra ? 1.0 : 0.9; // 1º giro mantém 10% do tente

  if (somaReais > tetoReais) {
    const fator = tetoReais / somaReais;
    for (const k of Object.keys(chances)) chances[k] *= fator;
    somaReais = tetoReais;
  }

  chances.tente = tente;
  chances.nada = Math.max(0, 1 - somaReais - tente);
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
