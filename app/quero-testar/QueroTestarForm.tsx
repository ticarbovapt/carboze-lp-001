"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import Image from "next/image";
import { insertRow } from "@/lib/supabase";
import LovableHeader from "@/components/LovableHeader";

/* ─── Helpers de estilo (padrão CarboZé) ─────────────────────── */
function Label({
  htmlFor,
  children,
  required,
  opcional,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  opcional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-[family-name:var(--font-archivo)] text-white/70 text-xs uppercase tracking-widest flex items-center gap-1"
    >
      {children}
      {required && <span className="text-limao">*</span>}
      {opcional && <span className="text-white/30 normal-case tracking-normal">(opcional)</span>}
    </label>
  );
}

const inputClass =
  "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-white/25 font-[family-name:var(--font-archivo)] text-sm focus:outline-none focus:border-limao focus:bg-white/8 transition-all";

function mascararCelular(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/* ─── Modal dos termos ───────────────────────────────────────── */
function TermosModal({ onClose }: { onClose: () => void }) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-white/15 bg-verde-escuro shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-base tracking-wide">
            Termo de participação
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="text-white/40 transition-colors hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-5 w-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 font-[family-name:var(--font-archivo)] text-sm leading-relaxed text-white/70">
          <p className="mb-3 font-semibold text-white">
            Termo de participação e autorização de uso de imagem
          </p>
          <p className="mb-3">
            Ao participar da ação de testes do CarboZé (Grupo Carbo), você declara que leu e concorda com os termos abaixo:
          </p>
          <ol className="list-decimal space-y-2.5 pl-4">
            <li>
              Os dados informados (nome, WhatsApp, modelo da moto e, se fornecido, @ do Instagram) serão usados para entrar em contato sobre a ação, combinar o envio do produto para teste e coletar o seu feedback.
            </li>
            <li>Você poderá ser contatado(a) pelo WhatsApp informado.</li>
            <li>
              Caso você envie relatos, fotos, vídeos ou depoimentos (por WhatsApp ou outro canal), autoriza o CarboZé / Grupo Carbo a utilizar e divulgar esse material, a sua imagem e o seu relato nas redes sociais e nos materiais de divulgação da marca, de forma gratuita e por prazo indeterminado.
            </li>
            <li>
              A participação é voluntária e você pode solicitar a exclusão dos seus dados a qualquer momento pelos nossos canais de atendimento.
            </li>
            <li>
              Seus dados são tratados conforme a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018) e não serão vendidos a terceiros.
            </li>
          </ol>
        </div>

        <div className="border-t border-white/10 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-limao py-3 font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-sm tracking-wide transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Página ─────────────────────────────────────────────────── */
