"use client";

import Image from "next/image";
import { useState, useEffect, FormEvent, useCallback } from "react";

/* ─── Supabase (REST direto, sem SDK extra no bundle) ────── */
const SUPABASE_URL = "https://wpkfirmapxevzpxjovjr.supabase.co";
const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwa2Zpcm1hcHhldnpweGpvdmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MDQwMzAsImV4cCI6MjA5MjQ4MDAzMH0.WIqNNoO77SNQu_WvixRH_a5J3kZYSo2HEwkaXGyaPB8";

const CANAIS = [
  "Ponto de venda CarboZé",
  "Influenciador - @tiagodionisio",
  "Influenciador - @nenellucas",
  "Influenciador - @rodrigotarjapreta",
];

/* ─── Target date ────────────────────────────────────────── */
const TARGET = new Date("2026-06-02T09:00:00-03:00");

function getTimeLeft() {
  const diff = Math.max(0, TARGET.getTime() - Date.now());
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/* ─── Countdown unit ─────────────────────────────────────── */
function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl bg-white/[0.05] ring-1 ring-white/10 flex items-center justify-center">
        <span className="font-[family-name:var(--font-barlow)] font-extrabold text-limao text-4xl sm:text-5xl md:text-6xl tabular-nums leading-none">
          {pad(value)}
        </span>
      </div>
      <span className="font-[family-name:var(--font-archivo)] text-white/40 text-[10px] sm:text-xs uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

/* ─── Input / Label helpers ──────────────────────────────── */
function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-[family-name:var(--font-archivo)] text-white/50 text-xs uppercase tracking-widest flex items-center gap-1"
    >
      {children}
      {required && <span className="text-limao">*</span>}
    </label>
  );
}

const inputClass =
  "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-white/25 font-[family-name:var(--font-archivo)] text-sm focus:outline-none focus:border-limao focus:bg-white/8 transition-all";

