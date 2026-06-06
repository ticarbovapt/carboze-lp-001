import Image from "next/image";
import LovableHeader from "@/components/LovableHeader";
import FloatingWhatsApp from "@/components/lovable/FloatingWhatsApp";
import { WHATSAPP_URL } from "@/lib/constants";

function StoreIcon() {
  return (
    <div className="w-12 h-12 rounded-xl bg-limao/10 border border-limao/20 flex items-center justify-center">
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-limao" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    </div>
  );
}

const stores = [
  {
    id: "oficial",
    name: "Loja Online Oficial",
    desc: "Melhor preço garantido · compra direta",
    href: "/choice",
    featured: true,
    icon: <StoreIcon />,
    accent: "border-limao ring-1 ring-limao/20 bg-limao/[0.04] hover:bg-limao/[0.07]",
  },
  {
    id: "ml",
    name: "Mercado Livre",
    desc: "Entrega rápida e proteção de compra",
    href: "https://www.mercadolivre.com.br/",
    featured: false,
    icon: (
      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-1 shadow-sm">
        <Image
          src="/ML.png"
          alt="Mercado Livre"
          width={156}
          height={148}
          className="w-full h-full object-contain"
        />
      </div>
    ),
    accent: "border-white/15 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.05]",
  },
  {
    id: "amazon",
    name: "Amazon",
    desc: "Entrega rápida e devolução garantida",
    href: "https://www.amazon.com.br/",
    featured: false,
    icon: (
      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-1 shadow-sm">
        <Image
          src="/amazon.png"
          alt="Amazon"
          width={161}
          height={148}
          className="w-full h-full object-contain"
        />
      </div>
    ),
    accent: "border-white/15 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.05]",
  },
];

export default function LojaPage() {
  return (
    <main className="h-dvh flex flex-col bg-verde-escuro overflow-hidden">
      {/* Header — só logo */}
      <LovableHeader hideNav={true} />

      {/* Conteúdo centralizado */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-6 gap-6 min-h-0">

        {/* Label + headline */}
        <div className="text-center">
          <p className="font-[family-name:var(--font-archivo)] text-white/30 text-[11px] tracking-[0.18em] uppercase mb-2">
            Onde Encontrar
          </p>
          <h1 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight">
            Disponível em{" "}
            <span className="text-limao">vários canais.</span>
          </h1>
          <p className="font-[family-name:var(--font-archivo)] text-white/40 text-sm mt-2">
            Escolha a plataforma de sua preferência e garanta o seu pack.
          </p>
        </div>

        {/* Store cards — grid 3×1 horizontal */}
        <div className="w-full max-w-2xl grid grid-cols-3 gap-4">
          {stores.map((store) => (
            <a
              key={store.id}
              href={store.href}
              target={store.href.startsWith("http") ? "_blank" : undefined}
              rel={store.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 group ${store.accent}`}
            >
              {/* Icon / logo */}
              <div className="flex items-center justify-center w-12 h-12">
                {store.icon}
              </div>

              {/* Name + badge */}
              <div className="text-center">
                <p className="font-[family-name:var(--font-basement)] font-bold text-off-white text-sm leading-tight">
                  {store.name}
                </p>
                {store.featured && (
                  <span className="inline-block mt-1 bg-limao text-verde-escuro text-[10px] font-[family-name:var(--font-basement)] font-bold px-2 py-0.5 rounded-full leading-none">
                    Recomendado
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="font-[family-name:var(--font-archivo)] text-white/40 text-xs text-center leading-snug">
                {store.desc}
              </p>
            </a>
          ))}
        </div>

        {/* WhatsApp inline */}
        <p className="font-[family-name:var(--font-archivo)] text-white/30 text-xs">
          Dúvidas?{" "}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-limao hover:underline"
          >
            WhatsApp
          </a>
        </p>
      </div>

      {/* Footer mínimo */}
      <footer className="shrink-0 border-t border-white/10 py-4">
        <div className="max-w-2xl mx-auto px-5 flex items-center justify-between">
          <Image
            src="/logo-header.png"
            alt="CarboZé"
            width={1147}
            height={198}
            className="h-6 w-auto opacity-60"
          />
          <p className="font-[family-name:var(--font-archivo)] text-white/20 text-xs">
            © 2025 CarboZé. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      <FloatingWhatsApp />
    </main>
  );
}
