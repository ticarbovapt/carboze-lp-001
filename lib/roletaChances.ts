// Cálculo das chances da roleta e sorteio.
// Roda no servidor (rota /api) e também no cliente (painel, chance ao vivo).
//
// MODO AUTOMÁTICO (padrão): a roleta lê o ritmo real de giros (giros/hora) e
// se ajusta sozinha. A cada giro ela estima quantos giros ainda devem rolar
// até as 14h (ritmo × tempo restante) e "mira" em zerar o estoque no fim:
//  - fluxo ALTO  -> segura os prêmios pra durarem o dia (ritma a saída);
//  - fluxo BAIXO -> abre a mão e empurra os prêmios de valor pra não sobrar
//                   o que é caro (vale, bag, guarda-sol).
// Ninguém precisa mexer em nada. Os modos fixos (baixo/normal/alto) existem
// só como override manual de emergência.

export type PremioEstado = {
  slug: string;
  nome: string;
  tipo: string; // premio | vale | tente | nada
  estoque: number | null;
  estoque_inicial: number | null;
  chance_base: number; // compat (não usado)
};

export type Modo = "auto" | "baixo" | "normal" | "alto";

const HORA_INI = 9;
const HORA_FIM = 14;

// Prioridade por valor do prêmio (quanto mais alto, mais a roleta empurra
// quando há folga de estoque).
const PRIORIDADE: Record<string, number> = {
  bag: 3,
  guardasol: 3,
  vale: 2.2,
  bone: 1.8,
  carboze100: 1.2,
  sache: 1,
};

// Modos fixos (override manual).
const CFG: Record<Exclude<Modo, "auto">, { nadaIni: number; nadaFim: number; tente: number; k: number }> = {
  baixo: { nadaIni: 0.03, nadaFim: 0.02, tente: 0.06, k: 1.6 },
  normal: { nadaIni: 0.08, nadaFim: 0.03, tente: 0.08, k: 0.7 },
  alto: { nadaIni: 0.14, nadaFim: 0.06, tente: 0.1, k: 0 },
};

// Auto
const AUTO_TENTE = 0.06;
const AUTO_NADA = 0.04; // piso de "não foi" quando há folga
const AUTO_K = 1.4; // ênfase no valor quando sobra estoque

const NADA_EXTRA = 0.04;
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

/** Rótulo amigável do fluxo detectado, a partir do ritmo (giros/h). */
export function rotuloFluxo(ritmo: number): string {
  if (ritmo < 20) return "baixo";
  if (ritmo < 40) return "médio";
  return "alto";
}

function chancesFixo(
  premios: PremioEstado[],
  hora: number,
  extra: boolean,
  bagGanhos: number,
  modo: Exclude<Modo, "auto">,
): Record<string, number> {
  const cfg = CFG[modo];
  const prog = Math.min(1, Math.max(0, (hora - HORA_INI) / (HORA_FIM - HORA_INI)));
  const nada = extra ? NADA_EXTRA : cfg.nadaIni - (cfg.nadaIni - cfg.nadaFim) * prog;
  const tente = extra ? TENTE_EXTRA : cfg.tente;
  const orcamento = Math.max(0, 1 - nada - tente);

  const pesos: Record<string, number> = {};
  let soma = 0;
  for (const p of premios) {
    if (p.tipo !== "premio" && p.tipo !== "vale") continue;
    const est = estoqueEfetivo(p, hora, bagGanhos);
    pesos[p.slug] = est * Math.pow(PRIORIDADE[p.slug] ?? 1, cfg.k);
    soma += pesos[p.slug];
  }
  const ch: Record<string, number> = {};
  if (soma <= 0) {
    ch.tente = tente;
    ch.nada = Math.max(0, 1 - tente);
    return ch;
  }
  for (const s of Object.keys(pesos)) ch[s] = (pesos[s] / soma) * orcamento;
  ch.tente = tente;
  ch.nada = nada;
  return ch;
}

function chancesAuto(
  premios: PremioEstado[],
  hora: number,
  extra: boolean,
  bagGanhos: number,
  ritmo: number, // giros por hora observado
): Record<string, number> {
  const tRem = Math.max(0, HORA_FIM - hora);
  const tente = extra ? TENTE_EXTRA : AUTO_TENTE;
  const nadaPiso = extra ? NADA_EXTRA : AUTO_NADA;
  const winCap = Math.max(0, 1 - nadaPiso - tente);
  const girosRestantes = Math.max(0, ritmo) * tRem; // quantos giros ainda devem rolar

  const est: Record<string, number> = {};
  let temEstoque = false;
  for (const p of premios) {
    if (p.tipo !== "premio" && p.tipo !== "vale") continue;
    const e = estoqueEfetivo(p, hora, bagGanhos);
    est[p.slug] = e;
    if (e > 0) temEstoque = true;
  }
  const ch: Record<string, number> = {};
  if (!temEstoque) {
    ch.tente = tente;
    ch.nada = Math.max(0, 1 - tente);
    return ch;
  }

  // Alvo pra zerar cada prêmio no fim: estoque / giros_restantes.
  const paced = girosRestantes > 0.5;
  let somaAlvo = 0;
  const alvo: Record<string, number> = {};
  if (paced) {
    for (const s of Object.keys(est)) {
      alvo[s] = est[s] / girosRestantes;
      somaAlvo += alvo[s];
    }
  }

  if (paced && somaAlvo <= winCap) {
    // FLUXO ALTO/SUFICIENTE: ritma a saída pra não acabar cedo; o "não foi"
    // fica com a folga (espalhado ao longo do dia, não só no fim).
    for (const s of Object.keys(alvo)) ch[s] = alvo[s];
    ch.tente = tente;
    ch.nada = Math.max(nadaPiso, 1 - somaAlvo - tente);
    return ch;
  }

  // FLUXO BAIXO (sobra estoque): distribui o orçamento de vitória priorizando
  // o valor, pra esvaziar o que é caro. "Não foi" no piso.
  let soma = 0;
  const pesos: Record<string, number> = {};
  for (const s of Object.keys(est)) {
    pesos[s] = est[s] * Math.pow(PRIORIDADE[s] ?? 1, AUTO_K);
    soma += pesos[s];
  }
  for (const s of Object.keys(pesos)) ch[s] = soma > 0 ? (pesos[s] / soma) * winCap : 0;
  ch.tente = tente;
  ch.nada = nadaPiso;
  return ch;
}

/**
 * Chances (fração 0..1) por slug, somando ~1.
 * modo "auto" usa o ritmo (giros/h); os demais são fixos.
 */
export function calcularChances(
  premios: PremioEstado[],
  hora: number,
  extra: boolean,
  bagGanhos: number,
  modo: Modo = "auto",
  ritmo = 0,
): Record<string, number> {
  if (modo === "auto") return chancesAuto(premios, hora, extra, bagGanhos, ritmo);
  return chancesFixo(premios, hora, extra, bagGanhos, modo);
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
