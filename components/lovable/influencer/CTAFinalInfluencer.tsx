import Image from "next/image";
import CTAButton from "@/components/lovable/CTAButton";
import { WHATSAPP_URL, SOCIAL_LINKS } from "@/lib/constants";

interface CTAFinalInfluencerProps {
  motoHref?: string;
  carroHref?: string;
  motoLabel?: string;
  carroLabel?: string;
}

export default function CTAFinalInfluencer({
  motoHref = "/checkoutsache-influencer",
  carroHref = "/checkoutpack100-influencer",
  motoLabel = "Comprar para minha Moto",
  carroLabel = "Comprar para meu Carro",
}: CTAFinalInfluencerProps) {
  return (
    <section className="bg-verde-escuro pt-16 md:pt-24 pb-16 md:pb-20">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Headline + CTAs */}
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-2xl sm:text-3xl md:text-4xl leading-tight mb-6">
            O preço do combustível não vai mudar.{" "}
            <span className="text-limao">Mas o quanto você aproveita dele é escolha sua!</span>
          </h2>
          <p className="font-[family-name:var(--font-archivo)] text-white/55 text-base md:text-lg leading-relaxed mb-10">
            Você pode continuar deixando o tanque engolir umidade e desperdiçar dinheiro em uma queima incompleta, ou pode otimizar seu combustível com engenharia real. Proteção e economia máxima direto no tanque.
          </p>

          <div className="flex flex-col w-full max-w-sm mx-auto gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
            <a
              href={motoHref}
              className="w-full sm:w-auto text-center font-[family-name:var(--font-basement)] font-bold uppercase tracking-wide rounded-full bg-limao text-verde-escuro px-10 py-4 text-base transition-all hover:brightness-110 active:scale-95"
            >
              {motoLabel}
            </a>
            <a
              href={carroHref}
              className="w-full sm:w-auto text-center font-[family-name:var(--font-basement)] font-bold uppercase tracking-wide rounded-full border-2 border-limao text-limao px-10 py-4 text-base transition-all hover:bg-limao hover:text-verde-escuro active:scale-95"
            >
              {carroLabel}
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="flex flex-col gap-3 font-[family-name:var(--font-archivo)]">
            <p className="text-white/50 text-sm">
              Dúvidas?{" "}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-limao hover:underline">
                WhatsApp 11 4000-2112
              </a>
            </p>
            <div className="flex gap-5 text-sm">
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-white/55 hover:text-limao transition-colors">@ocarboze</a>
              <a href={SOCIAL_LINKS.website} target="_blank" rel="noopener noreferrer" className="text-white/55 hover:text-limao transition-colors">carboze.com.br</a>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <Image src="/logo-header.png" alt="CarboZé" width={1147} height={198} className="h-6 w-auto opacity-80" />
            <p className="font-[family-name:var(--font-archivo)] text-white/20 text-xs">© 2025 Carbozé. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
