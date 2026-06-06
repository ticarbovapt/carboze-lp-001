"use client";

import { useEffect, useRef, useState } from "react";

interface StickyCtaJeanProps {
  href: string;
}

export default function StickyCtaJean({ href }: StickyCtaJeanProps) {
  const [visible, setVisible] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Observer para detectar quando CTA Final entra na viewport
    const ctaFinal = document.getElementById("cta-final-section");
    let nearEnd = false;

    const observer = ctaFinal
      ? new IntersectionObserver(
          ([entry]) => {
            nearEnd = entry.isIntersecting;
            update();
          },
          { threshold: 0.1 }
        )
      : null;

    if (ctaFinal && observer) observer.observe(ctaFinal);

    function update() {
      setVisible(window.scrollY > 300 && !nearEnd);
    }

    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      ref={ctaRef}
      className={`fixed bottom-0 left-0 right-0 z-50 bg-verde-escuro border-t border-limao/20 px-4 py-3 sm:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <a
        href={href}
        className="flex flex-col items-center justify-center w-full bg-limao text-verde-escuro font-[family-name:var(--font-basement)] font-extrabold uppercase tracking-wide rounded-full py-3 px-6"
      >
        <span className="text-base leading-tight">QUERO MEU PACK DE SACHÊS</span>
        <span className="text-xs font-normal font-[family-name:var(--font-archivo)] opacity-80">
          R$ 59,90 · 5,99 por tanque protegido
        </span>
      </a>
    </div>
  );
}
