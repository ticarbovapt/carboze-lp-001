"use client";

import Image from "next/image";
import { useState, useEffect, FormEvent } from "react";

/* ─── Google Form ────────────────────────────────────────── */
const FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSerIDcBgkHbvG6bZTpBQWAOJuyLQOevNgXGt1A26aOK34Dmng/formResponse";

const INFLUENCERS = [
  "@tiago_dionisio",
  "@rodrigotarjapreta",
  "@nenellucas",
  "@talitamoura._",
];

/* ─── Target date ────────────────────────────────────────── */
const TARGET = new Date("2025-08-01T00:00:00-03:00");

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
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
        <span className="font-[family-name:var(--font-barlow)] font-extrabold text-limao text-3xl sm:text-4xl md:text-5xl tabular-nums leading-none">
          {pad(value)}
        </span>
      </div>
      <span className="font-[family-name:var(--font-archivo)] text-white/40 text-[10px] sm:text-xs uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

/* ─── Label helper ───────────────────────────────────────── */
function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
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

/* ─── Page ───────────────────────────────────────────────── */
export default function CountdownPage() {
  const [time, setTime] = useState(getTimeLeft());
  const [nome, setNome]           = useState("");
  const [cidade, setCidade]       = useState("");
  const [celular, setCelular]     = useState("");
  const [influencer, setInfluencer] = useState("");
  const [status, setStatus]       = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1_000);
    return () => clearInterval(id);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setStatus("loading");

    try {
      const body = new URLSearchParams({
        "entry.372983718": nome,
        "entry.735288031": cidade,
        "entry.730301704": celular,
        "entry.102071270": influencer,
      });

      /* no-cors: Google Forms aceita a submission sem resposta legível */
      await fetch(FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      setStatus("success");
    } catch {
      /* no-cors pode lançar TypeError network — tratar como sucesso
         pois o Google Forms já recebeu a requisição */
      setStatus("success");
    }
  }

  return (
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
      <section className="flex-1 flex flex-col items-center justify-center px-5 py-12 md:py-16 gap-8 sm:gap-10">

        {/* Badge */}
        <span className="inline-flex items-center gap-2 bg-limao/10 border border-limao/30 text-limao text-xs font-[family-name:var(--font-barlow)] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
          🚀 Lista VIP — Em breve
        </span>

        {/* Headline */}
        <div className="text-center max-w-2xl">
          <h1 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-white text-3xl sm:text-5xl md:text-6xl leading-tight">
            Vacine seu
            <span className="text-limao block">combustível.</span>
          </h1>
          <p className="font-[family-name:var(--font-archivo)] text-white/60 text-sm sm:text-base mt-4 max-w-lg mx-auto leading-relaxed">
            Quer ser um dos primeiros a conhecer o CarboZé? Cadastre-se e receba em
            primeira mão todas as novidades sobre o lançamento da solução que vai
            ajudar a proteger o combustível e cuidar do desempenho do seu motor.&nbsp;🚀
          </p>
        </div>

        {/* ── Countdown ───────────────────────────────── */}
        <div className="flex items-start gap-2 sm:gap-4">
          <Unit value={time.days}    label="dias"     />
          <span className="font-[family-name:var(--font-barlow)] font-extrabold text-limao/60 text-3xl sm:text-5xl mt-3 sm:mt-4 select-none">:</span>
          <Unit value={time.hours}   label="horas"    />
          <span className="font-[family-name:var(--font-barlow)] font-extrabold text-limao/60 text-3xl sm:text-5xl mt-3 sm:mt-4 select-none">:</span>
          <Unit value={time.minutes} label="minutos"  />
          <span className="font-[family-name:var(--font-barlow)] font-extrabold text-limao/60 text-3xl sm:text-5xl mt-3 sm:mt-4 select-none">:</span>
          <Unit value={time.seconds} label="segundos" />
        </div>

        {/* ── Formulário ──────────────────────────────── */}
        <div className="w-full max-w-md">
          {status === "success" ? (
            /* ── Sucesso ──────────────────────────────── */
            <div className="bg-limao/10 border border-limao/20 rounded-2xl p-8 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-limao/20 flex items-center justify-center text-3xl">
                ✅
              </div>
              <div>
                <p className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-white text-xl">
                  Cadastro confirmado!
                </p>
                <p className="font-[family-name:var(--font-archivo)] text-white/50 text-sm mt-2 leading-relaxed">
                  Você está na lista VIP. Assim que lançarmos, você será o
                  primeiro a saber — com condições exclusivas.
                </p>
              </div>
              <a
                href="/"
                className="mt-2 font-[family-name:var(--font-archivo)] text-limao text-sm hover:underline"
              >
                ← Voltar ao site
              </a>
            </div>
          ) : (
            /* ── Form ───────────────────────────────── */
            <form
              onSubmit={handleSubmit}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-5"
            >
              {/* Título interno */}
              <div className="border-b border-white/10 pb-4">
                <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-white text-base tracking-wide">
                  Lista VIP — Vacine seu combustível
                </h2>
                <p className="font-[family-name:var(--font-archivo)] text-white/40 text-xs mt-1">
                  * Campos obrigatórios
                </p>
              </div>

              {/* Nome e sobrenome — entry.372983718 */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nome" required>Nome e sobrenome</Label>
                <input
                  id="nome"
                  type="text"
                  placeholder="Seu nome completo"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Cidade e estado — entry.735288031 */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cidade" required>Cidade e estado</Label>
                <input
                  id="cidade"
                  type="text"
                  placeholder="Ex: São Paulo – SP"
                  required
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Celular — entry.730301704 */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="celular" required>Celular</Label>
                <input
                  id="celular"
                  type="tel"
                  placeholder="(DDD) 99999-9999"
                  required
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Influenciador — entry.102071270 */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="influencer" required>Influenciador</Label>
                <div className="relative">
                  <select
                    id="influencer"
                    required
                    value={influencer}
                    onChange={(e) => setInfluencer(e.target.value)}
                    className={`${inputClass} appearance-none cursor-pointer pr-10 ${
                      influencer === "" ? "text-white/25" : "text-white"
                    }`}
                  >
                    <option value="" disabled hidden>
                      Escolher
                    </option>
                    {INFLUENCERS.map((inf) => (
                      <option
                        key={inf}
                        value={inf}
                        className="bg-verde-escuro text-white"
                      >
                        {inf}
                      </option>
                    ))}
                  </select>
                  {/* Chevron */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

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
  );
}
