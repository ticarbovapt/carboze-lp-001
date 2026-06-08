import Image from "next/image";
import CTAButton from "@/components/lovable/CTAButton";
import { WHATSAPP_URL, SOCIAL_LINKS } from "@/lib/constants";

export default function CTAFinalInstitucional() {
  return (
    <section className="bg-verde-escuro pt-16 md:pt-24 pb-16 md:pb-20">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* CTA central */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-2xl sm:text-3xl md:text-4xl leading-tight mb-6">
            O preço do combustível não vai mudar.{" "}
            <span className="text-limao">Mas o quanto você aproveita dele é escolha sua!</span>
          </h2>
          <p className="font-[family-name:var(--font-archivo)] text-white/55 text-base md:text-lg leading-relaxed mb-10">
            Você pode continuar deixando o tanque engolir umidade e desperdiçar dinheiro em uma queima incompleta, ou pode otimizar seu combustível com engenharia real. Proteção e economia máxima direto no tanque.
          </p>
          <CTAButton label="COMPRAR AGORA" href="/choice" size="large" />
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 pt-8 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-6">
          <div>
            <p className="font-[family-name:var(--font-basement)] font-bold text-white/60 text-sm mb-2">
              Combustível protegido, motor saudável.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-white/55 font-[family-name:var(--font-archivo)]">
              <a href={SOCIAL_LINKS.instagram} className="hover:text-white/60 transition-colors">@ocarboze</a>
              <a href={SOCIAL_LINKS.website} className="hover:text-white/60 transition-colors">carboze.com.br</a>
              <a href={SOCIAL_LINKS.youtube} className="hover:text-white/60 transition-colors">YouTube @carboze</a>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <Image src="/logo-header.png" alt="CarboZé" width={1147} height={198} className="h-6 w-auto opacity-80" />
            <p className="font-[family-name:var(--font-archivo)] text-white/20 text-xs">© 2025 CarboZé. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </section>
  );
}
