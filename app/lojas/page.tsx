import Image from "next/image";
import { WHATSAPP_URL } from "@/lib/constants";

const stores = [
  {
    name: "Mercado Livre",
    icon: "🛒",
    href: "https://www.mercadolivre.com.br/",
    desc: "Compre pelo Mercado Livre com entrega rápida",
    color: "bg-yellow-400/10 border-yellow-400/30",
    textColor: "text-yellow-400",
  },
  {
    name: "Shopee",
    icon: "🛍️",
    href: "https://shopee.com.br/",
    desc: "Disponível na Shopee — frete grátis nas melhores ofertas",
    color: "bg-orange-400/10 border-orange-400/30",
    textColor: "text-orange-400",
  },
  {
    name: "TikTok Shop",
    icon: "🎵",
    href: "https://www.tiktok.com/",
    desc: "Encontre no TikTok Shop com reviews reais",
    color: "bg-pink-400/10 border-pink-400/30",
    textColor: "text-pink-400",
  },
  {
    name: "Loja Online Oficial",
    icon: "⚡",
    href: "/choice",
    desc: "Compre diretamente no site — melhor preço garantido",
    color: "bg-limao/10 border-limao/30",
    textColor: "text-limao",
    featured: true,
  },
];

export default function LojasPage() {
  return (
    <main className="min-h-dvh bg-off-white flex flex-col">
      {/* Header */}
      <header className="w-full bg-verde-escuro px-5 py-4 flex items-center justify-between">
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
          className="font-[family-name:var(--font-archivo)] text-white/60 text-sm hover:text-limao transition-colors"
        >
          ← Voltar
        </a>
      </header>

      {/* Hero */}
      <section className="bg-verde-escuro pt-10 pb-16 px-5 text-center">
        <p className="font-[family-name:var(--font-barlow)] font-bold uppercase text-limao/70 text-xs tracking-widest mb-4">
          Onde Encontrar
        </p>
        <h1 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight max-w-xl mx-auto">
          CarboZé está disponível em
          <span className="text-limao block">vários canais.</span>
        </h1>
        <p className="font-[family-name:var(--font-archivo)] text-white/60 text-base mt-4 max-w-md mx-auto">
          Escolha a plataforma de sua preferência e garanta já o seu pack.
        </p>
      </section>

      {/* Stores grid */}
      <section className="max-w-2xl mx-auto w-full px-5 -mt-6 pb-16">
        <div className="flex flex-col gap-4">
          {stores.map((store) => (
            <a
              key={store.name}
              href={store.href}
              target={store.href.startsWith("http") ? "_blank" : undefined}
              rel={store.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`flex items-center gap-5 p-5 rounded-2xl border ${store.color} bg-white hover:shadow-md transition-all active:scale-[0.99] group ${store.featured ? "ring-2 ring-limao/40" : ""}`}
            >
              <div className="shrink-0 w-14 h-14 rounded-xl bg-verde-escuro/5 flex items-center justify-center text-2xl">
                {store.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`font-[family-name:var(--font-barlow)] font-bold text-verde-escuro text-base`}>
                    {store.name}
                  </p>
                  {store.featured && (
                    <span className="bg-limao text-verde-escuro text-xs font-[family-name:var(--font-barlow)] font-bold px-2 py-0.5 rounded-full">
                      Recomendado
                    </span>
                  )}
                </div>
                <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm mt-0.5">
                  {store.desc}
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-5 h-5 text-verde-escuro/30 group-hover:text-verde-escuro/60 transition-colors shrink-0"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-verde-escuro/10 my-10" />

        {/* WhatsApp CTA */}
        <div className="text-center">
          <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm mb-4">
            Dúvida sobre qual canal escolher?
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-[family-name:var(--font-barlow)] font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity active:scale-[0.98]"
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
