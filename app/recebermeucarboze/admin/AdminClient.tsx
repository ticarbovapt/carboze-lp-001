"use client";

import { useState, useEffect, useCallback, useMemo, FormEvent } from "react";
import { callRpc } from "@/lib/supabase";
import LovableHeader from "@/components/LovableHeader";

const CHAVE_SESSAO = "rc_admin_senha";

type Cadastro = {
  id: string;
  nome: string;
  telefone: string;
  modelo_moto: string;
  placa: string | null;
  instagram: string | null;
  autoriza_imagem: boolean;
  vale_combustivel: boolean;
  criado_em: string;
};
type AdminResp = { ok: boolean; cadastros?: Cadastro[] };

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
  const [dados, setDados] = useState<Cadastro[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [copiado, setCopiado] = useState(false);

  const buscar = useCallback(async (senhaUsada: string) => {
    setCarregando(true);
    setErro("");
    try {
      const r = await callRpc<AdminResp>("teste_carboze_admin", { p_senha: senhaUsada });
      if (r?.ok) {
        setDados(r.cadastros ?? []);
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
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        c.modelo_moto.toLowerCase().includes(q) ||
        (c.placa ?? "").toLowerCase().includes(q) ||
        (c.instagram ?? "").toLowerCase().includes(q) ||
        (qDigitos && c.telefone.includes(qDigitos)),
    );
  }, [dados, busca]);

  function exportarCsv() {
    const cab = ["Nome", "Telefone", "WhatsApp", "Modelo da moto", "Placa", "Instagram", "Autoriza imagem", "Vale combustível", "Cadastrado em"];
    const linhas = dados.map((c) => [
      c.nome,
      c.telefone,
      `https://wa.me/${c.telefone.replace(/\D/g, "")}`,
      c.modelo_moto,
      c.placa ?? "",
      c.instagram ?? "",
      c.autoriza_imagem ? "Sim" : "Não",
      c.vale_combustivel ? "Sim" : "Não",
      c.criado_em,
    ]);
    const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [cab, ...linhas].map((l) => l.map(esc).join(";")).join("\n");
    baixar(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" }), "teste-carboze-cadastros.csv");
  }

  async function marcarVale(c: Cadastro, vale: boolean) {
    try {
      await callRpc("teste_carboze_vale", { p_id: c.id, p_vale: vale, p_senha: senha });
      buscar(senha);
    } catch {
      window.alert("Não foi possível atualizar agora. Tente novamente.");
    }
  }

  function exportarVale() {
    const ganhadores = dados.filter((c) => c.vale_combustivel);
    const cab = ["Nome", "Telefone", "Placa", "Modelo da moto"];
    const linhas = ganhadores.map((c) => [
      c.nome,
      formatarTelefone(c.telefone),
      c.placa ?? "",
      c.modelo_moto,
    ]);
    const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [cab, ...linhas].map((l) => l.map(esc).join(";")).join("\n");
    baixar(
      new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" }),
      "vale-combustivel-posto.csv",
    );
  }

  async function copiarTelefones() {
    const tels = dadosFiltrados.map((c) => c.telefone).join("\n");
    try {
      await navigator.clipboard.writeText(tels);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* clipboard indisponível */
    }
  }

  const inputClass =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 font-[family-name:var(--font-archivo)] text-sm focus:outline-none focus:border-limao focus:bg-white/8 transition-all";

  /* ─── Login ────────────────────────────────────────────────── */
  if (!autenticado) {
    function handleLogin(e: FormEvent) {
      e.preventDefault();
      if (senha.trim()) buscar(senha.trim());
    }
    return (
      <main className="flex min-h-dvh flex-col bg-verde-escuro">
        <LovableHeader hideNav />
        <div className="flex flex-1 items-center justify-center px-5 py-10">
          <form onSubmit={handleLogin} className="w-full max-w-sm">
            <h1 className="font-[family-name:var(--font-basement)] text-xl font-extrabold uppercase text-white">
              Painel — Receba seu CarboZé
            </h1>
            <p className="mt-1 font-[family-name:var(--font-archivo)] text-sm text-white/60">
              Cadastros da ação de testes.
            </p>
            <label className="mt-6 block font-[family-name:var(--font-archivo)] text-xs uppercase tracking-widest text-white/60">
              Senha de acesso
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className={`mt-1.5 ${inputClass}`}
            />
            {erro && <p className="mt-3 text-sm font-medium text-red-400">{erro}</p>}
            <button
              type="submit"
              disabled={carregando}
              className="mt-5 w-full rounded-xl bg-limao py-3.5 font-[family-name:var(--font-basement)] text-sm font-extrabold uppercase tracking-wide text-verde-escuro transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
            >
              {carregando ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  /* ─── Painel ───────────────────────────────────────────────── */
  const ganharamVale = dados.filter((c) => c.vale_combustivel).length;

  return (
    <main className="flex min-h-dvh flex-col bg-verde-escuro">
      <LovableHeader hideNav />

      <section className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-5">
        {/* Cabeçalho + ações */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-[family-name:var(--font-basement)] text-2xl font-extrabold uppercase text-white">
              Cadastros
            </h1>
            <p className="mt-0.5 font-[family-name:var(--font-archivo)] text-sm text-white/60">
              {dados.length} cadastro{dados.length === 1 ? "" : "s"} · {ganharamVale} com vale-combustível
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <BotaoAcao onClick={() => buscar(senha)} disabled={carregando}>
              {carregando ? "Atualizando…" : "Atualizar"}
            </BotaoAcao>
            <BotaoAcao onClick={exportarCsv} disabled={dados.length === 0}>
              CSV
            </BotaoAcao>
            <BotaoAcao onClick={exportarVale} disabled={ganharamVale === 0}>
              Vale (posto)
            </BotaoAcao>
            <button
              onClick={sair}
              className="rounded-lg px-3 py-2 font-[family-name:var(--font-archivo)] text-sm font-semibold text-white/50 transition hover:text-white"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Busca + copiar telefones */}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, telefone, moto ou @"
            className={`flex-1 ${inputClass}`}
          />
          <button
            onClick={copiarTelefones}
            disabled={dadosFiltrados.length === 0}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-[family-name:var(--font-archivo)] text-sm font-semibold text-white transition hover:border-limao disabled:opacity-40"
          >
            {copiado ? "Copiado!" : "Copiar telefones"}
          </button>
        </div>

        {/* Lista */}
        <div className="mt-5 flex flex-col gap-2.5 pb-10">
          {dados.length === 0 ? (
            <p className="rounded-xl border border-white/10 bg-white/5 p-6 text-center font-[family-name:var(--font-archivo)] text-sm text-white/60">
              Nenhum cadastro ainda.
            </p>
          ) : dadosFiltrados.length === 0 ? (
            <p className="rounded-xl border border-white/10 bg-white/5 p-6 text-center font-[family-name:var(--font-archivo)] text-sm text-white/60">
              Nenhum resultado para “{busca}”.
            </p>
          ) : (
            dadosFiltrados.map((c) => (
              <div
                key={c.id}
                className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 ${
                  c.vale_combustivel
                    ? "border-limao/60 bg-limao/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate font-[family-name:var(--font-archivo)] font-semibold text-white">
                    {c.nome}
                  </p>
                  <p className="mt-0.5 truncate font-[family-name:var(--font-archivo)] text-[13px] text-white/60">
                    🏍️ {c.modelo_moto}
                    {c.placa ? ` · ${c.placa}` : ""}
                  </p>
                  <p className="mt-0.5 font-[family-name:var(--font-archivo)] text-[13px] text-white/80">
                    {formatarTelefone(c.telefone)}
                  </p>
                  {c.instagram && (
                    <a
                      href={`https://instagram.com/${c.instagram.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-block font-[family-name:var(--font-archivo)] text-[13px] text-limao hover:underline"
                    >
                      {c.instagram.startsWith("@") ? c.instagram : `@${c.instagram}`}
                    </a>
                  )}
                  <p className="mt-0.5 font-[family-name:var(--font-archivo)] text-[11px] text-white/35">
                    {c.criado_em}
                    {c.autoriza_imagem ? " · autoriza imagem" : " · NÃO autoriza"}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <a
                    href={`https://wa.me/${c.telefone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 font-[family-name:var(--font-archivo)] text-xs font-semibold text-white transition hover:border-limao hover:text-limao"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1112 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.7.9-.3.2-.5.1a6.5 6.5 0 01-1.9-1.2 7.3 7.3 0 01-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4c0-.1-.5-1.3-.7-1.8s-.4-.4-.5-.4h-.5a1 1 0 00-.7.3A2.9 2.9 0 007 9.3c0 1.7 1.3 3.4 1.5 3.6s2.5 3.8 6 5c.8.3 1.5.5 2 .7.8.2 1.6.2 2.2.1.7-.1 1.4-.6 1.6-1.1a2 2 0 00.1-1.1c0-.2-.2-.3-.4-.4z" />
                    </svg>
                    WhatsApp
                  </a>
                  <button
                    onClick={() => marcarVale(c, !c.vale_combustivel)}
                    className={`rounded-lg px-3 py-1.5 font-[family-name:var(--font-archivo)] text-[11px] font-bold uppercase tracking-wide transition ${
                      c.vale_combustivel
                        ? "bg-limao text-verde-escuro hover:brightness-110"
                        : "border border-white/15 text-white/70 hover:border-limao hover:text-limao"
                    }`}
                  >
                    {c.vale_combustivel ? "✓ Ganhou vale" : "Dar vale"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
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
      className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 font-[family-name:var(--font-archivo)] text-sm font-semibold text-white transition hover:border-limao disabled:opacity-40"
    >
      {children}
    </button>
  );
}
