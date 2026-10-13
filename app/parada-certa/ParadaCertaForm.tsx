"use client";

import Image from "next/image";
import {
  useState,
  useEffect,
  useCallback,
  FormEvent,
} from "react";
import { callRpc } from "@/lib/supabase";

/* ─── Configuração da ação ───────────────────────────────────
   Data e local do evento. Para reaproveitar a página numa próxima
   edição, basta alterar estas constantes. */
const DATA_ACAO = "2026-10-31"; // AAAA-MM-DD
const LOCAL_TITULO = "Container Parada Certa";
const LOCAL_ENDERECO = "Marginal Arena das Dunas — Lagoa Nova, Natal/RN";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Marginal Arena das Dunas, Lagoa Nova, Natal - RN, 59075-000");

const HORARIOS = [
  "09:00", "09:25", "09:50", "10:15",
  "10:40", "11:05", "11:30", "11:55",
  "12:20", "12:45", "13:10", "13:35",
];
const CAPACIDADE = 2; // atendimentos simultâneos por horário (25 min cada, 9h–14h)

const GRAD = "linear-gradient(100deg, #2b7fe4, #1fae4d)";

const ANOS = Array.from({ length: 2027 - 1990 + 1 }, (_, i) => 2027 - i);

/* ─── Helpers ────────────────────────────────────────────────── */
function capitalizar(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const dataObj = new Date(`${DATA_ACAO}T12:00:00-03:00`);
const DATA_EXTENSO = capitalizar(
  dataObj.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }),
);
const DATA_CURTA = dataObj.toLocaleDateString("pt-BR", {
  day: "2-digit",
  month: "2-digit",
});

