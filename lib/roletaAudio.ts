/**
 * Som da roleta — sintetizado na Web Audio API, sem nenhum arquivo de áudio.
 *
 * Por que sintetizar em vez de servir .mp3: o clique da roleta não é um som,
 * são ~160 sons por giro, cada um com timbre e volume diferentes conforme a
 * velocidade. Com arquivo, ou se baixa um sprite e se aceita o mesmo clique
 * repetido (soa robótico), ou se baixam vários — e o primeiro giro estoura
 * antes do áudio chegar. Sintetizado, o custo de rede é zero e a variação sai
 * de graça: cada tique tem pitch e ganho próprios.
 *
 * Todo o áudio nasce no primeiro clique em "GIRAR". Isso não é preferência: o
 * iOS e o Chrome só deixam um AudioContext sair de `suspended` dentro de um
 * gesto do usuário. Criar no import daria um contexto morto e giro mudo.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ruido: AudioBuffer | null = null;

/** Último tique tocado (ms do contexto), para não empilhar cliques em zumbido. */
let ultimoTique = 0;

/** Intervalo mínimo entre tiques. No pico do giro a roda passa um pino a cada
 *  ~10ms; tocar todos vira ruído contínuo. Cortar em 26ms mantém o "trrr" de
 *  roda embalada e devolve os cliques separados quando ela desacelera. */
const TIQUE_MIN_MS = 26;

const K_MUDO = "cz-roleta-mudo";

let mudo = false;

/** Lê a preferência de som gravada. Chamada na montagem do componente. */
export function lerPreferenciaMudo(): boolean {
  try {
    mudo = localStorage.getItem(K_MUDO) === "1";
  } catch {
    mudo = false;
  }
  return mudo;
}

export function definirMudo(v: boolean) {
  mudo = v;
  try {
    localStorage.setItem(K_MUDO, v ? "1" : "0");
  } catch {
    /* storage bloqueado — a preferência vale só para esta sessão */
  }
  if (master && ctx) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(v ? 0 : 0.9, ctx.currentTime);
  }
}

export function estaMudo() {
  return mudo;
}

/**
 * Acorda o áudio. Precisa ser chamada de dentro do handler do clique — de um
 * setTimeout ou de um efeito o navegador ignora e o contexto fica suspenso.
 */
export function iniciarAudio() {
  try {
    if (!ctx) {
      const AC: typeof AudioContext =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = mudo ? 0 : 0.9;
      master.connect(ctx.destination);

      // Um segundo de ruído branco serve de matéria-prima para todo clique e
      // chiado. Gerar uma vez e reusar com playbackRate variado é o que torna
      // 160 tiques por giro baratos.
      const n = Math.floor(ctx.sampleRate);
      ruido = ctx.createBuffer(1, n, ctx.sampleRate);
      const dados = ruido.getChannelData(0);
      for (let i = 0; i < n; i++) dados[i] = Math.random() * 2 - 1;
    }
    // Safari volta para `suspended` sozinho ao trocar de aba.
    if (ctx.state === "suspended") void ctx.resume();
  } catch {
    /* sem áudio: a roleta continua girando, só em silêncio */
  }
}

/** Envelope curto e reutilizável: sobe rápido, cai exponencial. */
function envelope(g: GainNode, t0: number, pico: number, ataque: number, queda: number) {
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(pico, t0 + ataque);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + ataque + queda);
}