/* ─── Modal ──────────────────────────────────────────────── */
function VIPModal({ onClose }: { onClose: () => void }) {
  const [nome, setNome]           = useState("");
  const [cidade, setCidade]       = useState("");
  const [celular, setCelular]     = useState("");
  const [influencer, setInfluencer] = useState("");
  const [status, setStatus]       = useState<"idle" | "loading" | "success" | "error">("idle");

  /* Fechar com ESC */
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/vip_registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON,
          Authorization: `Bearer ${SUPABASE_ANON}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ nome, cidade, celular, influencer }),
      });

      if (!res.ok) throw new Error("Supabase error");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal box */}
      <div className="relative w-full max-w-md bg-verde-escuro border border-white/15 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">

        {/* Botão fechar */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            className="w-5 h-5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {status === "success" ? (
          /* ── Sucesso ── */
          <div className="p-8 text-center flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-limao/20 flex items-center justify-center text-3xl">
              ✅
            </div>
            <div>
              <p className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-white text-xl">
                Cadastro confirmado!
              </p>
              <p className="font-[family-name:var(--font-archivo)] text-white/50 text-sm mt-2 leading-relaxed">
                Você está na lista VIP. Assim que lançarmos, você será o
                primeiro a saber — com condições exclusivas.&nbsp;🚀
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-1 font-[family-name:var(--font-archivo)] text-limao text-sm hover:underline"
            >
              Fechar
            </button>
          </div>
        ) : (
          /* ── Formulário ── */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 flex flex-col gap-5">
            {/* Cabeçalho */}
            <div className="border-b border-white/10 pb-4 pr-6">
              <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-white text-base tracking-wide">
                Lista VIP — Vacine seu combustível
              </h2>
              <p className="font-[family-name:var(--font-archivo)] text-white/40 text-xs mt-1">
                * Campos obrigatórios
              </p>
            </div>

            {/* Nome e sobrenome */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nome" required>Nome e sobrenome</Label>
              <input
                id="nome" type="text" placeholder="Seu nome completo"
                required value={nome} onChange={(e) => setNome(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Cidade e estado */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cidade" required>Cidade e estado</Label>
              <input
                id="cidade" type="text" placeholder="Ex: São Paulo – SP"
                required value={cidade} onChange={(e) => setCidade(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Celular */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="celular" required>Celular</Label>
              <input
                id="celular" type="tel" placeholder="(DDD) 99999-9999"
                required value={celular} onChange={(e) => setCelular(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Canal */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="influencer" required>Qual canal te trouxe até aqui?</Label>
              <div className="relative">
                <select
                  id="influencer" required value={influencer}
                  onChange={(e) => setInfluencer(e.target.value)}
                  className={`${inputClass} appearance-none cursor-pointer pr-10 ${
                    influencer === "" ? "text-white/25" : "text-white"
                  }`}
                >
                  <option value="" disabled hidden>Escolher</option>
                  {CANAIS.map((canal) => (
                    <option key={canal} value={canal} className="bg-verde-escuro text-white">
                      {canal}
                    </option>
                  ))}
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* Erro */}
            {status === "error" && (
              <p className="font-[family-name:var(--font-archivo)] text-red-400 text-xs text-center">
                Erro ao enviar. Tente novamente.
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-limao text-verde-escuro font-[family-name:var(--font-barlow)] font-extrabold uppercase text-base py-4 rounded-xl hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-1 tracking-wide"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Enviando…
                </span>
              ) : (
                "Quero entrar na Lista VIP →"
              )}
            </button>

            <p className="font-[family-name:var(--font-archivo)] text-white/25 text-xs text-center">
              Sem spam. Seus dados são usados apenas para o lançamento.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function CountdownPage() {
  const [time, setTime]       = useState(getTimeLeft());
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1_000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {modalOpen && <VIPModal onClose={() => setModalOpen(false)} />}

      <main className="min-h-dvh bg-verde-escuro flex flex-col">

        {/* ── Header ──────────────────────────────────────── */}
        <header className="w-full px-5 py-4 flex items-center justify-between border-b border-white/10">
          <a href="/">
            <Image
              src="/logo-carboze-1.png"
              alt="CarboZé"
              width={160}
              height={36}
              priority
              className="h-8 w-auto"
            />
          </a>
          <a
            href="/"
            className="font-[family-name:var(--font-archivo)] text-white/40 text-xs hover:text-limao transition-colors"
          >
            ← Voltar ao site
          </a>
        </header>

        {/* ── Hero ────────────────────────────────────────── */}
        <section className="flex-1 flex flex-col items-center justify-center px-5 py-16 md:py-24 gap-10 text-center">

          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-limao/10 border border-limao/20 text-limao text-xs font-[family-name:var(--font-archivo)] tracking-[0.12em] uppercase px-4 py-1.5 rounded-full">
            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 shrink-0" aria-hidden="true">
              <circle cx="6" cy="6" r="2.5" fill="currentColor"/>
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            Lista VIP — Em breve
          </span>

          {/* Headline */}
          <div className="max-w-2xl">
            <h1 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-white text-4xl sm:text-5xl md:text-7xl leading-tight">
              Vacine seu
              <span className="text-limao block">combustível.</span>
            </h1>
            <p className="font-[family-name:var(--font-archivo)] text-white/60 text-base sm:text-lg mt-6 max-w-lg mx-auto leading-relaxed">
              Quer ser um dos primeiros a conhecer o CarboZé? Cadastre-se e
              receba em primeira mão todas as novidades sobre o lançamento.
            </p>
          </div>

          {/* ── Countdown ───────────────────────────────── */}
          <div className="flex items-start gap-3 sm:gap-5">
            <Unit value={time.days}    label="dias"     />
            <span className="font-[family-name:var(--font-barlow)] font-extrabold text-limao/50 text-4xl sm:text-6xl mt-4 sm:mt-5 select-none">:</span>
            <Unit value={time.hours}   label="horas"    />
            <span className="font-[family-name:var(--font-barlow)] font-extrabold text-limao/50 text-4xl sm:text-6xl mt-4 sm:mt-5 select-none">:</span>
            <Unit value={time.minutes} label="minutos"  />
            <span className="font-[family-name:var(--font-barlow)] font-extrabold text-limao/50 text-4xl sm:text-6xl mt-4 sm:mt-5 select-none">:</span>
            <Unit value={time.seconds} label="segundos" />
          </div>

          {/* ── CTA ─────────────────────────────────────── */}
          <button
            onClick={() => setModalOpen(true)}
            className="group inline-flex items-center gap-3 bg-limao text-verde-escuro font-[family-name:var(--font-barlow)] font-extrabold uppercase text-base px-10 py-4 rounded-xl hover:brightness-110 transition-all active:scale-[0.98] tracking-widest shadow-lg shadow-limao/15"
          >
            Quero ser notificado
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform duration-200">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <p className="font-[family-name:var(--font-archivo)] text-white/30 text-sm">
            02 de junho · 9h · Lançamento oficial
          </p>
        </section>

        {/* ── Footer ──────────────────────────────────────── */}
        <footer className="px-5 py-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-[family-name:var(--font-archivo)] text-white/25 text-xs">
            © 2025 Carbozé. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-archivo)] text-white/25 text-xs hover:text-white/50 transition-colors"
            >
              Política de Privacidade
            </a>
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-archivo)] text-white/25 text-xs hover:text-white/50 transition-colors"
            >
              Termos de Uso
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}
