"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, FormEvent } from "react";
import { callRpc } from "@/lib/supabase";

const DATA_ACAO = "2026-10-31";
const HORARIOS = [
  "09:00", "09:25", "09:50", "10:15",
  "10:40", "11:05", "11:30", "11:55",
  "12:20", "12:45", "13:10", "13:35",
];
const CAPACIDADE = 2;
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

export default function AdminClient() {
  const [senha, setSenha] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  const [dados, setDados] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const buscar = useCallback(async (senhaUsada: string) => {
    setCarregando(true);
    setErro("");
    try {
      const r = await callRpc<AdminResp>("parada_certa_admin", {
        p_senha: senhaUsada,
      });
      if (r?.ok) {
        setDados(r.agendamentos ?? []);
        setAutenticado(true);
        try {
          sessionStorage.setItem(CHAVE_SESSAO, senhaUsada);
        } catch {
          /* sessionStorage indisponível — segue sem lembrar */
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

  function exportarCsv() {
    const cabecalho = ["Nome", "Telefone", "Veículo", "Ano", "KM", "Data", "Horário", "Agendado em"];
    const linhas = dados.map((a) => [
      a.nome, a.telefone, a.veiculo, a.ano ?? "", a.km ?? "", a.data, a.horario, a.criado_em,
    ]);
    const escapar = (c: string) => `"${String(c).replace(/"/g, '""')}"`;
    const csv = [cabecalho, ...linhas].map((l) => l.map(escapar).join(";")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `parada-certa-agendamentos-${DATA_ACAO}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
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
            <h1 className="font-[family-name:var(--font-basement)] text-xl font-extrabold uppercase text-carbo-grafite">
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
    itens: dados.filter((a) => a.horario === h),
  }));

  return (
    <main className="min-h-dvh bg-[#dce2e9] flex flex-col">
      <Header />

      <section className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-5">
        {/* Cabeçalho + ações */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-[family-name:var(--font-basement)] text-2xl font-extrabold uppercase text-carbo-grafite">
              Agendamentos
            </h1>
            <p className="mt-0.5 text-sm text-carbo-grafite/55">
              Ação Parada Certa · 31/10 · {dados.length} agendamento
              {dados.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => buscar(senha)}
              disabled={carregando}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-carbo-grafite transition hover:border-carbo-azul disabled:opacity-60"
            >
              {carregando ? "Atualizando…" : "Atualizar"}
            </button>
            <button
              onClick={exportarCsv}
              disabled={dados.length === 0}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-carbo-grafite transition hover:border-carbo-azul disabled:opacity-40"
            >
              Exportar CSV
            </button>
            <button
              onClick={sair}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-carbo-grafite/50 transition hover:text-carbo-grafite"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Resumo de ocupação */}
        <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {porHorario.map(({ horario, itens }) => {
            const cheio = itens.length >= CAPACIDADE;
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
                <p
                  className={`text-[11px] font-semibold ${
                    cheio ? "text-red-600" : "text-carbo-verde"
                  }`}
                >
                  {itens.length}/{CAPACIDADE}
                </p>
              </div>
            );
          })}
        </div>

        {/* Lista por horário */}
        <div className="mt-6 flex flex-col gap-5 pb-10">
          {dados.length === 0 ? (
            <p className="rounded-xl border border-gray-100 bg-white p-6 text-center text-sm text-carbo-grafite/60">
              Nenhum agendamento ainda.
            </p>
          ) : (
            porHorario
              .filter((g) => g.itens.length > 0)
              .map(({ horario, itens }) => (
                <div key={horario}>
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="rounded-md px-2 py-0.5 font-[family-name:var(--font-basement)] text-sm font-bold text-white"
                      style={{ backgroundImage: GRAD }}
                    >
                      {horario}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-carbo-grafite/45">
                      {itens.length}/{CAPACIDADE} vaga{itens.length > 1 ? "s" : ""}
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
                          <p className="truncate font-semibold text-carbo-grafite">
                            {a.nome}
                          </p>
                          <p className="mt-0.5 truncate text-[13px] text-carbo-grafite/60">
                            {a.veiculo}
                            {a.ano ? ` · ${a.ano}` : ""}
                            {a.km ? ` · ${a.km} km` : ""}
                          </p>
                          <p className="mt-0.5 text-[11px] text-carbo-grafite/40">
                            Agendado em {a.criado_em}
                          </p>
                        </div>
                        <a
                          href={`https://wa.me/${a.telefone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-carbo-grafite transition hover:border-carbo-verde hover:text-carbo-verde"
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

function Header() {
  return (
    <header className="w-full border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-2xl items-center justify-center px-5 py-4">
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