function nota(
  freq: number,
  atraso: number,
  dur: number,
  tipo: OscillatorType,
  vol: number,
  freqFinal?: number,
) {
  if (!ctx || !master) return;
  const t0 = ctx.currentTime + atraso;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = tipo;
  o.frequency.setValueAtTime(freq, t0);
  if (freqFinal) o.frequency.exponentialRampToValueAtTime(freqFinal, t0 + dur);
  envelope(g, t0, vol, 0.012, dur);
  o.connect(g).connect(master);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

/**
 * O clique de um pino passando pelo ponteiro.
 *
 * @param intensidade 0..1 — cai junto com a velocidade da roda. É isso que dá
 * a impressão de peso: no começo os cliques são secos e altos, no fim viram
 * toques leves e espaçados.
 */
export function tique(intensidade: number) {
  if (!ctx || !master || !ruido || mudo) return;
  const agora = ctx.currentTime;
  if (agora * 1000 - ultimoTique < TIQUE_MIN_MS) return;
  ultimoTique = agora * 1000;

  const forca = Math.max(0.18, Math.min(1, intensidade));

  // Estalo: ruído em banda estreita, 30ms. É o corpo plástico do pino.
  const src = ctx.createBufferSource();
  src.buffer = ruido;
  src.playbackRate.value = 0.85 + Math.random() * 0.4;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1700 + Math.random() * 1100;
  bp.Q.value = 1.6;
  const g = ctx.createGain();
  envelope(g, agora, 0.5 * forca, 0.001, 0.03);
  src.connect(bp).connect(g).connect(master);
  src.start(agora, Math.random() * 0.5);
  src.stop(agora + 0.06);

  // Um pouco de tom junto do estalo. Só ruído soa a "chiado"; a senoide curta
  // é o que faz o ouvido reconhecer madeira/plástico batendo.
  const o = ctx.createOscillator();
  const og = ctx.createGain();
  o.type = "triangle";
  o.frequency.setValueAtTime(880 + Math.random() * 500, agora);
  envelope(og, agora, 0.16 * forca, 0.001, 0.022);
  o.connect(og).connect(master);
  o.start(agora);
  o.stop(agora + 0.05);
}

/** Chiado de arranque, tocado junto do impulso inicial. */
export function tocarGiro() {
  if (!ctx || !master || !ruido || mudo) return;
  const t0 = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = ruido;
  src.playbackRate.value = 1.6;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(300, t0);
  bp.frequency.exponentialRampToValueAtTime(2600, t0 + 0.5);
  bp.Q.value = 0.9;
  const g = ctx.createGain();
  envelope(g, t0, 0.28, 0.06, 0.5);
  src.connect(bp).connect(g).connect(master);
  src.start(t0);
  src.stop(t0 + 0.7);
}

/**
 * Vitória — o jingle de cassino: arpejo maior subindo, acorde sustentado e
 * uma chuva de "moedas" (blips agudos aleatórios) por cima.
 */
export function tocarVitoria() {
  if (!ctx || !master || mudo) return;

  // Dó maior subindo em oitava: C5 E5 G5 C6.
  const arpejo = [523.25, 659.25, 783.99, 1046.5];
  arpejo.forEach((f, i) => {
    nota(f, i * 0.085, 0.22, "square", 0.13);
    nota(f * 2, i * 0.085, 0.16, "triangle", 0.05);
  });

  // Acorde final segurando, para o giro "aterrissar" em algo.
  [523.25, 659.25, 783.99, 1046.5].forEach((f) => {
    nota(f, 0.36, 0.9, "triangle", 0.09);
  });

  // Moedas caindo. Agudos curtos e desalinhados — alinhados soariam a alarme.
  for (let i = 0; i < 14; i++) {
    const atraso = 0.3 + Math.random() * 0.85;
    nota(1500 + Math.random() * 2200, atraso, 0.09, "sine", 0.055);
  }

  // Sino no topo, fechando.
  nota(2093, 0.42, 1.1, "sine", 0.07);
}

/**
 * Derrota — dois graves descendo com a afinação caindo (o "uó-uó" clássico),
 * abafados por um lowpass. Curto de propósito: a página precisa seguir para a
 * oferta de consolação, não velar o prêmio perdido.
 */
export function tocarDerrota() {
  if (!ctx || !master || mudo) return;
  const t0 = ctx.currentTime;

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(1400, t0);
  lp.frequency.exponentialRampToValueAtTime(420, t0 + 0.9);
  lp.connect(master);

  // Duas notas caindo, cada uma ainda escorregando para baixo.
  [
    { f: 329.63, ff: 246.94, em: 0 },
    { f: 261.63, ff: 174.61, em: 0.3 },
  ].forEach(({ f, ff, em }) => {
    const o = ctx!.createOscillator();
    const g = ctx!.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(f, t0 + em);
    o.frequency.exponentialRampToValueAtTime(ff, t0 + em + 0.42);
    envelope(g, t0 + em, 0.12, 0.02, 0.45);
    o.connect(g).connect(lp);
    o.start(t0 + em);
    o.stop(t0 + em + 0.55);
  });

  // Baque grave por baixo, o "peso" da roda parando no gomo errado.
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(110, t0 + 0.28);
  o.frequency.exponentialRampToValueAtTime(48, t0 + 0.95);
  envelope(g, t0 + 0.28, 0.22, 0.03, 0.7);
  o.connect(g).connect(master);
  o.start(t0 + 0.28);
  o.stop(t0 + 1.1);
}
