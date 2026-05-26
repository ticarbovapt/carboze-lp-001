import type { Metadata } from "next";
import Image from "next/image";
import { CHECKOUT_MOTOS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "CarboZé — Vacine seu combustível",
  description:
    "Sachê 10ml para motos. Elimina umidade, melhora a combustão e limpa o motor a cada abastecimento.",
};

export default function CheckoutSachePage() {
  return (
    <main className="h-dvh flex flex-col bg-verde-escuro relative overflow-hidden">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.06] pointer-events-none select-none"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
        aria-hidden="true"
      />

      {/* ── Header ── */}
      <header className="relative z-10 shrink-0 flex items-center justify-between px-5 sm:px-8 py-3.5 border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* Back to LP */}
          <a
            href="/sache"
            aria-label="Voltar para CarboZé Moto"
            className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 text-off-white/60 hover:text-off-white hover:border-white/40 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </a>
          <Image
            src="/logo-carboze-moto-white.svg"
            alt="CarboZé"
            width={140}
            height={32}
            priority
            className="h-7 w-auto"
          />
        </div>
        <div className="flex items-center gap-2 text-off-white/70 text-xs font-[family-name:var(--font-barlow)] font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-limao shrink-0"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Compra 100% segura
        </div>
      </header>

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-6 gap-5 min-h-0">
        {/* Product badge */}
        <span className="inline-flex items-center gap-1.5 bg-limao/10 border border-limao/30 text-limao text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full font-[family-name:var(--font-barlow)] whitespace-nowrap">
          CarboZé Moto — Sachê 10ml
        </span>

        {/* Heading */}
        <div className="text-center space-y-1.5">
          <h1 className="font-[family-name:var(--font-barlow)] font-extrabold text-2xl sm:text-3xl text-off-white uppercase leading-tight tracking-tight">
            Escolha seu Kit
          </h1>
          <p className="text-off-white/50 text-sm">
            1 sachê por abastecimento · proteção real a cada tanque
          </p>
        </div>

        {/* 2×2 kit grid */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          {CHECKOUT_MOTOS.map((opt) => (
            <a
              key={opt.qty}
              href={opt.url}
              className={[
                "relative border-2 rounded-2xl p-4 flex flex-col gap-1.5",
                "transition-all duration-200 hover:scale-[1.02] group",
                "bg-white/[0.03] hover:bg-white/[0.06]",
                opt.popular
                  ? "border-limao"
                  : "border-white/15 hover:border-limao",
              ].join(" ")}
            >
              {opt.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-limao text-verde-escuro text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full font-[family-name:var(--font-barlow)] whitespace-nowrap">
                  Mais popular
                </span>
              )}

              <p className="font-[family-name:var(--font-barlow)] font-extrabold text-sm uppercase text-off-white/90 tracking-wide">
                {opt.label}
              </p>
              <p className="text-xs text-off-white/40">
                {opt.sachets} sachês · {opt.sachets} tanques
              </p>
              <p className="font-[family-name:var(--font-barlow)] font-extrabold text-[1.6rem] leading-none text-off-white mt-1.5">
                {opt.price}
              </p>
              <p className="text-xs text-off-white/40">à vista · R$ 5,99/tanque</p>

              <span className="mt-2.5 block text-center font-[family-name:var(--font-barlow)] font-bold uppercase text-xs py-2 rounded-full bg-limao text-verde-escuro transition-all duration-200 group-hover:bg-verde-medio group-hover:text-white">
                COMPRAR AGORA
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* ── Trust footer ── */}
      <footer className="relative z-10 shrink-0 flex items-center justify-center flex-wrap gap-x-3 sm:gap-x-5 gap-y-1 px-4 py-3 border-t border-white/10 text-off-white/35 text-xs font-[family-name:var(--font-barlow)]">
        <span>PIX</span>
        <span className="text-off-white/20" aria-hidden="true">·</span>
        <span>Cartão de crédito</span>
        <span className="text-off-white/20" aria-hidden="true">·</span>
        <span>Entrega em todo Brasil</span>
      </footer>
    </main>
  );
}