export default function QueroTestarForm() {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [modelo, setModelo] = useState("");
  const [instagram, setInstagram] = useState("");
  const [autoriza, setAutoriza] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [erro, setErro] = useState("");
  const [termosAberto, setTermosAberto] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");

    const digits = whatsapp.replace(/\D/g, "");
    if (nome.trim().length < 3) return setErro("Informe seu nome completo.");
    if (digits.length < 10 || digits.length > 11)
      return setErro("Informe um WhatsApp válido com DDD.");
    if (!modelo.trim()) return setErro("Informe o modelo da sua moto.");
    if (!autoriza)
      return setErro("É preciso autorizar o uso de imagem e relato para participar.");

    const ig = instagram.trim();
    const igNorm = ig ? (ig.startsWith("@") ? ig : `@${ig}`) : null;

    setStatus("loading");
    try {
      await insertRow("teste_carboze", {
        nome: nome.trim(),
        telefone: "55" + digits,
        modelo_moto: modelo.trim(),
        instagram: igNorm,
        autoriza_imagem: true,
      });
      setStatus("success");
    } catch {
      setStatus("error");
      setErro("Não foi possível enviar agora. Tente novamente em instantes.");
    }
  }

  return (
    <main className="flex min-h-dvh flex-col bg-verde-escuro">
      <LovableHeader hideNav />

      <div className="flex flex-1 flex-col items-center justify-center px-5 py-8">
        {status === "success" ? (
          /* ─── Sucesso ─────────────────────────────────────── */
          <div className="flex max-w-sm flex-col items-center gap-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-limao/20 text-3xl">
              ✅
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-basement)] text-2xl font-extrabold uppercase text-white">
                Cadastro confirmado!
              </h1>
              <p className="mt-2 font-[family-name:var(--font-archivo)] text-sm leading-relaxed text-white/70">
                Recebemos seus dados. Em breve a gente entra em contato pelo
                WhatsApp com os próximos passos do seu teste com o CarboZé. 🚀
              </p>
            </div>
          </div>
        ) : (
          /* ─── Formulário ──────────────────────────────────── */
          <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-6">
            {/* Cabeçalho */}
            <div className="text-center">
              <span className="font-[family-name:var(--font-archivo)] text-[11px] uppercase tracking-[0.18em] text-limao">
                Teste gratuito
              </span>
              <h1 className="mt-2 font-[family-name:var(--font-basement)] text-3xl font-extrabold uppercase leading-tight text-white sm:text-4xl">
                Teste o CarboZé na{" "}
                <span className="text-limao">sua moto</span>
              </h1>
              <p className="mt-3 font-[family-name:var(--font-archivo)] text-sm leading-relaxed text-white/70">
                Cadastre-se para receber o CarboZé e testar no seu veículo. Depois
                a gente entra em contato pra saber como foi a sua experiência.
              </p>
            </div>

            {/* Nome */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nome" required>Nome completo</Label>
              <input
                id="nome"
                type="text"
                autoComplete="name"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome e sobrenome"
                className={inputClass}
              />
            </div>

            {/* WhatsApp */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="whatsapp" required>WhatsApp</Label>
              <input
                id="whatsapp"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(mascararCelular(e.target.value))}
                placeholder="(84) 99999-9999"
                className={inputClass}
              />
            </div>

            {/* Modelo da moto */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="modelo" required>Modelo da moto</Label>
              <input
                id="modelo"
                type="text"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                placeholder="Ex.: Honda CG 160, Yamaha Fazer…"
                className={inputClass}
              />
            </div>

            {/* Instagram */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="instagram" opcional>@ do Instagram</Label>
              <input
                id="instagram"
                type="text"
                autoCapitalize="none"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@seuperfil (se quiser ser marcado)"
                className={inputClass}
              />
            </div>

            {/* Autorização */}
            <label className="flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={autoriza}
                onChange={(e) => setAutoriza(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-limao"
              />
              <span className="font-[family-name:var(--font-archivo)] text-xs leading-snug text-white/70">
                Autorizo o uso da minha imagem e do meu relato nas redes do CarboZé.{" "}
                <button
                  type="button"
                  onClick={() => setTermosAberto(true)}
                  className="text-limao underline underline-offset-2 hover:brightness-110"
                >
                  Ler termos
                </button>
              </span>
            </label>

            {/* Erro */}
            {erro && (
              <p className="text-center font-[family-name:var(--font-archivo)] text-xs text-red-400">
                {erro}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-1 w-full rounded-xl bg-limao py-4 font-[family-name:var(--font-basement)] text-base font-extrabold uppercase tracking-wide text-verde-escuro transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Enviando…
                </span>
              ) : (
                "Quero testar o CarboZé →"
              )}
            </button>

            <p className="text-center font-[family-name:var(--font-archivo)] text-xs text-white/25">
              Seus dados são usados apenas para contato sobre o teste.
            </p>
          </form>
        )}
      </div>

      {/* Footer */}
      <footer className="shrink-0 border-t border-white/10 py-4">
        <div className="mx-auto flex max-w-md items-center justify-between px-5">
          <Image
            src="/logo-header.png"
            alt="CarboZé"
            width={1147}
            height={198}
            className="h-6 w-auto opacity-60"
          />
          <p className="font-[family-name:var(--font-archivo)] text-xs text-white/70">
            © {new Date().getFullYear()} CarboZé.
          </p>
        </div>
      </footer>

      {termosAberto && <TermosModal onClose={() => setTermosAberto(false)} />}
    </main>
  );
}
