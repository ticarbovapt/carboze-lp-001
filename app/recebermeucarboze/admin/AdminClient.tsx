"use client";

import { useState, useEffect, useCallback, useMemo, FormEvent } from "react";
import { callRpc } from "@/lib/supabase";
import LovableHeader from "@/components/LovableHeader";
import LeitorQR from "./LeitorQR";

const CHAVE_SESSAO = "rc_admin_senha";

type Cadastro = {
  id: string;
  nome: string;
  telefone: string;
  modelo_moto: string;
  instagram: string | null;
  autoriza_imagem: boolean;
  vale_combustivel: boolean;
  codigo: string | null;
  retirado: boolean;
  retirado_em: string | null;
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

function emitirCsv(cab: string[], linhas: string[][], arquivo: string) {
  const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [cab, ...linhas].map((l) => l.map(esc).join(";")).join("\n");
  baixar(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" }), arquivo);
}

async function emitirPdf(
  titulo: string,
  subtitulo: string,
  cab: string[],
  linhas: string[][],
  arquivo: string,
  paisagem = false,
) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const doc = new jsPDF({ orientation: paisagem ? "landscape" : "portrait" });
  doc.setFontSize(14);
  doc.text(titulo, 14, 16);
  if (subtitulo) {
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(subtitulo, 14, 22);
  }
  autoTable(doc, {
    head: [cab],
    body: linhas,
    startY: subtitulo ? 27 : 20,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [9, 58, 48] },
  });
  doc.save(arquivo);
}

