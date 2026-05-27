import Image from "next/image";
import CTAButton from "./CTAButton";
import { WHATSAPP_URL, SOCIAL_LINKS } from "@/lib/constants";

export default function CTAFinal() {
  return (
    <>
      {/* Transição suave */}
      <div className="h-20 bg-gradient-to-b from-verde-escuro to-verde-escuro" aria-hidden="true" />

      <section className="bg-verde-escuro pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-6 md:px-10">

          {/* Conteúdo centralizado */}
          <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-16 gap-8">

            {/* Imagem produto — 3 sachês */}
            <div className="w-full rounded-2xl overflow-hidden bg-white/[0.03]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/lp-produto-secao8.png"
                alt="CarboZé — Pack 10 sachês"
                className="w-full object-contain"
              />
            </div>

            {/* Info produto */}
            <div>
              <p className="font-[family-name:var(--font-archivo)] text-limao text-xs uppercase tracking-widest mb-2">
                Pack com 10 sachês de 10ml
              </p>
              <p className="font-[family-name:var(--font-archivo)] text-white/50 text-sm mb-4">
                10 tanques completos de abastecimento protegidos
              </p>
              <p className="font-[family-name:var(--font-basement)] font-extrabold text-limao text-5xl md:text-6xl leading-none">
                R$ 59,90
              </p>
            </div>

            <CTAButton label="QUERO MEU PACK" size="large" href="/checkoutsache" />
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
