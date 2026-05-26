import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "CarboZé — Vacine seu combustível",
  description: "CarboZé para Moto (sachê 10ml) ou para Carro (frasco 100ml). Escolha o ideal para você.",
};

/* SVG icons inline — moto e carro minimalistas */
function MotoIcon() {
  return (
    <svg viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-auto">
      <circle cx="10" cy="20" r="6" stroke="currentColor" strokeWidth="2.2" fill="none"/>
      <circle cx="38" cy="20" r="6" stroke="currentColor" strokeWidth="2.2" fill="none"/>
      <path d="M16 20h6l4-10h8l4 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 10l-2-6h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M30 16h4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}

function CarIcon() {
  return (
    <svg viewBox="0 0 52 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-auto">
      <rect x="4" y="12" width="44" height="10" rx="3" stroke="currentColor" strokeWidth="2.2" fill="none"/>
      <path d="M8 12l5-8h22l5 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="14" cy="22" r="4" stroke="currentColor" strokeWidth="2.2" fill="none"/>
      <circle cx="38" cy="22" r="4" stroke="currentColor" strokeWidth="2.2" fill="none"/>
      <path d="M4 16h44" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4"/>
    </svg>
  );
}

export default function ChoicePage() {
  return (
    <main className="h-dvh flex flex-col bg-verde-escuro relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 pointer-events-none select-none"
        style={{ backgroundImage: "url('/cz-choice-bg.jpg')" }}
        aria-hidden="true"
      />
      {/* Overlay para legibilidade dos cards */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(9,58,48,0.60)" }}
        aria-hidden="true"
      />

      {/* Header */}
      <header className="relative z-10 shrink-0 flex items-center justify-between px-6 sm:px-10 py-4 border-b border-white/8">
        <div className="flex items-center gap-3">
          <a
            href="/"
            aria-label="Voltar para a página inicial"
            className="flex items-center justify-center w-8 h-8 rounded-full border border-white/15 text-white/40 hover:text-white hover:border-white/30 transition-all"
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
        <div className="flex items-center gap-2 text-white/40 text-xs font-[family-name:var(--font-archivo)]">
          {/* Shield icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-limao shrink-0" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Compra 100% segura
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-8 gap-8 min-h-0">

        {/* Label */}
        <p className="font-[family-name:var(--font-archivo)] text-white/35 text-xs tracking-[0.15em] uppercase">
          CarboZé — Escolha seu produto
        </p>

        {/* Heading */}
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-barlow)] font-extrabold text-3xl sm:text-4xl text-white uppercase leading-tight tracking-tight">
            Para qual veículo?
          </h1>
          <p className="text-white/40 text-sm mt-2 font-[family-name:var(--font-archivo)]">
            Temos a fórmula certa para cada motor
          </p>
        </div>

        {/* 2-column card grid */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          {/* Moto card */}
          <a
            href="/checkoutsache"
            className="relative rounded-2xl p-6 flex flex-col gap-3 transition-all duration-200 group bg-white/[0.04] hover:bg-white/[0.08] hover:shadow-xl hover:shadow-limao/10 hover:-translate-y-0.5 border border-white/8 hover:border-limao/30"
          >
            <span className="text-white/60 group-hover:text-limao transition-colors">
              <MotoIcon />
            </span>
            <div>
              <p className="font-[family-name:var(--font-barlow)] font-extrabold text-lg uppercase text-white tracking-wide">
                Moto
              </p>
              <p className="text-xs text-white/35 leading-relaxed mt-0.5 font-[family-name:var(--font-archivo)]">
                Sachê 10ml<br />a partir de R$ 59,90
              </p>
            </div>
            <span className="mt-1 block text-center font-[family-name:var(--font-barlow)] font-bold uppercase text-xs py-2.5 rounded-xl bg-limao text-verde-escuro transition-all duration-200 group-hover:brightness-110">
              Quero para moto
            </span>
          </a>

          {/* Carro card — featured */}
          <a
            href="/checkoutpack100"
            className="relative rounded-2xl p-6 flex flex-col gap-3 transition-all duration-200 group bg-white/[0.04] hover:bg-white/[0.08] hover:shadow-xl hover:shadow-limao/10 hover:-translate-y-0.5 border border-limao/25 hover:border-limao/50"
          >
            {/* Ribbon "Mais vendido" */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-limao rounded-t-2xl" />
            <span className="absolute top-3 right-3 bg-limao/15 text-limao text-[9px] font-[family-name:var(--font-barlow)] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
              + Vendido
            </span>
            <span className="text-white/60 group-hover:text-limao transition-colors">
              <CarIcon />
            </span>
            <div>
              <p className="font-[family-name:var(--font-barlow)] font-extrabold text-lg uppercase text-white tracking-wide">
                Carro
              </p>
              <p className="text-xs text-white/35 leading-relaxed mt-0.5 font-[family-name:var(--font-archivo)]">
                Frasco 100ml<br />a partir de R$ 149,50
              </p>
            </div>
            <span className="mt-1 block text-center font-[family-name:var(--font-barlow)] font-bold uppercase text-xs py-2.5 rounded-xl bg-limao text-verde-escuro transition-all duration-200 group-hover:brightness-110">
              Quero para carro
            </span>
          </a>
        </div>
      </div>

      {/* Trust footer */}
      <footer className="relative z-10 shrink-0 flex items-center justify-center flex-wrap gap-x-5 gap-y-1 px-5 py-3.5 border-t border-white/8">
        {/* PIX icon */}
        <span className="flex items-center gap-1.5 text-white/30 text-xs font-[family-name:var(--font-archivo)]">
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 opacity-60">
            <path d="M10 2L13.5 5.5M10 2L6.5 5.5M10 2V10M10 18L13.5 14.5M10 18L6.5 14.5M10 18V10M2 10L5.5 13.5M2 10L5.5 6.5M2 10H10M18 10L14.5 13.5M18 10L14.5 6.5M18 10H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          PIX
        </span>
        <span className="text-white/15" aria-hidden="true">·</span>
        {/* Card icon */}
        <span className="flex items-center gap-1.5 text-white/30 text-xs font-[family-name:var(--font-archivo)]">
          <svg viewBox="0 0 20 14" fill="none" className="w-4 h-4 opacity-60">
            <rect x="1" y="1" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M1 5h18" stroke="currentColor" strokeWidth="1.4"/>
            <rect x="3" y="8" width="4" height="2" rx="0.5" fill="currentColor" opacity="0.5"/>
          </svg>
          Cartão de crédito
        </span>
        <span className="text-white/15" aria-hidden="true">·</span>
        {/* Truck icon */}
        <span className="flex items-center gap-1.5 text-white/30 text-xs font-[family-name:var(--font-archivo)]">
          <svg viewBox="0 0 22 16" fill="none" className="w-4 h-4 opacity-60">
            <path d="M1 1h13v10H1zM14 4h4l3 4v3h-7V4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
            <circle cx="5" cy="13" r="2" stroke="currentColor" strokeWidth="1.4"/>
            <circle cx="17" cy="13" r="2" stroke="currentColor" strokeWidth="1.4"/>
          </svg>
          Entrega em todo Brasil
        </span>
      </footer>
    </main>
  );
}