export default function AdminClient() {
  const [senha, setSenha] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  const [dados, setDados] = useState<Cadastro[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [codigoValidar, setCodigoValidar] = useState("");
  const [scannerAberto, setScannerAberto] = useState(false);

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

  // Atualização ao vivo: refaz a busca a cada 10s (silencioso, sem piscar)
  // e quando a aba volta ao foco.
  const refrescarSilencioso = useCallback(async () => {
    try {
      const r = await callRpc<AdminResp>("teste_carboze_admin", { p_senha: senha });
      if (r?.ok) setDados(r.cadastros ?? []);
    } catch {
      /* silencioso */
    }
  }, [senha]);

  useEffect(() => {
    if (!autenticado) return;
    const id = setInterval(() => {
      if (!document.hidden) refrescarSilencioso();
    }, 10000);
    const aoVoltar = () => {
      if (!document.hidden) refrescarSilencioso();
    };
    document.addEventListener("visibilitychange", aoVoltar);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", aoVoltar);
    };
  }, [autenticado, refrescarSilencioso]);

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
        (c.instagram ?? "").toLowerCase().includes(q) ||
        (qDigitos && c.telefone.includes(qDigitos)),
    );
  }, [dados, busca]);

  function dadosGeral() {
    const cab = ["Nome", "Telefone", "WhatsApp", "Modelo da moto", "Instagram", "Autoriza imagem", "Vale combustível", "Código", "Retirado", "Cadastrado em"];
    const linhas = dados.map((c) => [
      c.nome,
      c.telefone,
      `https://wa.me/${c.telefone.replace(/\D/g, "")}`,
      c.modelo_moto,
      c.instagram ?? "",
      c.autoriza_imagem ? "Sim" : "Não",
      c.vale_combustivel ? "Sim" : "Não",
      c.codigo ?? "",
      c.retirado ? "Sim" : "Não",
      c.criado_em,
    ]);
    return { cab, linhas };
  }

  function exportarGeral(formato: "csv" | "pdf") {
    const { cab, linhas } = dadosGeral();
    if (formato === "pdf") {
      emitirPdf(
        "Cadastros — Receba meu CarboZé",
        `${dados.length} cadastro${dados.length === 1 ? "" : "s"}`,
        cab,
        linhas,
        "teste-carboze-cadastros.pdf",
        true,
      );
    } else {
      emitirCsv(cab, linhas, "teste-carboze-cadastros.csv");
    }
  }

  async function marcarVale(c: Cadastro, vale: boolean) {
    try {
      const resp = await fetch("/api/recebermeucarboze/vale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, vale, senha }),
      });
      const r = (await resp.json()) as { ok?: boolean; erro?: string };
      if (r?.ok) {
        buscar(senha);
      } else if (r?.erro === "sem_codigos") {
        window.alert("Acabaram os 40 códigos de vale — nenhum código disponível.");
      } else {
        window.alert("Não foi possível atualizar agora. Tente novamente.");
      }
    } catch {
      window.alert("Não foi possível atualizar agora. Tente novamente.");
    }
  }

  async function marcarRetirado(c: Cadastro, retirado: boolean) {
    try {
      await callRpc("teste_carboze_marcar_retirado", {
        p_id: c.id,
        p_retirado: retirado,
        p_senha: senha,
      });
      buscar(senha);
    } catch {
      window.alert("Não foi possível atualizar agora. Tente novamente.");
    }
  }

  function dadosVale() {
    const ganhadores = dados.filter((c) => c.vale_combustivel);
    const cab = ["Nome", "Telefone", "Modelo da moto", "Código", "Retirado", "Retirado em"];
    const linhas = ganhadores.map((c) => [
      c.nome,
      formatarTelefone(c.telefone),
      c.modelo_moto,
      c.codigo ?? "",
      c.retirado ? "Sim" : "Não",
      c.retirado_em ?? "",
    ]);
    return { cab, linhas };
  }

  function exportarVale(formato: "csv" | "pdf") {
    const { cab, linhas } = dadosVale();
    if (formato === "pdf") {
      emitirPdf(
        "Vale-combustível — Posto RCM Nova Parnamirim",
        `Ação Parada Certa · ${linhas.length} vale${linhas.length === 1 ? "" : "s"}`,
        cab,
        linhas,
        "vale-combustivel-posto.pdf",
      );
    } else {
      emitirCsv(cab, linhas, "vale-combustivel-posto.csv");
    }
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
  const achado = codigoValidar.trim()
    ? dados.find(
        (c) => (c.codigo ?? "").toUpperCase() === codigoValidar.trim().toUpperCase(),
      )
    : undefined;

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
            <p className="mt-0.5 flex items-center gap-2 font-[family-name:var(--font-archivo)] text-sm text-white/60">
              <span className="relative flex h-1.5 w-1.5" title="Atualiza ao vivo">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-limao opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-limao" />
              </span>
              {dados.length} cadastro{dados.length === 1 ? "" : "s"} · {ganharamVale} com vale-combustível
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <BotaoAcao onClick={() => buscar(senha)} disabled={carregando}>
              {carregando ? "Atualizando…" : "Atualizar"}
            </BotaoAcao>
            <ExportMenu label="Exportar" onFormato={exportarGeral} disabled={dados.length === 0} />
            <ExportMenu label="Vale (posto)" onFormato={exportarVale} disabled={ganharamVale === 0} />
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

        {/* Validar voucher */}
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="font-[family-name:var(--font-basement)] text-sm font-bold uppercase text-white">
            Validar voucher
          </p>
          <p className="mt-0.5 font-[family-name:var(--font-archivo)] text-[12px] text-white/50">
            Digite o código do voucher para conferir e dar baixa na retirada.
          </p>
          <div className="mt-3 flex gap-2">
            <input
              value={codigoValidar}
              onChange={(e) => setCodigoValidar(e.target.value.toUpperCase().slice(0, 12))}
              placeholder="Ex.: 1DEC8A36"
              className={`flex-1 uppercase ${inputClass}`}
            />
            <button
              type="button"
              onClick={() => setScannerAberto(true)}
              className="shrink-0 rounded-xl border border-limao/40 bg-limao/10 px-4 font-[family-name:var(--font-archivo)] text-sm font-semibold text-limao transition hover:bg-limao/20"
            >
              📷 Ler QR
            </button>
          </div>
          {codigoValidar.trim() && (
            achado ? (
              <div className="mt-3 rounded-lg border border-limao/40 bg-limao/10 p-3">
                <p className="font-[family-name:var(--font-archivo)] font-semibold text-white">
                  {achado.nome}
                </p>
                <p className="font-[family-name:var(--font-archivo)] text-[13px] text-white/70">
                  🏍️ {achado.modelo_moto}
                </p>
                <p className="mt-1 font-[family-name:var(--font-archivo)] text-[12px] text-white/60">
                  {achado.retirado
                    ? `✅ Já retirado${achado.retirado_em ? ` em ${achado.retirado_em}` : ""}`
                    : "Ainda não retirado."}
                </p>
                {!achado.retirado && (
                  <button
                    onClick={() => {
                      marcarRetirado(achado, true);
                      setCodigoValidar("");
                    }}
                    className="mt-2 rounded-lg bg-limao px-4 py-2 font-[family-name:var(--font-basement)] text-xs font-extrabold uppercase tracking-wide text-verde-escuro transition hover:brightness-110"
                  >
                    Confirmar retirada
                  </button>
                )}
              </div>
            ) : (
              <p className="mt-3 font-[family-name:var(--font-archivo)] text-sm text-red-400">
                Código não encontrado. Confira o voucher.
              </p>
            )
          )}
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
                  {c.vale_combustivel && c.codigo && (
                    <p className="mt-0.5 font-[family-name:var(--font-archivo)] text-[12px] font-semibold text-limao">
                      🎟️ {c.codigo}
                      {c.retirado ? " · retirado" : ""}
                    </p>
                  )}
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
                  {c.vale_combustivel && (
                    <button
                      onClick={() => marcarRetirado(c, !c.retirado)}
                      className={`rounded-lg px-3 py-1.5 font-[family-name:var(--font-archivo)] text-[11px] font-bold uppercase tracking-wide transition ${
                        c.retirado
                          ? "bg-white/10 text-white/50 hover:text-white"
                          : "border border-white/15 text-white/70 hover:border-limao hover:text-limao"
                      }`}
                    >
                      {c.retirado ? "✓ Retirado" : "Marcar retirado"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {scannerAberto && (
        <LeitorQR
          onLer={(t) => {
            setCodigoValidar(t.toUpperCase().slice(0, 12));
            setScannerAberto(false);
          }}
          onFechar={() => setScannerAberto(false)}
        />
      )}
    </main>
  );
}

function ExportMenu({
  label,
  onFormato,
  disabled,
}: {
  label: string;
  onFormato: (f: "csv" | "pdf") => void;
  disabled?: boolean;
}) {
  const [aberto, setAberto] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setAberto((v) => !v)}
        disabled={disabled}
        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 font-[family-name:var(--font-archivo)] text-sm font-semibold text-white transition hover:border-limao disabled:opacity-40"
      >
        {label} ▾
      </button>
      {aberto && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setAberto(false)} />
          <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-white/15 bg-verde-escuro shadow-xl">
            <button
              onClick={() => {
                onFormato("csv");
                setAberto(false);
              }}
              className="block w-full px-4 py-2.5 text-left font-[family-name:var(--font-archivo)] text-sm text-white transition hover:bg-white/10"
            >
              📊 Planilha (Excel)
            </button>
            <button
              onClick={() => {
                onFormato("pdf");
                setAberto(false);
              }}
              className="block w-full border-t border-white/10 px-4 py-2.5 text-left font-[family-name:var(--font-archivo)] text-sm text-white transition hover:bg-white/10"
            >
              📄 PDF
            </button>
          </div>
        </>
      )}
    </div>
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
