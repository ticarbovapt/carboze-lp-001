import { WHATSAPP_URL } from "@/lib/constants";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full bg-off-white border-b border-verde-escuro/10">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/logo-carboze-moto.svg"
            alt="CarboZé Moto"
            width={200}
            height={40}
            priority
            className="h-8 w-auto"
          />
        </div>
        <nav className="flex items-center gap-4 text-sm font-[family-name:var(--font-barlow)] font-semibold">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-verde-escuro hover:text-verde-medio transition-colors"
          >
            WhatsApp
          </a>
          <a
            href="#faq"
            className="hidden sm:inline text-verde-escuro hover:text-verde-medio transition-colors"
          >
            Dúvidas
          </a>
        </nav>
      </div>
    </header>
  );
}
