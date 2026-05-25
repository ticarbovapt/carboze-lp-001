import Image from "next/image";
import CTAButton from "../CTAButton";
import { WHATSAPP_URL, SOCIAL_LINKS } from "@/lib/constants";

export default function CTAFinal100() {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start mb-16">
          {/* Esquerda */}
          <div>
            <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-6xl leading-tight tracking-wide mb-8">
              Seu veículo trabalha todo dia.{" "}
              <span className="text-limao">
                Ele precisa de proteção todo dia também.
              </span>
            </h2>
            <CTAButton label="QUERO O PACK 100ML" size="large" href="/checkoutpack100" />
          </div>

          {/* Direita: imagem produto */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-white/5 aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/produto-dobra8.png"
              alt="CarboZé — Pack 100ml"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/15 pt-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="flex flex-col gap-3 font-[family-name:var(--font-archivo)]">
            <p className="text-white/60 text-sm">
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
            <p className="text-white/50 text-sm">
              Disponível também no{" "}
              <a
                href="#"
                className="text-white/70 hover:text-limao transition-colors"
              >
                Mercado Livre
              </a>
              {" · "}
              <a
                href="#"
                className="text-white/70 hover:text-limao transition-colors"
              >
                Shopee
              </a>
              {" · "}
              <a
                href="#"
                className="text-white/70 hover:text-limao transition-colors"
              >
                TikTok Shop
              </a>
            </p>
            <div className="flex gap-5 text-sm">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-limao transition-colors"
              >
                @ocarboze
              </a>
              <a
                href={SOCIAL_LINKS.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-limao transition-colors"
              >
                carboze.com.br
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-limao transition-colors"
              >
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
              className="h-8 w-auto opacity-80"
            />
            <p className="font-[family-name:var(--font-archivo)] text-white/30 text-xs">
              © 2025 Carbozé. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
