"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useMemo, FormEvent } from "react";
import { callRpc } from "@/lib/supabase";

const DATA_ACAO = "2026-10-31";
const DATA_LABEL = "31/10 · 9h às 14h";
const LOCAL_TITULO = "Container Parada Certa";
const HORARIOS = [
  "09:00", "09:25", "09:50", "10:15",
  "10:40", "11:05", "11:30", "11:55",
  "12:20", "12:45", "13:10", "13:35",
];
const CAPACIDADE = 2;
const TOTAL_VAGAS = HORARIOS.length * CAPACIDADE;
const GRAD = "linear-gradient(100deg, #2b7fe4, #1fae4d)";
const CHAVE_SESSAO = "pc_admin_senha";

type Agendamento = {
  nome: string;
  telefone: string;
  veiculo: string;
  ano: string | null;
  km: string | null;
  data: string;
  horario: string;
  criado_em: string;
  confirmacao_enviada: boolean;
  lembrete_24h_enviado: boolean;
  lembrete_1h_enviado: boolean;
};
type AdminResp = { ok: boolean; agendamentos?: Agendamento[] };

function formatarTelefone(t: string) {
  const d = t.replace(/\D/g, "");
  const sem55 = d.startsWith("55") ? d.slice(2) : d;
  if (sem55.length < 10) return t;
  const ddd = sem55.slice(0, 2);
  const resto = sem55.slice(2);
  const meio = resto.length === 9 ? resto.slice(0, 5) : resto.slice(0, 4);
  const fim = resto.length === 9 ? resto.slice(5) : resto.slice(4);
  return `(${ddd}) ${meio}-${fim}`;
}

