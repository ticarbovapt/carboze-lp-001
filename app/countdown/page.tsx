"use client";

import Image from "next/image";
import { useState, useEffect, FormEvent } from "react";

/* ── Target date ─────────────────────────────────────────── */
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

/* ── Countdown unit ──────────────────────────────────────── */
function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
        <span className="font-[family-name:var(--font-barlow)] font-extrabold text-limao text-3xl sm:text-4xl md:text-5xl tabular-nums leading-none">
          {pad(value)}
        </span>
      </div>
      <span className="font-[family-name:var(--font-archivo)] text-white/50 text-xs mt-2 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function CountdownPage() {
  const [time, setTime] = useState(getTimeLeft());
  const [email, setEmail] = useState("");
  const [name, setName]   = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1_000);
    return () => clearInterval(id);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setErrorMsg("Informe seu e-mail."); return; }

    setStatus("loading");
    setErrorMsg("");

    try {
      /* Integração futura: trocar este fetch pelo endpoint real */
      await new Promise((r) => setTimeout(r, 900));  // simulação
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Ops! Tente novamente em instantes.");
    }
  }

  return (
    <main className="min-h-dvh bg-verde-escuro flex flex-col">
      {/* ── Header mínimo ───────────────────────────────── */}
      <header className="w-full px-5 py-4 flex items-center justify-between border-b border-white/10">
        <Image
          src="/logo-carboze-1.png"
          alt="CarboZé"
          width={160}
          height={36}
          priority
          className="h-8 w-auto"
        />
      </header>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col items-center justify-center px-5 py-12 md:py-20 text-center gap-8">

        {/* Badge */}
        <span className="inline-flex items-center gap-2 bg-limao/10 border border-limao/30 text-limao text-xs font-[family-name:var(--font-barlow)] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
          Em breve
        </span>

        {/* Headline */}
        <h1 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-white text-3xl sm:text-5xl md:text-6xl leading-tight max-w-2xl">
          Algo novo está
          <span className="text-limao block">chegando para o CarboZé.</span>
        </h1>

        <p className="font-[family-name:var(--font-archivo)] text-white/60 text-base sm:text-lg max-w-lg">
          Cadastre-se agora e seja o primeiro a saber — com acesso antecipado e condições exclusivas de lançamento.
        </p>

        {/* ── Countdown ─────────────────────────────────── */}
        <div className="flex items-start gap-3 sm:gap-5">
          <Unit value={time.days}    label="dias"     />
          <span className="font-[family-name:var(--font-barlow)] font-extrabold text-limao text-4xl sm:text-5xl mt-3">:</span>
          <Unit value={time.hours}   label="horas"    />
          <span className="font-[family-name:var(--font-barlow)] font-extrabold text-limao text-4xl sm:text-5xl mt-3">:</span>
          <Unit value={time.minutes} label="minutos"  />
          <span className="font-[family-name:var(--font-barlow)] font-extrabold text-limao text-4xl sm:text-5xl mt-3">:</span>
          <Unit value={time.seconds} label="segundos" />
        </div>

        {/* ── Formulário ────────────────────────────────── */}
        <div className="w-full max-w-md">
          {status === "success" ? (
            <div className="bg-limao/10 border border-limao/30 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">✅</div>
              <p className="font-[family-name:var(--font-barlow)] font-bold text-white text-lg">
                Cadastro confirmado!
              </p>
              <p className="font-[family-name:var(--font-archivo)] text-white/60 text-sm mt-2">
                Você será notificado assim que lançarmos.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-4"
            >
              <h2 className="font-[family-name:var(--font-barlow)] font-bold text-white text-lg text-left">
                Quero ser avisado primeiro
              </h2>

              {/* Nome */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name"
                  className="font-[family-name:var(--font-archivo)] text-white/50 text-xs uppercase tracking-widest"
                >
                  Nome
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 font-[family-name:var(--font-archivo)] text-sm focus:outline-none focus:border-limao transition-colors"
                />
              </div>

              {/* E-mail */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="font-[family-name:var(--font-archivo)] text-white/50 text-xs uppercase tracking-widest"
                >
                  E-mail <span className="text-limao">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 font-[family-name:var(--font-archivo)] text-sm focus:outline-none focus:border-limao transition-colors"
                />
              </div>

              {/* Celular */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="phone"
                  className="font-[family-name:var(--font-archivo)] text-white/50 text-xs uppercase tracking-widest"
                >
                  WhatsApp (opcional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 font-[family-name:var(--font-archivo)] text-sm focus:outline-none focus:border-limao transition-colors"
                />
              </div>

              {/* Erro */}
              {errorMsg && (
                <p className="font-[family-name:var(--font-archivo)] text-red-400 text-sm">
                  {errorMsg}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-limao text-verde-escuro font-[family-name:var(--font-barlow)] font-extrabold uppercase text-base py-4 rounded-xl hover:bg-verde-medio transition-colors active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              >
                {status === "loading" ? "Enviando…" : "Quero ser notificado →"}
              </button>

              <p className="font-[family-name:var(--font-archivo)] text-white/30 text-xs text-center">
                Sem spam. Cancelamento a qualquer momento.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── Footer mínimo ───────────────────────────────── */}
      <footer className="px-5 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-[family-name:var(--font-archivo)] text-white/30 text-xs">
          © 2025 Carbozé. Todos os direitos reservados.
        </p>
        <a
          href="/"
          className="font-[family-name:var(--font-archivo)] text-white/40 text-xs hover:text-limao transition-colors"
        >
          ← Voltar para o site
        </a>
      </footer>
    </main>
  );
}
