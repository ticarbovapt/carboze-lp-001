import Image from "next/image";
import { WHATSAPP_URL } from "@/lib/constants";

/* SVG icons para cada loja */
function MLIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
      <rect width="32" height="32" rx="8" fill="#FFE600"/>
      <path d="M8 22V12l8 6 8-6v10" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="16" cy="18" r="2.5" fill="#333"/>
    </svg>
  );
}

function ShopeeIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
      <rect width="32" height="32" rx="8" fill="#FF5722"/>
      <path d="M11 13a5 5 0 0110 0" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <rect x="8" y="14" width="16" height="11" rx="2" fill="white"/>
      <circle cx="13" cy="19" r="1.5" fill="#FF5722"/>
      <circle cx="19" cy="19" r="1.5" fill="#FF5722"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
      <rect width="32" height="32" rx="8" fill="#010101"/>
      <path d="M21 10c.5 2 2.5 3 4 3v3c-1.5 0-3-.5-4-1.5V20a5 5 0 11-5-5v3a2 2 0 102 2v-10h3z" fill="white"/>
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
      <rect width="32" height="32" rx="8" fill="#093a30"/>
      <path d="M9 14l7-7 7 7v11H9V14z" stroke="#a9da00" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
      <rect x="13" y="19" width="6" height="6" rx="0.5" stroke="#a9da00" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

const stores = [
  {
    name: "Mercado Livre",
    Icon: MLIcon,
    href: "https://www.mercadolivre.com.br/",
    desc: "Compre pelo Mercado Livre com entrega rápida e proteção de compra",
    accent: "border-yellow-400/20 hover:border-yellow-400/50",
    dot: "bg-yellow-400",
  },
  {
    name: "Shopee",
    Icon: ShopeeIcon,
    href: "https://shopee.com.br/",
    desc: "Disponível na Shopee — frete grátis nas melhores ofertas",
    accent: "border-orange-400/20 hover:border-orange-400/50",
    dot: "bg-orange-400",
  },
  {
    name: "TikTok Shop",
    Icon: TikTokIcon,
    href: "https://www.tiktok.com/",
    desc: "Encontre no TikTok Shop com reviews reais de quem já usou",
    accent: "border-white/10 hover:border-white/30",
    dot: "bg-white",
  },
  {
    name: "Loja Online Oficial",
    Icon: StoreIcon,
    href: "/choice",
    desc: "Compre diretamente no nosso site — melhor preço garantido",
    accent: "border-limao/25 hover:border-limao/60",
    dot: "bg-limao",
    featured: true,
  },
];

export default function LojasPage() {
  return (
    <main className="min-h-dvh bg-off-white flex flex-col">
      {/* Header */}
      <header className="w-full bg-verde-escuro px-6 sm:px-10 py-4 flex items-center justify-between">
        <a href="/">
          <Image
            src="/logo-carboze-1.png"
            alt="CarboZé"
            width={160}
            height={36}
            priority
            className="h-8 w-auto brightness-0 invert"
          />
        </a>
        <a
          href="/"
          className="font-[family-name:var(--font-archivo)] text-white/40 text-xs hover:text-white/70 transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Voltar
        </a>
      </header>

      {/* Hero */}
      <section className="bg-verde-escuro pt-14 pb-20 px-6 sm:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-[family-name:var(--font-archivo)] text-white/30 text-xs tracking-[0.15em] uppercase mb-5">
            Onde Encontrar
          </p>
          <h1 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-white text-4xl sm:text-5xl md:text-6xl leading-tight">
            Disponível em<br />
            <span className="text-limao">vários canais.</span>
          </h1>
          <p className="font-[family-name:var(--font-archivo)] text-white/50 text-base mt-5 max-w-md mx-auto leading-relaxed">
            Escolha a plataforma de sua preferência e garanta o seu pack.
          </p>
        </div>
      </section>

      {/* Stores list */}
      <section className="max-w-xl mx-auto w-full px-5 -mt-5 pb-16">
        <div className="flex flex-col gap-3">
          {stores.map((store) => (
            <a
              key={store.name}
              href={store.href}
              target={store.href.startsWith("http") ? "_blank" : undefined}
              rel={store.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`flex items-center gap-5 p-5 rounded-2xl border bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group ${store.accent} ${store.featured ? "ring-1 ring-limao/20" : ""}`}
            >
              {/* Icon */}
              <div className="shrink-0 w-13 h-13 flex items-center justify-center">
                <store.Icon />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-[family-name:var(--font-barlow)] font-bold text-verde-escuro text-base">
                    {store.name}
                  </p>
                  {store.featured && (
                    <span className="bg-limao text-verde-escuro text-[10px] font-[family-name:var(--font-barlow)] font-bold px-2 py-0.5 rounded-full">
                      Recomendado
                    </span>
                  )}
                </div>
                <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/50 text-sm leading-snug">
                  {store.desc}
                </p>
              </div>

              {/* Chevron */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="w-5 h-5 text-verde-escuro/20 group-hover:text-verde-escuro/50 group-hover:translate-x-0.5 transition-all shrink-0"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-verde-escuro/8 my-10" />

        {/* WhatsApp CTA */}
        <div className="text-center">
          <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/50 text-sm mb-4">
            Dúvida sobre qual canal escolher?
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#25D366] text-white font-[family-name:var(--font-barlow)] font-bold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity active:scale-[0.98] shadow-md shadow-green-900/20"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar com atendimento
          </a>
        </div>
      </section>
    </main>
  );
}
