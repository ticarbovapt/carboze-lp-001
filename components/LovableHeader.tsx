"use client";

import { WHATSAPP_URL } from "@/lib/constants";
import Image from "next/image";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Problema",   href: "#problema"   },
  { label: "Benefícios", href: "#beneficios" },
  { label: "Como usar",  href: "#como-usar"  },
  { label: "Para quem",  href: "#para-quem"  },
  { label: "FAQ",        href: "#faq"        },
];

interface LovableHeaderProps {
  checkoutHref?: string;
}

export default function LovableHeader({ checkoutHref = "/choice" }: LovableHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        scrolled
          ? "bg-verde-escuro/97 backdrop-blur-md border-white/8 shadow-md shadow-black/20"
          : "bg-verde-escuro border-white/10"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-3.5 h-[56px] flex items-center justify-between">

        {/* Logo — versão branca sobre fundo verde */}
        <a href="/" className="flex items-center shrink-0">
          <Image
            src="/logo-carboze-moto-white.svg"
            alt="CarboZé"
            width={140}
            height={32}
            priority
            className="h-7 w-auto"
          />
        </a>

        {/* Anchor nav — visible on lg+ */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-[family-name:var(--font-archivo)] tracking-wide">
          {navLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-white/40 hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right CTAs */}
        <nav className="flex items-center gap-4 shrink-0">
          {/* Onde Encontrar */}
          <a
            href="/lojas"
            className="hidden md:inline font-[family-name:var(--font-archivo)] text-white/40 hover:text-white transition-colors text-xs tracking-wide"
          >
            Onde Encontrar
          </a>
          {/* Compre Online */}
          <a
            href={checkoutHref}
            className="hidden sm:inline font-[family-name:var(--font-archivo)] text-white/40 hover:text-white transition-colors text-xs tracking-wide"
          >
            Compre Online
          </a>

          {/* WhatsApp */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-limao text-verde-escuro px-4 py-2 rounded-full font-[family-name:var(--font-barlow)] font-bold text-xs hover:brightness-110 transition-all active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3.5 h-3.5 shrink-0"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
