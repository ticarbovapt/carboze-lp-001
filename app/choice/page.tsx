"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FloatingWhatsApp from "@/components/lovable/FloatingWhatsApp";

/* ─── SVG Icons ──────────────────────────────────────────── */
function MotoIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 56 32" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={`w-14 h-auto transition-all duration-300 ${active ? "scale-110" : ""}`}>
      <circle cx="11" cy="23" r="7" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <circle cx="45" cy="23" r="7" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <path d="M18 23h7l5-12h10l5 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M25 11l-3-8h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M36 18h5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function CarIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 60 32" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={`w-14 h-auto transition-all duration-300 ${active ? "scale-110" : ""}`}>
      <rect x="4" y="14" width="52" height="12" rx="3.5" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <path d="M9 14l6-10h30l6 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="16" cy="26" r="4.5" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <circle cx="44" cy="26" r="4.5" stroke="currentColor" strokeWidth="2.5" fill="none"/>
    </svg>
  );
}

/* ─── Check mark ─────────────────────────────────────────── */
function CheckCircle() {
  return (
    <div className="w-6 h-6 rounded-full bg-limao flex items-center justify-center shrink-0">
      <svg viewBox="0 0 12 12" fill="none" className="w-3.5 h-3.5">
        <path d="M2 6l3 3 5-5" stroke="#093a30" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

const PRODUCTS = [
  {
    id: "moto",
    label: "Para motos",
    title: "KIT 10 SACHÊS",
    subtitle: "10 sachês de 10ml · 1 por abastecimento",
    unitPrice: "R$ 59,90",
    unitLabel: "Kit com 10 sachês de 10ml",
    kitInfo: "R$ 5,99 por sachê · Frete grátis · trata até 100 L",
    benefits: ["Elimina umidade do combustível", "Melhora ignição a frio", "Limpa bicos injetores"],
    href: "/checkoutsache",
    cta: "Quero para minha moto",
    icon: (active: boolean) => <MotoIcon active={active} />,
  },
  {
    id: "carro",
    label: "Para carros e caminhonetes",
    title: "KIT 5 FRASCOS",
    subtitle: "5 frascos de 100ml · trata até 100L cada",
    unitPrice: "R$ 149,50",
    unitLabel: "Kit com 5 frascos de 100ml",
    kitInfo: "R$ 29,90 por frasco · Frete grátis · trata até 500 L",
    benefits: ["Protege bicos injetores", "Reduz consumo de combustível", "Combate bactérias no diesel B15"],
    href: "/checkoutpack100",
    cta: "Quero para meu carro",
    icon: (active: boolean) => <CarIcon active={active} />,
  },
];

export default function ChoicePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const selectedProduct = PRODUCTS.find((p) => p.id === selected);

  function handleContinue() {
    if (selectedProduct) router.push(selectedProduct.href);
  }

  return (
    <main className="min-h-dvh flex flex-col bg-verde-escuro relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 pointer-events-none select-none"
        style={{ backgroundImage: "url('/cz-choice-bg.webp')" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(9,58,48,0.45) 0%, rgba(9,58,48,0.60) 100%)" }}
        aria-hidden="true"
      />

      {/* Header */}
      <header className="relative z-10 shrink-0 flex items-center justify-between px-6 sm:px-10 py-4 border-b border-white/8">
        <div className="flex items-center gap-3">
          <a href="/" aria-label="Voltar"
            className="flex items-center justify-center w-8 h-8 rounded-full border border-white/15 text-white/40 hover:text-white hover:border-white/30 transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </a>
          <Image src="/logo-header.png" alt="CarboZé" width={1147} height={198} priority className="h-8 w-auto"/>
        </div>
        <div className="flex items-center gap-2 text-white/40 text-xs font-[family-name:var(--font-archivo)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-limao">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Compra 100% segura
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-10 gap-8">

        {/* Heading */}
        <div className="text-center max-w-lg">
          <p className="font-[family-name:var(--font-archivo)] text-white/35 text-xs tracking-[0.18em] uppercase mb-4">
            CarboZé — Escolha seu produto
          </p>
          <h1 className="font-[family-name:var(--font-basement)] font-black text-white text-4xl sm:text-5xl uppercase leading-[0.9] tracking-tight mb-3">
            Qual é o seu<br />
            <span className="text-limao">veículo?</span>
          </h1>
          <p className="text-white/45 text-sm font-[family-name:var(--font-archivo)] leading-relaxed">
            Selecione abaixo — a fórmula certa faz diferença.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          {PRODUCTS.map((product) => {
            const isSelected = selected === product.id;
            return (
              <button
                key={product.id}
                onClick={() => setSelected(product.id)}
                className={`
                  relative text-left rounded-2xl p-6 flex flex-col gap-5
                  transition-all duration-300 cursor-pointer backdrop-blur-sm
                  ${isSelected
                    ? "bg-verde-escuro/80 border-2 border-limao shadow-[0_0_40px_rgba(169,218,0,0.22)] -translate-y-1"
                    : "bg-verde-escuro/65 border-2 border-white/20 hover:bg-verde-escuro/75 hover:border-white/35 hover:-translate-y-0.5"
                  }
                `}
              >
                {/* Selected indicator */}
                <div className={`absolute top-4 right-4 transition-all duration-300 ${isSelected ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
                  <CheckCircle />
                </div>

                {/* Label chip */}
                <span className={`
                  self-start text-[10px] font-[family-name:var(--font-archivo)] uppercase tracking-widest px-3 py-1 rounded-full transition-colors duration-300
                  ${isSelected ? "bg-limao/20 text-limao" : "bg-white/12 text-white/70"}
                `}>
                  {product.label}
                </span>

                {/* Icon */}
                <span className={`transition-colors duration-300 ${isSelected ? "text-limao" : "text-white/75"}`}>
                  {product.icon(isSelected)}
                </span>

                {/* Title */}
                <div>
                  <p className={`font-[family-name:var(--font-basement)] font-black text-2xl uppercase leading-tight transition-colors duration-300 ${isSelected ? "text-white" : "text-white"}`}>
                    {product.title}
                  </p>
                  <p className="font-[family-name:var(--font-archivo)] text-white/60 text-xs mt-0.5">
                    {product.subtitle}
                  </p>
                </div>

                {/* Benefits */}
                <ul className="flex flex-col gap-2">
                  {product.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isSelected ? "bg-limao" : "bg-white/50"}`}/>
                      <span className={`font-[family-name:var(--font-archivo)] text-xs leading-snug transition-colors duration-300 ${isSelected ? "text-white" : "text-white/80"}`}>
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className={`pt-4 border-t transition-colors duration-300 ${isSelected ? "border-limao/30" : "border-white/20"}`}>
                  <p className={`font-[family-name:var(--font-basement)] font-black text-4xl leading-none transition-colors duration-300 ${isSelected ? "text-limao" : "text-white"}`}>
                    {product.unitPrice}
                  </p>
                  <p className="font-[family-name:var(--font-archivo)] text-white/60 text-xs mt-0.5">
                    {product.unitLabel}
                  </p>
                  <p className="font-[family-name:var(--font-archivo)] text-white/35 text-[10px] mt-1.5">
                    {product.kitInfo}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA button */}
        <div className={`w-full max-w-2xl transition-all duration-500 ${selected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
          <button
            onClick={handleContinue}
            className="group w-full flex items-center justify-center gap-3 bg-limao text-verde-escuro font-[family-name:var(--font-basement)] font-black uppercase text-base py-5 rounded-2xl hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_8px_32px_rgba(169,218,0,0.25)] tracking-wide"
          >
            {selectedProduct?.cta ?? "Continuar"}
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform duration-200">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

      </div>

      <FloatingWhatsApp />

      {/* Trust footer */}
      <footer className="relative z-10 shrink-0 flex items-center justify-center flex-wrap gap-x-5 gap-y-1 px-5 py-3.5 border-t border-white/8">
        <span className="flex items-center gap-1.5 text-white/30 text-xs font-[family-name:var(--font-archivo)]">
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 opacity-60">
            <path d="M10 2L13.5 5.5M10 2L6.5 5.5M10 2V10M10 18L13.5 14.5M10 18L6.5 14.5M10 18V10M2 10L5.5 13.5M2 10L5.5 6.5M2 10H10M18 10L14.5 13.5M18 10L14.5 6.5M18 10H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          PIX
        </span>
        <span className="text-white/15" aria-hidden="true">·</span>
        <span className="flex items-center gap-1.5 text-white/30 text-xs font-[family-name:var(--font-archivo)]">
          <svg viewBox="0 0 20 14" fill="none" className="w-4 h-4 opacity-60">
            <rect x="1" y="1" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M1 5h18" stroke="currentColor" strokeWidth="1.4"/>
            <rect x="3" y="8" width="4" height="2" rx="0.5" fill="currentColor" opacity="0.5"/>
          </svg>
          Cartão de crédito
        </span>
        <span className="text-white/15" aria-hidden="true">·</span>
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
