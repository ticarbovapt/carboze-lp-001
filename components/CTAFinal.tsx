import Image from "next/image";
import QuantityPicker from "./QuantityPicker";
import { WHATSAPP_URL, SOCIAL_LINKS, STORES } from "@/lib/constants";

export default function CTAFinal() {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5">
        <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-6xl leading-tight max-w-3xl mb-8">
          Sua moto trabalha todo dia.{" "}
          <span className="text-limao">
            Ela precisa de proteção todo dia também.
          </span>
        </h2>

        {/* Bloco de preço destacado */}
        <div className="mb-8">
          <div className="border border-white/20 rounded-2xl p-6 inline-block">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="font-[family-name:var(--font-barlow)] font-extrabold text-limao text-5xl md:text-6xl">
                R$ 59,90
              </span>
              <span className="font-[family-name:var(--font-archivo)] text-white/60 text-sm">
                Pack com 10 sachês
              </span>
            </div>
            <p className="font-[family-name:var(--font-archivo)] text-white/50 text-xs mt-2">
              10 sachês · 10 tanques · R$ 5,99/tanque
            </p>
          </div>
        </div>

        <div className="mb-12">
          <QuantityPicker variant="dark" />
        </div>

        <div className="border-t border-white/15 pt-8 mb-8">
          <p className="font-[family-name:var(--font-archivo)] text-white/60 text-sm mb-3">
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
          <p className="font-[family-name:var(--font-archivo)] text-white/50 text-sm">
            Disponível também no{" "}
            <a
              href={STORES.mercadolivre}
              className="text-white/70 hover:text-limao transition-colors"
            >
              Mercado Livre
            </a>
            {" · "}
            <a
              href={STORES.shopee}
              className="text-white/70 hover:text-limao transition-colors"
            >
              Shopee
            </a>
            {" · "}
            <a
              href={STORES.tiktokshop}
              className="text-white/70 hover:text-limao transition-colors"
            >
              TikTok Shop
            </a>
          </p>
        </div>

        <div className="border-t border-white/15 pt-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="flex gap-5 font-[family-name:var(--font-archivo)] text-sm">
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

          <div className="flex flex-col items-start sm:items-end gap-2">
            <Image
              src="/logo-carboze-moto-white.svg"
              alt="CarboZé"
              width={160}
              height={32}
              className="h-7 w-auto opacity-70"
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
