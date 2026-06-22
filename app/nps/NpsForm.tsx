"use client";

import Image from "next/image";
import { useState, FormEvent } from "react";
import { insertRow } from "@/lib/supabase";
import LovableHeader from "@/components/LovableHeader";
import FloatingWhatsApp from "@/components/lovable/FloatingWhatsApp";
import { WHATSAPP_URL } from "@/lib/constants";
import OfferPopup from "./OfferPopup";

/* ─── helpers de estilo (mesmos padrões do /countdown) ───── */
function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor?: string;
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

function categoriaFromScore(score: number): "detrator" | "neutro" | "promotor" {
  if (score <= 6) return "detrator";
  if (score <= 8) return "neutro";
  return "promotor";
}

function motivoLabel(score: number | null): string {
  if (score === null) return "Conte o motivo da sua nota";
  if (score <= 6) return "O que mais te incomodou? Queremos resolver.";
  if (score <= 8) return "O que faltou para ser uma nota 10?";
  return "Que ótimo! O que você mais gostou?";
}

/* ─── Estrela ────────────────────────────────────────────── */
function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-8 h-8 transition-colors ${filled ? "text-limao" : "text-white/20"}`}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function NpsForm() {
  const [score, setScore] = useState<number | null>(null);
  const [motivo, setMotivo] = useState("");
  const [entrega, setEntrega] = useState(0);
  const [testou, setTestou] = useState<"" | "sim" | "ainda-nao">("");
  const [nome, setNome] = useState("");
  const [celular, setCelular] = useState("");
  const [autoriza, setAutoriza] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showOffer, setShowOffer] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (score === null || !nome.trim() || !celular.trim()) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const origem =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("origem") || "whatsapp"
          : "whatsapp";

      await insertRow("nps_responses", {
        nome: nome.trim(),
        celular: celular.trim(),
        score,
        categoria: categoriaFromScore(score),
        motivo: motivo.trim() || null,
        entrega_score: entrega || null,
        testou: testou || null,
        autoriza_depoimento: autoriza,
        origem,
      });
      setStatus("success");
      setShowOffer(true);
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-dvh flex flex-col bg-verde-escuro">
      <LovableHeader hideNav />

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-8">
        {status === "success" ? (
          /* ─── Tela de agradecimento ─────────────────────── */
          <div className="text-center flex flex-col items-center gap-5 max-w-sm">
            <div className="w-16 h-16 rounded-full bg-limao/20 flex items-center justify-center text-3xl">
              ✅
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-2xl">
                Obrigado pela sua avaliação!
              </h1>
              <p className="font-[family-name:var(--font-archivo)] text-white/55 text-sm mt-2 leading-relaxed">
                Sua opinião ajuda a melhorar o CarboZé a cada tanque. 💚
              </p>
            </div>
            <button
              onClick={() => setShowOffer(true)}
              className="bg-limao text-verde-escuro font-[family-name:var(--font-basement)] font-extrabold uppercase text-sm px-6 py-3 rounded-xl hover:brightness-110 active:scale-95 transition-all"
            >
              🎁 Ver minha surpresa
            </button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-archivo)] text-limao text-sm hover:underline"
            >
              Falar com a gente no WhatsApp
            </a>
          </div>
        ) : (
          /* ─── Formulário ────────────────────────────────── */
          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
            {/* Cabeçalho */}
            <div className="text-center">
              <p className="font-[family-name:var(--font-archivo)] text-white/40 text-[11px] tracking-[0.18em] uppercase mb-2">
                Sua opinião vale muito
              </p>
              <h1 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl leading-tight">
                Como foi sua experiência com o{" "}
                <span className="text-limao">CarboZé?</span>
              </h1>
              <p className="font-[family-name:var(--font-archivo)] text-white/50 text-sm mt-2">
                Leva menos de 1 minuto e ajuda a melhorar o produto.
              </p>
            </div>

            {/* NPS 0–10 */}
            <div className="flex flex-col gap-2">
              <Label required>
                De 0 a 10, o quanto você recomendaria o CarboZé a um amigo?
              </Label>
              <div className="grid grid-cols-11 gap-1 sm:gap-1.5">
                {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setScore(n)}
                    className={`h-11 sm:h-12 rounded-lg font-[family-name:var(--font-basement)] font-bold text-[13px] sm:text-sm transition-colors ${
                      score === n
                        ? "bg-limao text-verde-escuro"
                        : "bg-white/5 border border-white/15 text-white/70 hover:border-white/35"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-between font-[family-name:var(--font-archivo)] text-white/35 text-[10px] mt-0.5">
                <span>Não recomendaria</span>
                <span>Recomendaria com certeza</span>
              </div>
            </div>

            {/* Motivo */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="motivo">{motivoLabel(score)}</Label>
              <textarea
                id="motivo"
                rows={3}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Escreva aqui (opcional)"
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Entrega */}
            <div className="flex flex-col gap-1.5">
              <Label>Como foi a entrega do produto?</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
                    onClick={() => setEntrega(n === entrega ? 0 : n)}
                  >
                    <Star filled={n <= entrega} />
                  </button>
                ))}
              </div>
            </div>

            {/* Testou */}
            <div className="flex flex-col gap-1.5">
              <Label>Você já testou o CarboZé no seu veículo?</Label>
              <div className="flex gap-2">
                {[
                  { v: "sim", t: "Sim, já usei" },
                  { v: "ainda-nao", t: "Ainda não" },
                ].map((opt) => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => setTestou(opt.v as "sim" | "ainda-nao")}
                    className={`flex-1 rounded-full border px-4 py-2.5 font-[family-name:var(--font-archivo)] text-sm transition-all ${
                      testou === opt.v
                        ? "bg-limao text-verde-escuro border-limao font-semibold"
                        : "bg-white/5 border-white/15 text-white/70 hover:border-white/35"
                    }`}
                  >
                    {opt.t}
                  </button>
                ))}
              </div>
            </div>

            {/* Identificação */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nome" required>
                Seu nome
              </Label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome e sobrenome"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="celular" required>
                WhatsApp
              </Label>
              <input
                id="celular"
                type="tel"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                placeholder="(DDD) 99999-9999"
                className={inputClass}
              />
            </div>

            {/* Consentimento */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoriza}
                onChange={(e) => setAutoriza(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-limao shrink-0"
              />
              <span className="font-[family-name:var(--font-archivo)] text-white/50 text-xs leading-snug">
                Autorizo o CarboZé a usar meu comentário como depoimento (sem expor meus dados pessoais).
              </span>
            </label>

            {/* Erro */}
            {status === "error" && (
              <p className="font-[family-name:var(--font-archivo)] text-red-400 text-xs text-center">
                Preencha a nota, o nome e o WhatsApp. Se o erro persistir, tente novamente.
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-limao text-verde-escuro font-[family-name:var(--font-basement)] font-extrabold uppercase text-base py-4 rounded-xl hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed tracking-wide"
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
                "Concluir e ver minha surpresa 🎁"
              )}
            </button>
          </form>
        )}
      </div>

      {/* Popup de oferta + comemoração */}
      {showOffer && <OfferPopup onClose={() => setShowOffer(false)} />}

      {/* Footer mínimo */}
      <footer className="shrink-0 border-t border-white/10 py-4">
        <div className="max-w-md mx-auto px-5 flex items-center justify-between">
          <Image
            src="/logo-header.png"
            alt="CarboZé"
            width={1147}
            height={198}
            className="h-6 w-auto opacity-60"
          />
          <p className="font-[family-name:var(--font-archivo)] text-white/20 text-xs">
            © 2025 CarboZé.
          </p>
        </div>
      </footer>

      <FloatingWhatsApp />
    </main>
  );
}
