"use client";

import { useState, useEffect, useCallback, useRef, FormEvent } from "react";
import { callRpc } from "@/lib/supabase";
import { calcularChances, bagLiberadas, type PremioEstado, type Modo } from "@/lib/roletaChances";

const VERDE = "#02A81E";
const CHAVE = "roleta_admin_senha";

// 12 fatias (ordem do documento). Alguns prêmios ocupam mais de uma fatia.
const SLICES = [
  "bag", "nada", "vale", "sache", "tente", "carboze100",
  "nada", "bone", "vale", "guardasol", "nada", "sache",
];
const LABEL: Record<string, string> = {
  bag: "BAG",
  nada: "NÃO FOI",
  vale: "VALE 5L",
  sache: "SACHÊ",
  tente: "GIRE +1",
  carboze100: "CARBOZÉ",
  bone: "BONÉ",
  guardasol: "GUARDA-SOL",
};

// Famílias de cor: [centro, borda, texto]
const PALETA: Record<string, [string, string, string]> = {
  verde: ["#43e07a", "#0c8f39", "#06331a"],
  azul: ["#6476ba", "#2f3b66", "#eef2ff"],
  navy: ["#45568f", "#1b2444", "#e3e9ff"],
  ouro: ["#ffe08a", "#c6861c", "#4a2e05"],
  tente: ["#8a98d4", "#49558f", "#ffffff"],
  nada: ["#2b3558", "#141a30", "#9aa4c8"],
};
const FAM: Record<string, keyof typeof PALETA> = {
  bag: "verde",
  guardasol: "verde",
  bone: "verde",
  carboze100: "azul",
  sache: "navy",
  vale: "ouro",
  tente: "tente",
  nada: "nada",
};

