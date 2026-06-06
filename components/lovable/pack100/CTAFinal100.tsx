import Image from "next/image";
import CTAButton from "../CTAButton";
import { WHATSAPP_URL, SOCIAL_LINKS } from "@/lib/constants";

export default function CTAFinal100() {
  return (
    <>
      {/* ── CTA principal — bg branco ────────────────────── */}
      <section className="bg-white pt-16 md:pt-24 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10">

          {/* H1 de ponta a ponta */}
          <h1 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.95] mb-6">
            O preço do combustível não vai mudar.{" "}
            <span className="text-verde-medio">Mas o quanto você aproveita dele é escolha sua!</span>
          </h1>

          <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
            Você pode continuar deixando o tanque engolir umidade e desperdiçar dinheiro em uma queima incompleta, ou pode otimizar seu combustível com engenharia real. Proteção e economia máxima direto no tanque.
          </p>

          {/* CTA + imagem produto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <CTAButton label="COMPRAR AGORA" size="large" href="/checkoutpack100" />

            <div className="w-full rounded-2xl overflow-hidden bg-verde-escuro border border-verde-escuro/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/cz-pack100-cta.png"
                alt="CarboZé — Pack 100ml"
                className="w-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer — barra verde ────────────────────────── */}
      <footer className="bg-verde-escuro py-8">
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

          {/* Links esquerda */}
          <div className="flex flex-col gap-2.5 font-[family-name:var(--font-archivo)]">
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
                Amazon
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

          {/* Logo + copyright direita */}
          <div className="flex flex-col items-start sm:items-end gap-2">
            <Image
              src="/logo-header.png"
              alt="CarboZé"
              width={1147}
              height={198}
              className="h-6 w-auto opacity-80"
            />
            <p className="font-[family-name:var(--font-archivo)] text-white/20 text-xs">
              © 2025 Carbozé. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