function baixar(blob: Blob, nome: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function AdminClient() {
  const [senha, setSenha] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  const [dados, setDados] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [copiado, setCopiado] = useState(false);

  const buscar = useCallback(async (senhaUsada: string) => {
    setCarregando(true);
    setErro("");
    try {
      const r = await callRpc<AdminResp>("parada_certa_admin", { p_senha: senhaUsada });
      if (r?.ok) {
        setDados(r.agendamentos ?? []);
        setAutenticado(true);
        try {
          sessionStorage.setItem(CHAVE_SESSAO, senhaUsada);
        } catch {
          /* sessionStorage indisponível */
        }
      } else {
        setErro("Senha incorreta.");
        setAutenticado(false);
      }
    } catch {
      setErro("Não foi possível carregar agora. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    let salva = "";
    try {
      salva = sessionStorage.getItem(CHAVE_SESSAO) ?? "";
    } catch {
      salva = "";
    }
    if (salva) {
      setSenha(salva);
      buscar(salva);
    }
  }, [buscar]);

  function sair() {
    try {
      sessionStorage.removeItem(CHAVE_SESSAO);
    } catch {
      /* noop */
    }
    setAutenticado(false);
    setDados([]);
    setSenha("");
  }

  const dadosFiltrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return dados;
    const qDigitos = q.replace(/\D/g, "");
    return dados.filter(
      (a) =>
        a.nome.toLowerCase().includes(q) ||
        a.veiculo.toLowerCase().includes(q) ||
        (qDigitos && a.telefone.includes(qDigitos)),
    );
  }, [dados, busca]);

  const total = dados.length;
  const restantes = Math.max(0, TOTAL_VAGAS - total);
  const ocupacaoPct = Math.round((total / TOTAL_VAGAS) * 100);
  const esgotados = HORARIOS.filter(
    (h) => dados.filter((a) => a.horario === h).length >= CAPACIDADE,
  ).length;
  const confEnviadas = dados.filter((a) => a.confirmacao_enviada).length;
  const env24h = dados.filter((a) => a.lembrete_24h_enviado).length;
  const env1h = dados.filter((a) => a.lembrete_1h_enviado).length;

  function exportarCsv() {
    const cab = [
      "Nome", "Telefone", "WhatsApp", "Veículo", "Ano", "KM", "Data", "Horário",
      "Agendado em", "Confirmação", "Lembrete 24h", "Lembrete 1h",
    ];
    const simNao = (v: boolean) => (v ? "Sim" : "Não");
    const linhas = dados.map((a) => [
      a.nome,
      a.telefone,
      `https://wa.me/${a.telefone.replace(/\D/g, "")}`,
      a.veiculo,
      a.ano ?? "",
      a.km ?? "",
      a.data,
      a.horario,
      a.criado_em,
      simNao(a.confirmacao_enviada),
      simNao(a.lembrete_24h_enviado),
      simNao(a.lembrete_1h_enviado),
    ]);
    const esc = (c: string) => `"${String(c).replace(/"/g, '""')}"`;
    const csv = [cab, ...linhas].map((l) => l.map(esc).join(";")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    baixar(blob, `parada-certa-agendamentos-${DATA_ACAO}.csv`);
  }

  async function copiarTelefones() {
    const tels = dadosFiltrados.map((a) => a.telefone).join("\n");
    try {
      await navigator.clipboard.writeText(tels);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* clipboard indisponível */
    }
  }

  /* ─── Login ────────────────────────────────────────────────── */
  if (!autenticado) {
    function handleLogin(e: FormEvent) {
      e.preventDefault();
      if (senha.trim()) buscar(senha.trim());
    }
    return (
      <main className="min-h-dvh bg-[#dce2e9] flex flex-col">
        <Header />
        <section className="flex-1 flex items-center justify-center px-5 py-10">
          <form
            onSubmit={handleLogin}
            className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-7 shadow-[0_14px_44px_-16px_rgba(20,40,70,0.28)]"
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ backgroundImage: GRAD }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white">
                <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
            <h1 className="mt-4 font-[family-name:var(--font-basement)] text-xl font-extrabold uppercase text-carbo-grafite">
              Painel administrativo
            </h1>
            <p className="mt-1 text-sm text-carbo-grafite/55">
              Agendamentos da Ação Parada Certa.
            </p>

            <label
              htmlFor="senha"
              className="mt-6 block text-xs font-semibold uppercase tracking-wide text-carbo-grafite/60"
            >
              Senha de acesso
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-[15px] text-carbo-grafite focus:border-carbo-azul focus:outline-none focus:ring-2 focus:ring-carbo-azul/15"
            />

            {erro && <p className="mt-3 text-sm font-medium text-red-600">{erro}</p>}

            <button
              type="submit"
              disabled={carregando}
              style={{ backgroundImage: GRAD }}
              className="mt-5 w-full rounded-xl py-3.5 font-[family-name:var(--font-basement)] text-sm font-extrabold uppercase tracking-wide text-white transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
            >
              {carregando ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  /* ─── Painel ───────────────────────────────────────────────── */
  const porHorario = HORARIOS.map((h) => ({
    horario: h,
    todos: dados.filter((a) => a.horario === h),
    itens: dadosFiltrados.filter((a) => a.horario === h),
  }));
  const geradoEm = new Date().toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="pc-admin min-h-dvh bg-[#dce2e9] flex flex-col print:bg-white">
      <Header />

      <section className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-5">
        {/* Cabeçalho só do PDF/impressão */}
        <div className="pc-print-only mb-5 hidden border-b border-gray-200 pb-4">
          <p className="text-lg font-bold text-carbo-grafite">
            Ação Parada Certa — Agendamentos
          </p>
          <p className="text-sm text-carbo-grafite/70">
            {DATA_LABEL} · {LOCAL_TITULO}
          </p>
          <p className="mt-1 text-xs text-carbo-grafite/50">
            {total} agendamento{total === 1 ? "" : "s"} · gerado em {geradoEm}
          </p>
        </div>

        {/* Cabeçalho + ações */}
        <div className="pc-no-print flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-[family-name:var(--font-basement)] text-2xl font-extrabold uppercase text-carbo-grafite">
              Agendamentos
            </h1>
            <p className="mt-0.5 text-sm text-carbo-grafite/55">{DATA_LABEL}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <BotaoAcao onClick={() => buscar(senha)} disabled={carregando}>
              {carregando ? "Atualizando…" : "Atualizar"}
            </BotaoAcao>
            <BotaoAcao onClick={exportarCsv} disabled={total === 0}>
              CSV
            </BotaoAcao>
            <BotaoAcao onClick={() => window.print()} disabled={total === 0}>
              PDF / Imprimir
            </BotaoAcao>
            <button
              onClick={sair}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-carbo-grafite/50 transition hover:text-carbo-grafite"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Cartões de resumo */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Tile rotulo="Agendamentos" valor={String(total)} />
          <Tile rotulo="Vagas restantes" valor={String(restantes)} sub={`de ${TOTAL_VAGAS}`} />
          <Tile rotulo="Ocupação" valor={`${ocupacaoPct}%`} cor="#2b7fe4" />
          <Tile
            rotulo="Horários esgotados"
            valor={`${esgotados}/${HORARIOS.length}`}
            cor={esgotados > 0 ? "#dc2626" : undefined}
          />
        </div>

        {/* Barra de ocupação */}
        <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-carbo-grafite/60">
            <span>Ocupação geral</span>
            <span>{total}/{TOTAL_VAGAS} vagas</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${ocupacaoPct}%`, backgroundImage: GRAD }}
            />
          </div>
        </div>

        {/* Disparos de WhatsApp */}
        <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-carbo-grafite/60">
            Mensagens enviadas
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            {[
              { rot: "Confirmação", n: confEnviadas },
              { rot: "Lembrete 24h", n: env24h },
              { rot: "Lembrete 1h", n: env1h },
            ].map(({ rot, n }) => (
              <div key={rot} className="rounded-lg bg-carbo-fundo/60 py-2">
                <p className="font-[family-name:var(--font-basement)] text-xl font-extrabold text-carbo-verde">
                  {n}
                </p>
                <p className="text-[11px] text-carbo-grafite/55">
                  {rot}
                  <span className="text-carbo-grafite/35"> / {total}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Ocupação por horário */}
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {porHorario.map(({ horario, todos }) => {
            const cheio = todos.length >= CAPACIDADE;
            return (
              <div
                key={horario}
                className={`rounded-lg border px-1 py-2 text-center ${
                  cheio ? "border-red-200 bg-red-50" : "border-gray-100 bg-white"
                }`}
              >
                <p className="font-[family-name:var(--font-basement)] text-sm font-bold text-carbo-grafite">
                  {horario}
                </p>
                <p className={`text-[11px] font-semibold ${cheio ? "text-red-600" : "text-carbo-verde"}`}>
                  {todos.length}/{CAPACIDADE}
                </p>
              </div>
            );
          })}
        </div>

        {/* Busca + copiar telefones */}
        <div className="pc-no-print mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, telefone ou veículo"
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-carbo-grafite focus:border-carbo-azul focus:outline-none focus:ring-2 focus:ring-carbo-azul/15"
            />
          </div>
          <button
            onClick={copiarTelefones}
            disabled={dadosFiltrados.length === 0}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-carbo-grafite transition hover:border-carbo-verde disabled:opacity-40"
          >
            {copiado ? "Copiado!" : "Copiar telefones"}
          </button>
        </div>

        {/* Lista por horário */}
        <div className="mt-5 flex flex-col gap-5 pb-10">
          {total === 0 ? (
            <p className="rounded-xl border border-gray-100 bg-white p-6 text-center text-sm text-carbo-grafite/60">
              Nenhum agendamento ainda.
            </p>
          ) : dadosFiltrados.length === 0 ? (
            <p className="rounded-xl border border-gray-100 bg-white p-6 text-center text-sm text-carbo-grafite/60">
              Nenhum resultado para “{busca}”.
            </p>
          ) : (
            porHorario
              .filter((g) => g.itens.length > 0)
              .map(({ horario, itens, todos }) => (
                <div key={horario} className="pc-card">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-4 w-1.5 rounded-full" style={{ backgroundImage: GRAD }} />
                    <span className="font-[family-name:var(--font-basement)] text-base font-bold text-carbo-grafite">
                      {horario}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-carbo-grafite/45">
                      {todos.length}/{CAPACIDADE} vaga{todos.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_8px_30px_-16px_rgba(20,40,70,0.25)]">
                    {itens.map((a, i) => (
                      <div
                        key={a.telefone + i}
                        className={`flex items-start justify-between gap-3 px-4 py-3 ${
                          i > 0 ? "border-t border-gray-100" : ""
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-carbo-grafite">{a.nome}</p>
                          <p className="mt-0.5 truncate text-[13px] text-carbo-grafite/60">
                            {a.veiculo}
                            {a.ano ? ` · ${a.ano}` : ""}
                            {a.km ? ` · ${a.km} km` : ""}
                          </p>
                          <p className="mt-0.5 text-[13px] font-medium text-carbo-grafite/80">
                            {formatarTelefone(a.telefone)}
                          </p>
                          <p className="mt-0.5 text-[11px] text-carbo-grafite/40">
                            Agendado em {a.criado_em}
                          </p>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            <ChipStatus label="Confirmação" ok={a.confirmacao_enviada} />
                            <ChipStatus label="24h" ok={a.lembrete_24h_enviado} />
                            <ChipStatus label="1h" ok={a.lembrete_1h_enviado} />
                          </div>
                        </div>
                        <a
                          href={`https://wa.me/${a.telefone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pc-no-print flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-carbo-grafite transition hover:border-carbo-verde hover:text-carbo-verde"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                            <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1112 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.7.9-.3.2-.5.1a6.5 6.5 0 01-1.9-1.2 7.3 7.3 0 01-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4c0-.1-.5-1.3-.7-1.8s-.4-.4-.5-.4h-.5a1 1 0 00-.7.3A2.9 2.9 0 007 9.3c0 1.7 1.3 3.4 1.5 3.6s2.5 3.8 6 5c.8.3 1.5.5 2 .7.8.2 1.6.2 2.2.1.7-.1 1.4-.6 1.6-1.1a2 2 0 00.1-1.1c0-.2-.2-.3-.4-.4z" />
                          </svg>
                          WhatsApp
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      </section>
    </main>
  );
}

function Tile({
  rotulo,
  valor,
  sub,
  cor,
}: {
  rotulo: string;
  valor: string;
  sub?: string;
  cor?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_8px_30px_-18px_rgba(20,40,70,0.25)]">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-carbo-grafite/50">
        {rotulo}
      </p>
      <p
        className="mt-1 font-[family-name:var(--font-basement)] text-2xl font-extrabold text-carbo-grafite"
        style={cor ? { color: cor } : undefined}
      >
        {valor}
      </p>
      {sub && <p className="text-xs text-carbo-grafite/45">{sub}</p>}
    </div>
  );
}

function ChipStatus({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
        ok ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-400"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-green-500" : "bg-gray-300"}`} />
      {label}
    </span>
  );
}

function BotaoAcao({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-carbo-grafite transition hover:border-carbo-azul disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function Header() {
  return (
    <header className="w-full border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-center px-5 py-4">
        <Image
          src="/grupocarbo-logo.png"
          alt="Grupo Carbo"
          width={863}
          height={93}
          priority
          className="h-7 w-auto"
        />
      </div>
    </header>
  );
}
