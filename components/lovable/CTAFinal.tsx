import Image from "next/image";
import CTAButton from "./CTAButton";
import { WHATSAPP_URL, SOCIAL_LINKS } from "@/lib/constants";

export default function CTAFinal() {
  return (
    <>
      {/* Transição suave off-white → verde-escuro */}
      <div className="h-20 bg-gradient-to-b from-off-white to-verde-escuro" aria-hidden="true" />

      <section className="bg-verde-escuro pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          {/* Grid: headline + CTA (esq) | imagem produto (dir) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start mb-16">
            {/* Esquerda */}
            <div>
              <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-4xl sm:text-5xl md:text-6xl leading-tight mb-10">
                <span className="block">Sua moto trabalha todo dia.</span>
                <span className="block text-limao">
                  Ela precisa de proteção todo dia também.
                </span>
              </h2>

              {/* Preço em tipografia pura — sem card genérico */}
              <div className="mb-10">
                <p className="font-[family-name:var(--font-archivo)] text-white/30 text-xs tracking-[0.12em] uppercase mb-1">
                  Pack com 10 sachês
                </p>
                <p className="font-[family-name:var(--font-basement)] font-extrabold text-limao text-6xl md:text-7xl leading-none">
                  R$ 59,90
                </p>
                <p className="font-[family-name:var(--font-archivo)] text-white/30 text-sm mt-2">
                  10 sachês · 10 tanques · R$ 5,99/tanque
                </p>
              </div>

              <CTAButton label="QUERO MEU PACK" size="large" href="/checkoutsache" />
            </div>

            {/* Direita: imagem produto */}
            <div className="relative w-full rounded-2xl overflow-hidden aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/lp-produto-secao8.png"
                alt="CarboZé — Pack 10 sachês"
                className="w-full h-full object-cover"
              />
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
                <a href="/checkoutsache" className="text-white/55 hover:text-limao transition-colors">
                  Mercado Livre
                </a>
                {" · "}
                <a href="/checkoutsache" className="text-white/55 hover:text-limao transition-colors">
                  Shopee
                </a>
                {" · "}
                <a href="/checkoutsache" className="text-white/55 hover:text-limao transition-colors">
                  TikTok Shop
                </a>
              </p>
              <div className="flex gap-5 text-sm">
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/35 hover:text-limao transition-colors"
                >
                  @ocarboze
                </a>
                <a
                  href={SOCIAL_LINKS.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/35 hover:text-limao transition-colors"
                >
                  carboze.com.br
                </a>
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/35 hover:text-limao transition-colors"
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