/* ─── Roda (SVG premium) ─────────────────────────────────────── */
function Roda({ rotation }: { rotation: number }) {
  const cx = 230;
  const cy = 230;
  const R = 210;
  const fams = Object.keys(PALETA) as (keyof typeof PALETA)[];

  const fatias = SLICES.map((slug, i) => {
    const start = i * 30;
    const end = (i + 1) * 30;
    const mid = start + 15;
    const a0 = ((start - 90) * Math.PI) / 180;
    const a1 = ((end - 90) * Math.PI) / 180;
    const x0 = cx + R * Math.cos(a0);
    const y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1);
    const y1 = cy + R * Math.sin(a1);
    const d = `M${cx},${cy} L${x0.toFixed(2)},${y0.toFixed(2)} A${R},${R} 0 0 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z`;
    const phi = ((mid - 90) * Math.PI) / 180;
    const rc = R * 0.62;
    const tx = cx + rc * Math.cos(phi);
    const ty = cy + rc * Math.sin(phi);
    const rot = mid > 180 ? mid + 90 : mid - 90;
    const fam = FAM[slug];
    return { slug, d, tx, ty, rot, fam, key: i, txt: PALETA[fam][2] };
  });

  // studs no aro (12 nas divisas)
  const studs = Array.from({ length: 12 }, (_, i) => {
    const ang = ((i * 30 - 90) * Math.PI) / 180;
    return { x: cx + (R + 11) * Math.cos(ang), y: cy + (R + 11) * Math.sin(ang), key: i };
  });

  return (
    <svg viewBox="-12 -16 484 484" className="h-full w-full" style={{ filter: "drop-shadow(0 18px 40px rgba(0,0,0,.55))" }}>
      <defs>
        {fams.map((f) => (
          <radialGradient key={f} id={`g-${f}`} cx="50%" cy="38%" r="75%">
            <stop offset="0%" stopColor={PALETA[f][0]} />
            <stop offset="100%" stopColor={PALETA[f][1]} />
          </radialGradient>
        ))}
        <linearGradient id="aro" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe9a8" />
          <stop offset="45%" stopColor="#d89a28" />
          <stop offset="100%" stopColor="#8c5e12" />
        </linearGradient>
        <radialGradient id="hub" cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#1c2440" />
          <stop offset="100%" stopColor="#090d18" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* aro externo */}
      <circle cx={cx} cy={cy} r={R + 16} fill="#0b0f1c" />
      <circle cx={cx} cy={cy} r={R + 9} fill="none" stroke="url(#aro)" strokeWidth="9" />
      <circle cx={cx} cy={cy} r={R + 3.5} fill="none" stroke="#0b0f1c" strokeWidth="2" />

      {/* fatias (giram) */}
      <g
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "230px 230px",
          transition: "transform 5.6s cubic-bezier(0.12, 0.74, 0.07, 1)",
        }}
      >
        {fatias.map((s) => (
          <g key={s.key}>
            <path d={s.d} fill={`url(#g-${s.fam})`} stroke="rgba(255,225,150,.5)" strokeWidth="1.5" />
            <text
              x={s.tx}
              y={s.ty}
              fill={s.txt}
              fontSize="14"
              fontWeight="800"
              letterSpacing="0.4"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${s.rot} ${s.tx} ${s.ty})`}
              style={{ textShadow: "0 1px 2px rgba(0,0,0,.35)" }}
            >
              {LABEL[s.slug]}
            </text>
          </g>
        ))}
      </g>

      {/* studs dourados */}
      {studs.map((p) => (
        <circle key={p.key} cx={p.x} cy={p.y} r="3.4" fill="#ffe08a" filter="url(#glow)" />
      ))}

      {/* hub central */}
      <circle cx={cx} cy={cy} r="44" fill="url(#hub)" stroke="url(#aro)" strokeWidth="4" />
      <circle cx={cx} cy={cy} r="30" fill="none" stroke={VERDE} strokeWidth="2.5" opacity="0.9" />
      <circle cx={cx} cy={cy} r="9" fill={VERDE} filter="url(#glow)" />

      {/* ponteiro premium no topo */}
      <g style={{ filter: "drop-shadow(0 3px 4px rgba(0,0,0,.5))" }}>
        <path d={`M${cx},44 L${cx - 20},-4 L${cx + 20},-4 Z`} fill="url(#aro)" stroke="#7a5310" strokeWidth="1.5" />
        <circle cx={cx} cy={6} r="5" fill="#fff6dc" />
      </g>
    </svg>
  );
}

/* ─── Confete ────────────────────────────────────────────────── */
function Confete() {
  const cores = ["#02A81E", "#43e07a", "#ffe08a", "#c6861c", "#6476ba", "#ffffff"];
  const pecas = Array.from({ length: 70 }, (_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 0.5;
    const dur = 2.6 + Math.random() * 2;
    const size = 6 + Math.random() * 9;
    const cor = cores[Math.floor(Math.random() * cores.length)];
    const rot = Math.random() * 360;
    return { i, left, delay, dur, size, cor, rot };
  });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pecas.map((p) => (
        <span
          key={p.i}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: "-6%",
            width: p.size,
            height: p.size * 0.45,
            background: p.cor,
            borderRadius: 2,
            transform: `rotate(${p.rot}deg)`,
            animation: `cz-fall ${p.dur}s cubic-bezier(.3,.1,.5,1) ${p.delay}s forwards`,
          }}
        />
      ))}
      <style>{`@keyframes cz-fall{to{transform:translateY(112vh) rotate(760deg);opacity:.85}}`}</style>
    </div>
  );
}

/* ─── Tipos ──────────────────────────────────────────────────── */
type Cadastro = { id: string; nome: string; telefone: string; ja_girou: boolean; resultado: string | null };
type GiroResp = { ok: boolean; erro?: string; slug?: string; tipo?: string; premio?: string; codigo?: string; extra?: boolean };
type PremioPainel = PremioEstado & { saidos_total: number; saidos_hora: number; ordem: number };
type Giro = { nome: string; telefone: string; premio_nome: string; premio_tipo: string; giro_extra: boolean; codigo: string | null; hora: string };
type PainelResp = { ok: boolean; modo?: Modo; premios?: PremioPainel[]; total_giros?: number; giros?: Giro[] };

function horaRecifeAgora() {
  const d = new Date();
  return d.getHours() + d.getMinutes() / 60;
}

/* ─── Componente ─────────────────────────────────────────────── */
export default function RoletaClient() {
  const [senha, setSenha] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  const [erroLogin, setErroLogin] = useState("");
  const [aba, setAba] = useState<"operar" | "painel">("operar");

  // operar
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState<Cadastro[]>([]);
  const [selecionado, setSelecionado] = useState<Cadastro | null>(null);
  const [girando, setGirando] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [resultado, setResultado] = useState<GiroResp | null>(null);
  const [erroGiro, setErroGiro] = useState("");
  const rotacaoRef = useRef(0);

  const entrar = useCallback(async (s: string) => {
    setErroLogin("");
    try {
      const r = await callRpc<PainelResp>("roleta_painel", { p_senha: s });
      if (r?.ok) {
        setAutenticado(true);
        try {
          sessionStorage.setItem(CHAVE, s);
        } catch {
          /* noop */
        }
      } else {
        setErroLogin("Senha incorreta.");
      }
    } catch {
      setErroLogin("Não foi possível entrar. Tente novamente.");
    }
  }, []);

  useEffect(() => {
    let s = "";
    try {
      s = sessionStorage.getItem(CHAVE) ?? "";
    } catch {
      s = "";
    }
    if (s) {
      setSenha(s);
      entrar(s);
    }
  }, [entrar]);

  // busca com debounce
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  function aoDigitar(v: string) {
    setBusca(v);
    setSelecionado(null);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (v.trim().length < 2) {
      setResultados([]);
      return;
    }
    timerRef.current = setTimeout(async () => {
      try {
        const r = await callRpc<{ ok: boolean; resultados?: Cadastro[] }>("roleta_buscar", {
          p_termo: v,
          p_senha: senha,
        });
        if (r?.ok) setResultados(r.resultados ?? []);
      } catch {
        /* silencioso */
      }
    }, 250);
  }

  function escolher(c: Cadastro) {
    setSelecionado(c);
    setResultados([]);
    setBusca(`${c.nome} · ${c.telefone.replace(/^55/, "")}`);
    setErroGiro("");
  }

  function anima(slug: string) {
    const idxs = SLICES.map((s, i) => (s === slug ? i : -1)).filter((i) => i >= 0);
    const i = idxs.length ? idxs[Math.floor(Math.random() * idxs.length)] : 1;
    const centro = i * 30 + 15;
    const atual = rotacaoRef.current;
    const base = atual - (atual % 360);
    const alvo = base + 360 * 6 + ((360 - centro) % 360);
    rotacaoRef.current = alvo;
    setRotation(alvo);
  }

  const girar = useCallback(async () => {
    if (!selecionado || girando) return;
    setErroGiro("");
    setGirando(true);
    try {
      const resp = await fetch("/api/recebermeucarboze/roleta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cadastro_id: selecionado.id, senha }),
      });
      const r = (await resp.json()) as GiroResp;
      if (!r?.ok || !r.slug) {
        setGirando(false);
        const msg =
          r?.erro === "ja_girou"
            ? "Essa pessoa já girou."
            : r?.erro === "fora_horario"
              ? "Fora do horário da roleta (9h–14h)."
              : r?.erro === "nao_encontrado"
                ? "Cadastro não encontrado."
                : "Não foi possível girar. Tente novamente.";
        setErroGiro(msg);
        return;
      }
      anima(r.slug);
      window.setTimeout(() => {
        setResultado(r);
        setGirando(false);
      }, 5800);
    } catch {
      setGirando(false);
      setErroGiro("Não foi possível girar. Tente novamente.");
    }
  }, [selecionado, girando, senha]);

  // barra de espaço gira
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space" && aba === "operar" && !resultado && selecionado && !selecionado.ja_girou && !girando) {
        e.preventDefault();
        girar();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aba, resultado, selecionado, girando, girar]);

  function proximo() {
    setResultado(null);
    setSelecionado(null);
    setResultados([]);
    setBusca("");
    setErroGiro("");
  }

  function girarDeNovo() {
    setResultado(null);
    girar();
  }

  /* ─── Login ────────────────────────────────────────────────── */
  if (!autenticado) {
    function onLogin(e: FormEvent) {
      e.preventDefault();
      if (senha.trim()) entrar(senha.trim());
    }
    return (
      <main className="flex min-h-dvh items-center justify-center p-5 text-white" style={fundoStyle}>
        <form onSubmit={onLogin} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur">
          <p className="font-[family-name:var(--font-archivo)] text-xs uppercase tracking-[0.3em] text-[#ffe08a]">
            Grupo Carbo
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-basement)] text-2xl font-extrabold uppercase">
            Roleta · Parada Certa
          </h1>
          <p className="mt-1 font-[family-name:var(--font-archivo)] text-sm text-white/55">
            Acesso da equipe.
          </p>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha de acesso"
            className="mt-5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-[#02A81E] focus:outline-none"
          />
          {erroLogin && <p className="mt-3 text-sm font-medium text-red-400">{erroLogin}</p>}
          <button
            type="submit"
            className="mt-5 w-full rounded-xl py-3.5 font-[family-name:var(--font-basement)] text-sm font-extrabold uppercase tracking-wide text-white shadow-lg transition active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg,#02A81E,#0c8f39)" }}
          >
            Entrar
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col text-white" style={fundoStyle}>
      {/* Topo */}
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-3.5 backdrop-blur-sm">
        <div className="flex items-baseline gap-2">
          <h1 className="font-[family-name:var(--font-basement)] text-lg font-extrabold uppercase">
            Roleta
          </h1>
          <span className="font-[family-name:var(--font-archivo)] text-xs uppercase tracking-[0.25em] text-[#ffe08a]">
            Parada Certa
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => setAba("operar")}
            className={`rounded-full px-5 py-1.5 text-sm font-semibold transition ${aba === "operar" ? "bg-white/15 text-white shadow" : "text-white/50 hover:text-white"}`}
          >
            Operar
          </button>
          <button
            onClick={() => setAba("painel")}
            className={`rounded-full px-5 py-1.5 text-sm font-semibold transition ${aba === "painel" ? "bg-white/15 text-white shadow" : "text-white/50 hover:text-white"}`}
          >
            Painel
          </button>
        </div>
      </header>

      {aba === "operar" ? (
        <OperarView
          busca={busca}
          resultados={resultados}
          selecionado={selecionado}
          girando={girando}
          rotation={rotation}
          erroGiro={erroGiro}
          aoDigitar={aoDigitar}
          escolher={escolher}
          trocar={() => {
            setSelecionado(null);
            setBusca("");
          }}
          girar={girar}
        />
      ) : (
        <PainelView senha={senha} />
      )}

      {resultado && (
        <ResultadoOverlay resultado={resultado} onProximo={proximo} onGirarDeNovo={girarDeNovo} />
      )}
    </main>
  );
}

const fundoStyle: React.CSSProperties = {
  background:
    "radial-gradient(1200px 600px at 50% -10%, #223059 0%, #141a2e 45%, #0c1020 100%)",
};

/* ─── Operar ─────────────────────────────────────────────────── */
function OperarView({
  busca,
  resultados,
  selecionado,
  girando,
  rotation,
  erroGiro,
  aoDigitar,
  escolher,
  trocar,
  girar,
}: {
  busca: string;
  resultados: Cadastro[];
  selecionado: Cadastro | null;
  girando: boolean;
  rotation: number;
  erroGiro: string;
  aoDigitar: (v: string) => void;
  escolher: (c: Cadastro) => void;
  trocar: () => void;
  girar: () => void;
}) {
  const pronto = !!selecionado && !selecionado.ja_girou && !girando;
  const bloqueado = !pronto;
  return (
    <div className="flex flex-1 flex-col items-center gap-8 px-5 py-8 lg:flex-row lg:items-center lg:justify-center lg:gap-16">
      {/* Esquerda: busca */}
      <div className="w-full max-w-sm">
        <label className="font-[family-name:var(--font-archivo)] text-xs uppercase tracking-widest text-white/50">
          Buscar participante (telefone ou nome)
        </label>
        <input
          value={busca}
          onChange={(e) => aoDigitar(e.target.value)}
          placeholder="Digite o telefone…"
          autoComplete="off"
          className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-white placeholder-white/30 focus:border-[#02A81E] focus:outline-none"
        />
        {resultados.length > 0 && !selecionado && (
          <div className="mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#1b2238] shadow-xl">
            {resultados.map((c) => (
              <button
                key={c.id}
                onClick={() => escolher(c)}
                className="block w-full border-b border-white/5 px-4 py-2.5 text-left transition last:border-0 hover:bg-white/5"
              >
                <span className="font-semibold text-white">{c.nome}</span>
                <span className="ml-2 text-sm text-white/50">{c.telefone.replace(/^55/, "")}</span>
                {c.ja_girou && <span className="ml-2 text-xs font-semibold text-amber-400">já girou</span>}
              </button>
            ))}
          </div>
        )}

        {selecionado && (
          <div className="mt-4 rounded-2xl border border-[#ffe08a]/30 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-5 shadow-lg">
            <p className="font-[family-name:var(--font-archivo)] text-[11px] uppercase tracking-widest text-[#ffe08a]/80">
              Participante
            </p>
            <p className="mt-1 text-2xl font-extrabold text-white">{selecionado.nome}</p>
            <p className="text-sm text-white/60">{selecionado.telefone.replace(/^55/, "")}</p>
            {selecionado.ja_girou && (
              <p className="mt-2 rounded-lg bg-amber-400/10 px-3 py-1.5 text-sm font-semibold text-amber-300">
                Já participou — ganhou: {selecionado.resultado}
              </p>
            )}
            <button onClick={trocar} className="mt-3 text-xs font-semibold text-white/50 hover:text-white">
              ← Trocar participante
            </button>
          </div>
        )}
        {erroGiro && <p className="mt-3 text-sm font-medium text-red-400">{erroGiro}</p>}
      </div>

      {/* Direita: roda + botão */}
      <div className="flex flex-col items-center">
        <div
          className="relative aspect-square w-[min(76vw,480px)]"
          style={{ filter: girando ? "none" : undefined }}
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(2,168,30,.25), rgba(100,118,186,.12) 60%, transparent 70%)" }}
          />
          <Roda rotation={rotation} />
        </div>
        <button
          onClick={girar}
          disabled={bloqueado}
          className={`mt-7 rounded-2xl px-16 py-5 font-[family-name:var(--font-basement)] text-xl font-extrabold uppercase tracking-[0.15em] text-white shadow-xl transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 ${pronto ? "cz-pulse" : ""}`}
          style={{ background: "linear-gradient(135deg,#02A81E,#0c8f39)", boxShadow: pronto ? "0 10px 30px rgba(2,168,30,.45)" : undefined }}
        >
          {girando ? "Girando…" : "Girar"}
        </button>
        <p className="mt-3 text-xs text-white/40">
          {selecionado ? "Clique em Girar ou aperte a barra de espaço" : "Busque e selecione o participante"}
        </p>
      </div>

      <style>{`@keyframes cz-pulse-kf{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}.cz-pulse{animation:cz-pulse-kf 1.8s ease-in-out infinite}`}</style>
    </div>
  );
}

/* ─── Resultado ──────────────────────────────────────────────── */
function ResultadoOverlay({
  resultado,
  onProximo,
  onGirarDeNovo,
}: {
  resultado: GiroResp;
  onProximo: () => void;
  onGirarDeNovo: () => void;
}) {
  const { tipo, premio } = resultado;
  const ganhou = tipo === "premio" || tipo === "vale";
  let fundo = "radial-gradient(900px 500px at 50% 0%, #0ea84a 0%, #046b2c 60%, #023d19 100%)";
  let titulo = "Parabéns, você ganhou!";
  let detalhe = "Retire seu prêmio com a nossa equipe. 🎁";
  if (tipo === "vale") {
    detalhe = "O voucher já foi enviado no seu WhatsApp. Retire no posto! ⛽";
  } else if (tipo === "tente") {
    fundo = "radial-gradient(900px 500px at 50% 0%, #4a5a9e 0%, #2f3b66 60%, #1a2140 100%)";
    titulo = "Tente outra vez!";
    detalhe = "Você ganhou mais um giro 🎉";
  } else if (tipo === "nada") {
    fundo = "radial-gradient(900px 500px at 50% 0%, #33406e 0%, #202a4a 60%, #141a30 100%)";
    titulo = "Não foi dessa vez!";
    detalhe = "Mas o seu CarboZé já está garantido. 💚";
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden p-6 text-center text-white" style={{ background: fundo }}>
      {ganhou && <Confete />}
      <div className="relative" style={{ animation: "cz-pop .45s cubic-bezier(.2,1.3,.4,1) both" }}>
        {ganhou ? (
          <>
            <p className="font-[family-name:var(--font-archivo)] text-lg uppercase tracking-[0.3em] text-white/80">
              {titulo}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-basement)] text-6xl font-extrabold uppercase drop-shadow-lg sm:text-7xl">
              {premio}
            </h2>
          </>
        ) : (
          <h2 className="font-[family-name:var(--font-basement)] text-5xl font-extrabold uppercase drop-shadow-lg sm:text-6xl">
            {titulo}
          </h2>
        )}
        <p className="mx-auto mt-5 max-w-lg font-[family-name:var(--font-archivo)] text-lg text-white/90">
          {detalhe}
        </p>
      </div>

      <div className="relative mt-11 flex gap-3">
        {tipo === "tente" ? (
          <>
            <button
              onClick={onGirarDeNovo}
              className="rounded-xl bg-white px-10 py-4 font-[family-name:var(--font-basement)] text-lg font-extrabold uppercase tracking-wide text-[#2f3b66] shadow-lg transition active:scale-95"
            >
              Girar de novo
            </button>
            <button onClick={onProximo} className="rounded-xl border border-white/40 px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/10">
              Encerrar
            </button>
          </>
        ) : (
          <button
            onClick={onProximo}
            className="rounded-xl bg-white px-12 py-4 font-[family-name:var(--font-basement)] text-lg font-extrabold uppercase tracking-wide text-[#093a30] shadow-lg transition active:scale-95"
          >
            Próximo participante
          </button>
        )}
      </div>
      <style>{`@keyframes cz-pop{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

/* ─── Painel da equipe ───────────────────────────────────────── */
function PainelView({ senha }: { senha: string }) {
  const [dados, setDados] = useState<PainelResp | null>(null);
  const [edit, setEdit] = useState<Record<string, string>>({});

  const carregar = useCallback(async () => {
    try {
      const r = await callRpc<PainelResp>("roleta_painel", { p_senha: senha });
      if (r?.ok) setDados(r);
    } catch {
      /* silencioso */
    }
  }, [senha]);

  useEffect(() => {
    carregar();
    const id = setInterval(() => {
      if (!document.hidden) carregar();
    }, 8000);
    return () => clearInterval(id);
  }, [carregar]);

  const premios = dados?.premios ?? [];
  const giros = dados?.giros ?? [];
  const totalGiros = dados?.total_giros ?? 0;
  const modo: Modo = dados?.modo ?? "normal";
  const hora = horaRecifeAgora();
  const bagGanhos = premios.find((p) => p.slug === "bag")?.saidos_total ?? 0;
  const chances = calcularChances(premios as PremioEstado[], hora, false, bagGanhos, modo);

  // Previsão até as 14h a partir do ritmo atual de giros.
  const decorrido = Math.max(0.25, Math.min(5, hora - 9));
  const restam = Math.max(0, 14 - hora);
  const ritmo = totalGiros / decorrido; // giros por hora
  const girosFuturos = ritmo * restam;
  const projPronta = totalGiros >= 5 && restam > 0.1;
  function sobraPrev(slug: string, estoque: number | null) {
    const est = estoque ?? 0;
    const consumo = girosFuturos * (chances[slug] ?? 0);
    return Math.max(0, Math.round(est - consumo));
  }

  async function salvarModo(m: Modo) {
    await callRpc("roleta_set_modo", { p_modo: m, p_senha: senha });
    carregar();
  }

  async function salvarEstoque(slug: string) {
    const v = parseInt(edit[slug] ?? "", 10);
    if (Number.isNaN(v)) return;
    await callRpc("roleta_set_estoque", { p_slug: slug, p_estoque: v, p_senha: senha });
    setEdit((e) => ({ ...e, [slug]: "" }));
    carregar();
  }

  async function zerar() {
    if (!window.confirm("Zerar TUDO da roleta? (apaga giros, volta o estoque e libera os códigos de vale)")) return;
    await callRpc("roleta_reset", { p_senha: senha });
    carregar();
  }

  function exportarCsv() {
    const cab = ["Nome", "Telefone", "Prêmio", "Código", "Giro extra", "Hora"];
    const linhas = giros.map((g) => [g.nome, g.telefone, g.premio_nome, g.codigo ?? "", g.giro_extra ? "Sim" : "Não", g.hora]);
    const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [cab, ...linhas].map((l) => l.map(esc).join(";")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "roleta-historico.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function exportarPdf() {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Roleta — Histórico de giros", 14, 16);
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`${giros.length} giros`, 14, 22);
    autoTable(doc, {
      head: [["Nome", "Telefone", "Prêmio", "Código", "Hora"]],
      body: giros.map((g) => [g.nome, g.telefone, g.premio_nome, g.codigo ?? "", g.hora]),
      startY: 27,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [47, 59, 102] },
    });
    doc.save("roleta-historico.pdf");
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-[family-name:var(--font-basement)] text-xl font-extrabold uppercase text-white">
          {dados?.total_giros ?? 0} <span className="text-white/50">giros</span>
        </p>
        <div className="flex gap-2">
          <button onClick={exportarCsv} className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:border-[#02A81E]">
            Planilha
          </button>
          <button onClick={exportarPdf} className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:border-[#02A81E]">
            PDF
          </button>
          <button onClick={zerar} className="rounded-lg border border-red-400/40 px-3 py-2 text-sm font-semibold text-red-300 hover:border-red-400">
            Zerar
          </button>
        </div>
      </div>

      {/* Modo de fluxo */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-[family-name:var(--font-basement)] text-sm font-extrabold uppercase text-white">
              Modo de fluxo
            </p>
            <p className="mt-0.5 font-[family-name:var(--font-archivo)] text-[12px] text-white/50">
              Escolha conforme o movimento. Olhe a coluna <b className="text-white/70">Sobra prev.</b> pra decidir.
            </p>
          </div>
          <div className="flex gap-1.5 rounded-full border border-white/10 bg-white/5 p-1">
            {(
              [
                ["baixo", "Fluxo baixo"],
                ["normal", "Normal"],
                ["alto", "Fluxo alto"],
              ] as [Modo, string][]
            ).map(([m, rotulo]) => (
              <button
                key={m}
                onClick={() => salvarModo(m)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${modo === m ? "bg-[#02A81E] text-white shadow" : "text-white/55 hover:text-white"}`}
              >
                {rotulo}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 font-[family-name:var(--font-archivo)] text-[12px] text-white/55">
          {modo === "baixo" && "Poucos motoqueiros: a roleta empurra os prêmios bons (vale, bag, guarda-sol) pra não sobrar o que é caro. Quase ninguém sai sem nada."}
          {modo === "normal" && "Equilíbrio: distribui proporcional ao estoque e protege os prêmios escassos. Bom padrão."}
          {modo === "alto" && "Fila grande: segura os prêmios caros/escassos pra durarem o dia, puxa mais sachê e CarboZé, e o \"não foi\" fica um pouco maior."}
        </p>
      </div>

      {/* Prêmios */}
      <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/50">
            <tr>
              <th className="px-3 py-2">Prêmio</th>
              <th className="px-3 py-2">Estoque</th>
              <th className="px-3 py-2">Saíram (hoje / hora)</th>
              <th className="px-3 py-2">Chance ao vivo</th>
              <th className="px-3 py-2">Sobra prev.</th>
              <th className="px-3 py-2">Ajustar</th>
            </tr>
          </thead>
          <tbody>
            {premios.map((p) => {
              const bag0 = p.slug === "bag";
              const chance = (chances[p.slug] ?? 0) * 100;
              return (
                <tr key={p.slug} className="border-t border-white/5 text-white">
                  <td className="px-3 py-2 font-semibold">{p.nome}</td>
                  <td className="px-3 py-2">{p.estoque ?? "–"}</td>
                  <td className="px-3 py-2 text-white/70">
                    {p.saidos_total} / {p.saidos_hora}
                  </td>
                  <td className="px-3 py-2" style={{ color: chance > 0 ? VERDE : "#8893ad" }}>
                    {chance.toFixed(1)}%
                    {bag0 && bagLiberadas(hora) === 0 && (
                      <span className="ml-1 text-[10px] text-white/40">(libera 10h30)</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {(() => {
                      const temEstoque = (p.estoque ?? 0) > 0;
                      if (p.tipo !== "premio" && p.tipo !== "vale") return <span className="text-white/30">–</span>;
                      if (!temEstoque) return <span className="text-white/40">esgotado</span>;
                      if (!projPronta) return <span className="text-white/40">—</span>;
                      const s = sobraPrev(p.slug, p.estoque);
                      if (s <= 0) return <span className="font-semibold" style={{ color: VERDE }}>zera 👍</span>;
                      const alto = s > (p.estoque ?? 0) * 0.3 && s >= 2;
                      return <span className={alto ? "font-semibold text-amber-400" : "text-white/70"}>~{s}{alto ? " ⚠" : ""}</span>;
                    })()}
                  </td>
                  <td className="px-3 py-2">
                    {p.tipo === "premio" || p.tipo === "vale" ? (
                      <div className="flex items-center gap-1">
                        <input
                          value={edit[p.slug] ?? ""}
                          onChange={(e) => setEdit((s) => ({ ...s, [p.slug]: e.target.value.replace(/\D/g, "") }))}
                          placeholder={String(p.estoque ?? 0)}
                          className="w-16 rounded border border-white/15 bg-white/5 px-2 py-1 text-white"
                        />
                        <button
                          onClick={() => salvarEstoque(p.slug)}
                          className="rounded border border-white/15 px-2 py-1 text-xs text-white/70 hover:border-[#02A81E]"
                        >
                          ok
                        </button>
                      </div>
                    ) : (
                      "–"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Histórico */}
      <p className="mt-6 font-[family-name:var(--font-basement)] text-sm font-extrabold uppercase text-white">
        Histórico
      </p>
      <div className="mt-2 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
        {giros.length === 0 ? (
          <p className="p-4 text-center text-sm text-white/50">Nenhum giro ainda.</p>
        ) : (
          <div className="max-h-[50vh] overflow-y-auto">
            {giros.map((g, i) => (
              <div key={i} className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-2 text-sm last:border-0">
                <div className="min-w-0">
                  <span className="font-semibold text-white">{g.nome}</span>
                  <span className="ml-2 text-white/50">{g.telefone.replace(/^55/, "")}</span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className={g.premio_tipo === "nada" || g.premio_tipo === "tente" ? "text-white/50" : "font-semibold text-[#43e07a]"}>
                    {g.premio_nome}
                    {g.codigo ? ` · ${g.codigo}` : ""}
                  </span>
                  <span className="text-white/40">{g.hora}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
