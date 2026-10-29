"use client";

import { useState, useEffect, useCallback, useRef, FormEvent } from "react";
import { callRpc } from "@/lib/supabase";
import { calcularChances, bagLiberadas, type PremioEstado } from "@/lib/roletaChances";

const AZUL = "#2F3B66";
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
const CORES: Record<string, string> = {
  bag: VERDE,
  guardasol: VERDE,
  bone: AZUL,
  carboze100: "#3a4a7a",
  sache: "#2a3557",
  vale: "#e0a63a",
  tente: "#5566a0",
  nada: "#1a2138",
};

/* ─── Roda (SVG) ─────────────────────────────────────────────── */
function Roda({ rotation }: { rotation: number }) {
  const cx = 220;
  const cy = 220;
  const r = 205;
  const fatias = SLICES.map((slug, i) => {
    const start = i * 30;
    const end = (i + 1) * 30;
    const mid = start + 15;
    const a0 = ((start - 90) * Math.PI) / 180;
    const a1 = ((end - 90) * Math.PI) / 180;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const d = `M${cx},${cy} L${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 0 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z`;
    const phi = ((mid - 90) * Math.PI) / 180;
    const rc = r * 0.6;
    const tx = cx + rc * Math.cos(phi);
    const ty = cy + rc * Math.sin(phi);
    const rot = mid > 180 ? mid + 90 : mid - 90;
    return { slug, d, tx, ty, rot, key: i };
  });

  return (
    <svg viewBox="-6 -6 452 452" className="h-full w-full">
      <circle cx={cx} cy={cy} r={r + 5} fill="#0e1424" />
      <g
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "220px 220px",
          transition: "transform 5.2s cubic-bezier(0.16, 0.74, 0.1, 1)",
        }}
      >
        {fatias.map((s) => (
          <g key={s.key}>
            <path d={s.d} fill={CORES[s.slug]} stroke="#0e1424" strokeWidth="2" />
            <text
              x={s.tx}
              y={s.ty}
              fill="#ffffff"
              fontSize="13"
              fontWeight="800"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${s.rot} ${s.tx} ${s.ty})`}
            >
              {LABEL[s.slug]}
            </text>
          </g>
        ))}
      </g>
      <circle cx={cx} cy={cy} r="36" fill="#0e1424" stroke={VERDE} strokeWidth="3" />
      {/* ponteiro fixo no topo */}
      <polygon points="220,44 203,6 237,6" fill={VERDE} stroke="#0e1424" strokeWidth="1.5" />
    </svg>
  );
}

/* ─── Tipos ──────────────────────────────────────────────────── */
type Cadastro = { id: string; nome: string; telefone: string; ja_girou: boolean; resultado: string | null };
type GiroResp = { ok: boolean; erro?: string; slug?: string; tipo?: string; premio?: string; codigo?: string; extra?: boolean };
type PremioPainel = PremioEstado & { saidos_total: number; saidos_hora: number; ordem: number };
type Giro = { nome: string; telefone: string; premio_nome: string; premio_tipo: string; giro_extra: boolean; codigo: string | null; hora: string };
type PainelResp = { ok: boolean; premios?: PremioPainel[]; total_giros?: number; giros?: Giro[] };

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
      }, 5400);
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
      <main className="flex min-h-dvh items-center justify-center p-5" style={{ backgroundColor: "#141a2e" }}>
        <form onSubmit={onLogin} className="w-full max-w-sm rounded-2xl bg-white/5 p-7 ring-1 ring-white/10">
          <h1 className="font-[family-name:var(--font-basement)] text-xl font-extrabold uppercase text-white">
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
            className="mt-5 w-full rounded-xl py-3.5 font-[family-name:var(--font-basement)] text-sm font-extrabold uppercase tracking-wide text-white"
            style={{ backgroundColor: VERDE }}
          >
            Entrar
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col" style={{ backgroundColor: "#141a2e" }}>
      {/* Topo */}
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <h1 className="font-[family-name:var(--font-basement)] text-lg font-extrabold uppercase text-white">
          Roleta · <span style={{ color: VERDE }}>Parada Certa</span>
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAba("operar")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${aba === "operar" ? "bg-white/15 text-white" : "text-white/50 hover:text-white"}`}
          >
            Operar
          </button>
          <button
            onClick={() => setAba("painel")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${aba === "painel" ? "bg-white/15 text-white" : "text-white/50 hover:text-white"}`}
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

      {/* Resultado em tela cheia */}
      {resultado && (
        <ResultadoOverlay resultado={resultado} onProximo={proximo} onGirarDeNovo={girarDeNovo} />
      )}
    </main>
  );
}

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
  const bloqueado = !selecionado || selecionado.ja_girou || girando;
  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-5 py-6 lg:flex-row lg:items-center lg:justify-center lg:gap-12">
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
          <div className="mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#1b2238]">
            {resultados.map((c) => (
              <button
                key={c.id}
                onClick={() => escolher(c)}
                className="block w-full border-b border-white/5 px-4 py-2.5 text-left transition last:border-0 hover:bg-white/5"
              >
                <span className="font-semibold text-white">{c.nome}</span>
                <span className="ml-2 text-sm text-white/50">
                  {c.telefone.replace(/^55/, "")}
                </span>
                {c.ja_girou && (
                  <span className="ml-2 text-xs font-semibold text-amber-400">já girou</span>
                )}
              </button>
            ))}
          </div>
        )}

        {selecionado && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-lg font-extrabold text-white">{selecionado.nome}</p>
            <p className="text-sm text-white/60">{selecionado.telefone.replace(/^55/, "")}</p>
            {selecionado.ja_girou && (
              <p className="mt-2 text-sm font-semibold text-amber-400">
                Já participou — ganhou: {selecionado.resultado}
              </p>
            )}
            <button onClick={trocar} className="mt-2 text-xs font-semibold text-white/50 hover:text-white">
              Trocar participante
            </button>
          </div>
        )}
        {erroGiro && <p className="mt-3 text-sm font-medium text-red-400">{erroGiro}</p>}
      </div>

      {/* Direita: roda + botão */}
      <div className="flex flex-col items-center">
        <div className="relative aspect-square w-[min(72vw,440px)]">
          <Roda rotation={rotation} />
        </div>
        <button
          onClick={girar}
          disabled={bloqueado}
          className="mt-6 rounded-xl px-12 py-4 font-[family-name:var(--font-basement)] text-lg font-extrabold uppercase tracking-widest text-white transition active:scale-95 disabled:opacity-40"
          style={{ backgroundColor: VERDE }}
        >
          {girando ? "Girando…" : "Girar"}
        </button>
        <p className="mt-2 text-xs text-white/40">
          {selecionado ? "Clique em Girar ou aperte a barra de espaço" : "Busque e selecione o participante"}
        </p>
      </div>
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
  let fundo = VERDE;
  let titulo = "Parabéns, você ganhou!";
  let detalhe = "Retire seu prêmio com a nossa equipe.";
  if (tipo === "vale") {
    detalhe = "Retire no posto! O voucher foi enviado no WhatsApp ✅";
  } else if (tipo === "tente") {
    fundo = "#5566a0";
    titulo = "Tente outra vez!";
    detalhe = "Você ganhou mais um giro 🎉";
  } else if (tipo === "nada") {
    fundo = AZUL;
    titulo = "Não foi dessa vez!";
    detalhe = "Mas o seu CarboZé já está garantido. 💚";
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center" style={{ backgroundColor: fundo }}>
      {tipo !== "tente" && tipo !== "nada" && (
        <p className="font-[family-name:var(--font-archivo)] text-xl uppercase tracking-[0.2em] text-white/80">
          {titulo}
        </p>
      )}
      {(tipo === "tente" || tipo === "nada") && (
        <h2 className="font-[family-name:var(--font-basement)] text-4xl font-extrabold uppercase text-white sm:text-6xl">
          {titulo}
        </h2>
      )}
      {premio && tipo !== "tente" && tipo !== "nada" && (
        <h2 className="mt-3 font-[family-name:var(--font-basement)] text-5xl font-extrabold uppercase text-white sm:text-7xl">
          {premio}
        </h2>
      )}
      <p className="mt-5 max-w-lg font-[family-name:var(--font-archivo)] text-lg text-white/90">
        {detalhe}
      </p>

      <div className="mt-10 flex gap-3">
        {tipo === "tente" ? (
          <>
            <button
              onClick={onGirarDeNovo}
              className="rounded-xl bg-white px-10 py-4 font-[family-name:var(--font-basement)] text-lg font-extrabold uppercase tracking-wide"
              style={{ color: AZUL }}
            >
              Girar de novo
            </button>
            <button onClick={onProximo} className="rounded-xl border border-white/40 px-8 py-4 text-lg font-semibold text-white">
              Encerrar
            </button>
          </>
        ) : (
          <button
            onClick={onProximo}
            className="rounded-xl bg-white px-12 py-4 font-[family-name:var(--font-basement)] text-lg font-extrabold uppercase tracking-wide"
            style={{ color: fundo }}
          >
            Próximo participante
          </button>
        )}
      </div>
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
  const hora = horaRecifeAgora();
  const bagGanhos = premios.find((p) => p.slug === "bag")?.saidos_total ?? 0;
  const chances = calcularChances(premios as PremioEstado[], hora, false, bagGanhos);

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
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-[family-name:var(--font-basement)] text-lg font-extrabold uppercase text-white">
          {dados?.total_giros ?? 0} giros
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

      {/* Prêmios */}
      <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/50">
            <tr>
              <th className="px-3 py-2">Prêmio</th>
              <th className="px-3 py-2">Estoque</th>
              <th className="px-3 py-2">Saíram (hoje / hora)</th>
              <th className="px-3 py-2">Chance ao vivo</th>
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
      <div className="mt-2 overflow-hidden rounded-xl border border-white/10">
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
                  <span className={g.premio_tipo === "nada" || g.premio_tipo === "tente" ? "text-white/50" : "font-semibold text-[#02A81E]"}>
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
