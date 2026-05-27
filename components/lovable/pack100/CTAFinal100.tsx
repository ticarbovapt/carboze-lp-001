import Image from "next/image";
import CTAButton from "../CTAButton";
import { WHATSAPP_URL, SOCIAL_LINKS } from "@/lib/constants";

export default function CTAFinal100() {
  return (
    <>
      {/* Transição suave → verde-escuro */}
      <div className="h-20 bg-gradient-to-b from-verde-escuro to-verde-escuro" aria-hidden="true" />

      <section className="bg-verde-escuro pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start mb-16">
            {/* Esquerda */}
            <div>
              <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-4xl sm:text-5xl md:text-6xl leading-tight mb-10">
                <span className="block">
                  O combustível brasileiro não vai mudar, o meio ambiente precisa dessa
                  composição para sobreviver.
                </span>
                <span className="block text-limao mt-3">
                  O seu combustível, do CarboZé para se proteger.
                </span>
              </h2>

              <CTAButton label="QUERO O PACK 100ML" size="large" href="/checkoutpack100" />
            </div>

            {/* Direita: imagem produto + badge */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-white/[0.03] aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/cz-pack100-cta.png"
                alt="CarboZé — Pack 100ml"
                className="w-full h-full object-contain"
              />
              {/* Badge preço */}
              <div className="absolute bottom-4 left-4 right-4 bg-verde-escuro/85 rounded-xl p-4 text-center">
                <p className="font-[family-name:var(--font-archivo)] text-white/60 text-[10px] uppercase tracking-widest mb-1">
                  Frasco 100ml
                </p>
                <p className="font-[family-name:var(--font-basement)] font-extrabold text-limao text-3xl leading-none">
                  R$ 149,90
                </p>
                <p className="font-[family-name:var(--font-archivo)] text-white/40 text-xs mt-1">
                  Trata até 100L · R$ 1,49/litro protegido
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="flex flex-col gap-3 font-[family-name:var(--font-archivo)]">
              <p className="text-white/50 text-sm">
                Dúvidas?{" "}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-limao hover:underline"
                >
                  WhatsApp 11 4000-2112
                </a>
              </p>
              <p className="text-white/35 text-sm">
                Disponível também no{" "}
                <a href="#" className="text-white/55 hover:text-limao transition-colors">
                  Mercado Livre
                </a>
                {" · "}
                <a href="#" className="text-white/55 hover:text-limao transition-colors">
                  Shopee
                </a>
                {" · "}
                <a href="#" className="text-white/55 hover:text-limao transition-colors">
                  TikTok Shop
                </a>
              </p>
              <div className="flex gap-5 text-sm">
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-white/35 hover:text-limao transition-colors">
                  @ocarboze
                </a>
                <a href={SOCIAL_LINKS.website} target="_blank" rel="noopener noreferrer" className="text-white/35 hover:text-limao transition-colors">
                  carboze.com.br
                </a>
                <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-white/35 hover:text-limao transition-colors">
                  YT: @carboze
                </a>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2">
              <Image
                src="/logo-footer.png"
                alt="CarboZé"
                width={1920}
                height={1080}
                className="h-8 w-auto opacity-60"
              />
              <p className="font-[family-name:var(--font-archivo)] text-white/20 text-xs">
                © 2025 Carbozé. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