function mascararCelular(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function mensagemErro(codigo?: string) {
  switch (codigo) {
    case "cheio":
      return "Esse horário acabou de lotar. Escolha outro, por favor.";
    case "duplicado":
      return "Já existe um agendamento com esse celular para esta data.";
    case "telefone":
      return "Informe um celular válido com DDD.";
    case "nome":
      return "Informe seu nome completo.";
    case "veiculo":
      return "Informe o modelo do veículo.";
    case "horario_invalido":
      return "Horário inválido. Escolha um dos horários disponíveis.";
    default:
      return "Não foi possível concluir. Verifique os dados e tente novamente.";
  }
}

type AgendarResp = { ok: boolean; erro?: string };
type Disponibilidade = { horario: string; ocupadas: number };

/* ─── UI auxiliar ────────────────────────────────────────────── */
const inputClass =
  "w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-carbo-grafite placeholder-gray-400 text-[15px] focus:outline-none focus:border-carbo-azul focus:ring-2 focus:ring-carbo-azul/15 transition";

function Campo({
  htmlFor,
  label,
  children,
}: {
  htmlFor?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-carbo-grafite/60 text-xs font-semibold uppercase tracking-wide"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function SecaoTitulo({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
        style={{ backgroundImage: GRAD }}
      >
        {n}
      </span>
      <h2 className="font-[family-name:var(--font-basement)] text-carbo-grafite text-lg font-bold">
        {children}
      </h2>
    </div>
  );
}

/* ─── Página ─────────────────────────────────────────────────── */
export default function ParadaCertaForm() {
  const [nome, setNome] = useState("");
  const [celular, setCelular] = useState("");
  const [veiculo, setVeiculo] = useState("");
  const [ano, setAno] = useState("");
  const [km, setKm] = useState("");
  const [horario, setHorario] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [ocupacao, setOcupacao] = useState<Record<string, number>>({});
  const [carregando, setCarregando] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [erro, setErro] = useState("");
  const [confirmado, setConfirmado] = useState<{
    nome: string;
    veiculo: string;
    horario: string;
  } | null>(null);

  const carregarDisponibilidade = useCallback(async () => {
    try {
      const rows = await callRpc<Disponibilidade[]>(
        "parada_certa_disponibilidade",
        { p_data: DATA_ACAO },
      );
      const mapa: Record<string, number> = {};
      for (const r of rows) mapa[r.horario] = r.ocupadas;
      setOcupacao(mapa);
    } catch {
      // Silencioso: se a leitura falhar, os horários aparecem como
      // disponíveis e a validação final acontece no servidor.
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDisponibilidade();
  }, [carregarDisponibilidade]);

  const vagas = (h: string) => CAPACIDADE - (ocupacao[h] ?? 0);
  const tudoLotado = HORARIOS.every((h) => vagas(h) <= 0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");

    if (honeypot) {
      // Campo-isca preenchido: provável bot. Encerra sem gravar.
      setConfirmado({ nome, veiculo, horario });
      setStatus("success");
      return;
    }

    const digits = celular.replace(/\D/g, "");
    if (nome.trim().length < 3) return setErro("Informe seu nome completo.");
    if (digits.length < 10 || digits.length > 11)
      return setErro("Informe um celular válido com DDD.");
    if (!veiculo.trim()) return setErro("Informe o modelo do veículo.");
    if (!ano) return setErro("Selecione o ano do veículo.");
    if (!km.trim()) return setErro("Informe a quilometragem atual.");
    if (!horario) return setErro("Escolha um horário disponível.");

    setStatus("loading");
    try {
      const r = await callRpc<AgendarResp>("parada_certa_agendar", {
        p_nome: nome.trim(),
        p_telefone: "55" + digits,
        p_veiculo: veiculo.trim(),
        p_ano: ano,
        p_km: km.trim(),
        p_data: DATA_ACAO,
        p_horario: horario,
      });

      if (r?.ok) {
        setConfirmado({ nome: nome.trim(), veiculo: veiculo.trim(), horario });
        setStatus("success");
      } else {
        setStatus("idle");
        setErro(mensagemErro(r?.erro));
        if (r?.erro === "cheio") setHorario("");
        carregarDisponibilidade();
      }
    } catch {
      setStatus("idle");
      setErro("Não foi possível concluir agora. Tente novamente em instantes.");
    }
  }

  function novoAgendamento() {
    setNome("");
    setCelular("");
    setVeiculo("");
    setAno("");
    setKm("");
    setHorario("");
    setErro("");
    setConfirmado(null);
    setStatus("idle");
    carregarDisponibilidade();
  }

  async function baixarComprovante() {
    const c = confirmado;
    if (!c) return;
    const W = 620;
    const H = 900;
    const escala = 2;
    const canvas = document.createElement("canvas");
    canvas.width = W * escala;
    canvas.height = H * escala;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(escala, escala);
    try {
      await document.fonts.ready;
    } catch {
      /* segue com a fonte do sistema */
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    const grad = ctx.createLinearGradient(0, 0, W, 150);
    grad.addColorStop(0, "#2b7fe4");
    grad.addColorStop(1, "#1fae4d");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, 150);

    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 22px BasementGrotesque, Arial, sans-serif";
    ctx.fillText("GRUPO CARBO", 40, 58);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "600 13px Arial, sans-serif";
    ctx.fillText("COMPROVANTE DE AGENDAMENTO", 40, 82);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 16px Arial, sans-serif";
    ctx.fillText("Ação Parada Certa", 40, 112);

    ctx.beginPath();
    ctx.arc(W - 66, 75, 32, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(W - 80, 75);
    ctx.lineTo(W - 70, 86);
    ctx.lineTo(W - 52, 64);
    ctx.stroke();

    ctx.fillStyle = "#2d3338";
    ctx.font = "800 27px BasementGrotesque, Arial, sans-serif";
    ctx.fillText("AGENDAMENTO CONFIRMADO", 40, 210);

    let y = 262;
    const linha = (rotulo: string, valor: string, grande?: boolean) => {
      ctx.fillStyle = "#8a9099";
      ctx.font = "700 12px Arial, sans-serif";
      ctx.fillText(rotulo.toUpperCase(), 40, y);
      ctx.fillStyle = "#2d3338";
      ctx.font = grande
        ? "800 30px BasementGrotesque, Arial, sans-serif"
        : "600 18px Arial, sans-serif";
      ctx.fillText(valor, 40, y + (grande ? 34 : 26));
      y += grande ? 78 : 64;
      ctx.strokeStyle = "#eef1f3";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, y - 22);
      ctx.lineTo(W - 40, y - 22);
      ctx.stroke();
    };
    linha("Nome", c.nome);
    linha("Veículo", c.veiculo);
    linha("Data", DATA_EXTENSO);
    linha("Horário", c.horario, true);

    ctx.fillStyle = "#8a9099";
    ctx.font = "700 12px Arial, sans-serif";
    ctx.fillText("LOCAL", 40, y);
    ctx.fillStyle = "#2d3338";
    ctx.font = "600 16px Arial, sans-serif";
    desenharLinhas(ctx, `${LOCAL_TITULO} · ${LOCAL_ENDERECO}`, 40, y + 24, W - 80, 22);

    const by = H - 170;
    desenharRetanguloArredondado(ctx, 40, by, W - 80, 94, 12);
    ctx.fillStyle = "#fef2f2";
    ctx.fill();
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(40, by, 6, 94);
    ctx.fillStyle = "#b91c1c";
    ctx.font = "800 15px Arial, sans-serif";
    ctx.fillText("ATENÇÃO — CHEGUE 10 MIN ANTES", 64, by + 34);
    ctx.fillStyle = "#c0352f";
    ctx.font = "500 13px Arial, sans-serif";
    desenharLinhas(
      ctx,
      "Esse tempo é usado para a preparação do veículo antes do atendimento.",
      64,
      by + 58,
      W - 128,
      18,
    );

    ctx.fillStyle = "#9aa0a6";
    ctx.font = "400 11px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Apresente este comprovante no dia do atendimento.", W / 2, H - 44);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "parada-certa-agendamento.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  /* ─── Confirmação ──────────────────────────────────────────── */
  if (status === "success" && confirmado) {
    return (
      <main className="min-h-dvh bg-[#dce2e9] flex flex-col">
        <Header />
        <section className="flex-1 flex items-center justify-center px-5 py-10">
          <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-[0_14px_44px_-16px_rgba(20,40,70,0.28)] p-7 sm:p-8">
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundImage: GRAD }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-white">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className="mt-5 text-center font-[family-name:var(--font-basement)] text-2xl font-extrabold uppercase text-carbo-grafite">
              Agendamento confirmado
            </h1>
            <p className="mt-2 text-center text-sm text-carbo-grafite/60">
              Tudo certo, {confirmado.nome.split(" ")[0]}. Seu horário está reservado.
            </p>

            <div className="mt-6 divide-y divide-gray-100 rounded-xl border border-gray-100 bg-carbo-fundo/60">
              <Linha rotulo="Veículo" valor={confirmado.veiculo} />
              <Linha rotulo="Data" valor={`${DATA_EXTENSO}`} />
              <Linha rotulo="Horário" valor={`${confirmado.horario}`} forte />
              <Linha rotulo="Local" valor={`${LOCAL_TITULO} · ${LOCAL_ENDERECO}`} />
            </div>

            <AvisoChegada className="mt-5" />

            <p className="mt-4 text-center text-[13px] text-carbo-grafite/55">
              Você vai receber a confirmação e um lembrete pelo WhatsApp.
            </p>

            <p className="mt-5 text-center text-[13px] font-medium text-carbo-grafite/70">
              Baixe o comprovante ou tire um print desta tela para não esquecer.
            </p>

            <button
              type="button"
              onClick={baixarComprovante}
              style={{ backgroundImage: GRAD }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-[family-name:var(--font-basement)] text-sm font-extrabold uppercase tracking-wide text-white shadow-sm transition hover:brightness-105 active:scale-[0.99]"
            >
              <IconeDownload /> Baixar comprovante
            </button>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-carbo-grafite transition hover:border-carbo-azul hover:text-carbo-azul"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              Ver local no mapa
            </a>

            <button
              onClick={novoAgendamento}
              className="mt-4 w-full text-center text-sm font-semibold text-carbo-grafite/50 hover:text-carbo-grafite"
            >
              Agendar outro veículo
            </button>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  /* ─── Formulário ───────────────────────────────────────────── */
  return (
    <main className="min-h-dvh bg-[#dce2e9] flex flex-col">
      <Header />

      {/* Hero */}
      <section
        className="rounded-b-[2rem] px-5 pt-12 pb-20 text-center text-white"
        style={{ backgroundImage: "linear-gradient(135deg, #2b7fe4 0%, #1fae4d 100%)" }}
      >
        <span className="inline-block rounded-full bg-white/15 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white ring-1 ring-white/25">
          Agendamento gratuito
        </span>
        <h1 className="mx-auto mt-4 max-w-2xl font-[family-name:var(--font-basement)] text-4xl font-extrabold uppercase leading-[1.05] sm:text-5xl">
          Ação Parada Certa
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/85">
          Reserve seu horário para o check-up do seu veículo. O atendimento é
          individual e cada vaga tem tempo reservado só para você.
        </p>

        {/* Informações do evento */}
        <div className="mx-auto mt-6 flex max-w-md flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/90">
          <span className="inline-flex items-center gap-1.5">
            <IconeData /> {DATA_CURTA} · 9h às 14h
          </span>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-white hover:underline"
          >
            <IconeLocal /> {LOCAL_TITULO}
          </a>
        </div>
      </section>

      {/* Card do formulário */}
      <section className="-mt-12 px-5 pb-12">
        <form
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_14px_44px_-16px_rgba(20,40,70,0.28)] sm:p-7"
        >
          {/* 1 · Horário */}
          <SecaoTitulo n={1}>Escolha seu horário</SecaoTitulo>

          {carregando ? (
            <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {HORARIOS.map((h) => (
                <div key={h} className="h-16 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : tudoLotado ? (
            <p className="mt-4 rounded-xl border border-gray-100 bg-carbo-fundo p-4 text-center text-sm text-carbo-grafite/70">
              Todos os horários deste dia já foram preenchidos.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {HORARIOS.map((h) => {
                const v = vagas(h);
                const esgotado = v <= 0;
                const selecionado = horario === h;
                return (
                  <button
                    key={h}
                    type="button"
                    disabled={esgotado}
                    onClick={() => setHorario(h)}
                    style={selecionado ? { backgroundImage: GRAD } : undefined}
                    className={`flex flex-col items-center justify-center rounded-xl border py-2.5 transition ${
                      selecionado
                        ? "border-transparent text-white shadow-sm"
                        : esgotado
                          ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300"
                          : "border-gray-200 bg-white text-carbo-grafite hover:border-carbo-azul"
                    }`}
                  >
                    <span className="font-[family-name:var(--font-basement)] text-base font-bold">
                      {h}
                    </span>
                    <span
                      className={`mt-0.5 text-[10px] font-medium uppercase tracking-wide ${
                        selecionado
                          ? "text-white/80"
                          : esgotado
                            ? "text-gray-300"
                            : "text-carbo-verde"
                      }`}
                    >
                      {esgotado ? "Esgotado" : `${v} vaga${v > 1 ? "s" : ""}`}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 2 · Dados */}
          <div className="mt-8">
            <SecaoTitulo n={2}>Seus dados</SecaoTitulo>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            <Campo htmlFor="nome" label="Nome completo">
              <input
                id="nome"
                type="text"
                autoComplete="name"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome e sobrenome"
                className={inputClass}
              />
            </Campo>

            <Campo htmlFor="celular" label="Celular / WhatsApp">
              <input
                id="celular"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={celular}
                onChange={(e) => setCelular(mascararCelular(e.target.value))}
                placeholder="(84) 99999-9999"
                className={inputClass}
              />
            </Campo>

            <Campo htmlFor="veiculo" label="Carro / modelo">
              <input
                id="veiculo"
                type="text"
                value={veiculo}
                onChange={(e) => setVeiculo(e.target.value)}
                placeholder="Ex.: Fiat Argo, Honda Civic…"
                className={inputClass}
              />
            </Campo>

            <div className="grid grid-cols-2 gap-3">
              <Campo htmlFor="ano" label="Ano">
                <div className="relative">
                  <select
                    id="ano"
                    value={ano}
                    onChange={(e) => setAno(e.target.value)}
                    className={`${inputClass} cursor-pointer appearance-none pr-9 ${
                      ano === "" ? "text-gray-400" : ""
                    }`}
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>
                    {ANOS.map((a) => (
                      <option key={a} value={a} className="text-carbo-grafite">
                        {a}
                      </option>
                    ))}
                  </select>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Campo>

              <Campo htmlFor="km" label="KM atual">
                <input
                  id="km"
                  type="text"
                  inputMode="numeric"
                  value={km}
                  onChange={(e) => setKm(e.target.value.replace(/\D/g, "").slice(0, 7))}
                  placeholder="Ex.: 85000"
                  className={inputClass}
                />
              </Campo>
            </div>
          </div>

          {/* Campo-isca anti-spam (oculto para pessoas) */}
          <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="empresa">Não preencher</label>
            <input
              id="empresa"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {/* Aviso */}
          <AvisoChegada className="mt-6" />

          {erro && (
            <p className="mt-4 text-center text-sm font-medium text-red-600">{erro}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            style={{ backgroundImage: GRAD }}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-[family-name:var(--font-basement)] text-base font-extrabold uppercase tracking-wide text-white shadow-sm transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
          >
            {status === "loading" ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Confirmando…
              </>
            ) : (
              "Confirmar agendamento"
            )}
          </button>

          <p className="mt-3 text-center text-xs text-carbo-grafite/45">
            Seus dados são usados apenas para confirmar e lembrar do seu horário.
          </p>
        </form>
      </section>

      <Footer />
    </main>
  );
}

/* ─── Blocos de layout ───────────────────────────────────────── */
function Header() {
  return (
    <header className="w-full border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-md items-center justify-center px-5 py-4">
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

function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-md flex-col items-center gap-1 px-5 py-6 text-center">
        <Image
          src="/grupocarbo-icon.png"
          alt="Grupo Carbo"
          width={625}
          height={420}
          className="h-6 w-auto opacity-70"
        />
        <p className="text-xs text-carbo-grafite/45">
          © {new Date().getFullYear()} Grupo Carbo. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

function Linha({
  rotulo,
  valor,
  forte,
}: {
  rotulo: string;
  valor: string;
  forte?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-carbo-grafite/45">
        {rotulo}
      </span>
      <span
        className={`text-right text-sm ${
          forte
            ? "font-[family-name:var(--font-basement)] text-base font-bold text-carbo-grafite"
            : "text-carbo-grafite/80"
        }`}
      >
        {valor}
      </span>
    </div>
  );
}

/* ─── Aviso em destaque (tarja vermelha) ─────────────────────── */
function AvisoChegada({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-red-200 border-l-4 border-l-red-500 bg-red-50 px-4 py-3.5 ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-5 w-5 shrink-0 text-red-600">
        <path
          d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M12 9v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-red-700">
          Atenção — chegue 10 min antes
        </p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-red-600/90">
          Esse tempo é usado para a preparação do veículo. Quem chega em cima da
          hora pode perder a vaga.
        </p>
      </div>
    </div>
  );
}

/* ─── Helpers de canvas (comprovante) ────────────────────────── */
function desenharLinhas(
  ctx: CanvasRenderingContext2D,
  texto: string,
  x: number,
  y: number,
  larguraMax: number,
  alturaLinha: number,
) {
  const palavras = texto.split(" ");
  let linha = "";
  let yy = y;
  for (const p of palavras) {
    const teste = linha ? `${linha} ${p}` : p;
    if (ctx.measureText(teste).width > larguraMax && linha) {
      ctx.fillText(linha, x, yy);
      linha = p;
      yy += alturaLinha;
    } else {
      linha = teste;
    }
  }
  if (linha) ctx.fillText(linha, x, yy);
}

function desenharRetanguloArredondado(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* ─── Ícones ─────────────────────────────────────────────────── */
function IconeDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconeData() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconeLocal() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
