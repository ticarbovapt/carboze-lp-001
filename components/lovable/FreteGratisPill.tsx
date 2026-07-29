"use client";
import { useEffect, useState } from "react";

const VERBOS = [
  "Quero gastar menos",
  "Quero frete grátis",
  "Quero vacinar meu combustível",
];

interface FreteGratisPillProps {
  /** Destino do clique — sempre o mesmo, independente do verbo exibido. */
  href?: string;
  /** Classe de posição vertical (p/ empilhar acima da StickyPriceBar). */
  bottomClass?: string;
  /** Some quando a seção #cta-final-section entra na tela. */
  hideAtCtaFinal?: boolean;
}

export default function FreteGratisPill({
  href = "#escolha-produto",
  bottomClass = "bottom-24",
  hideAtCtaFinal = true,
}: FreteGratisPillProps) {
  const [mounted, setMounted] = useState(false); // entra 2s após o load
  const [atCta, setAtCta] = useState(false); // está na CTA final
  const [i, setI] = useState(0); // verbo atual
  const [paused, setPaused] = useState(false); // congela no hover
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
    const t = setTimeout(() => setMounted(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // rotação do verbo (crossfade) — pausa no hover e respeita reduced-motion
  useEffect(() => {
    if (reduce || paused || !mounted) return;
    const id = setInterval(() => setI((p) => (p + 1) % VERBOS.length), 3500);
    return () => clearInterval(id);
  }, [reduce, paused, mounted]);

  // esconde na seção de CTA final
  useEffect(() => {
    if (!hideAtCtaFinal) return;
    const el = document.getElementById("cta-final-section");
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setAtCta(e.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hideAtCtaFinal]);

  const show = mounted && !atCta;
  const verbo = reduce ? VERBOS[1] : VERBOS[i]; // reduced-motion fixa em "frete grátis"

  return (
    <div
      className={`fixed ${bottomClass} left-1/2 -translate-x-1/2 z-40 px-2 w-max max-w-[calc(100vw-1rem)] transition-all duration-500 ease-out ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      <a
        href={href}
        aria-label="Quero frete grátis — ver produtos"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="group relative flex items-center gap-2 rounded-full py-2 pl-2 pr-3 bg-verde-escuro/85 backdrop-blur-xl border border-limao/40 shadow-[0_10px_40px_-8px_rgba(169,218,0,0.45)] hover:border-limao/70 active:scale-[0.98] transition-all overflow-hidden"
      >
        {/* brilho premium que atravessa o pill */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
          style={{ background: "linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.14) 50%, transparent 70%)" }}
        />

        {/* Selo fixo — a promessa nunca some */}
        <span className="relative shrink-0 inline-flex items-center gap-1 bg-limao text-verde-escuro font-[family-name:var(--font-basement)] font-black text-[10px] sm:text-xs uppercase tracking-wide rounded-full pl-1.5 pr-2 py-1">
          <span aria-hidden="true">🚚</span>
          Frete grátis
        </span>

        {/* Verbo girando — largura estável via grid empilhado */}
        <span className="relative grid shrink-0 items-center" aria-hidden="true">
          {VERBOS.map((v, idx) => (
            <span
              key={v}
              style={{ gridArea: "1 / 1" }}
              className={`font-[family-name:var(--font-archivo)] font-semibold text-white text-xs sm:text-sm whitespace-nowrap transition-all duration-500 ${
                (reduce ? v === VERBOS[1] : idx === i)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-1"
              }`}
            >
              {v}
            </span>
          ))}
          {/* fallback para leitores/no-js: mantém o texto atual acessível */}
          <span className="sr-only">{verbo}</span>
        </span>

        {/* Seta */}
        <svg viewBox="0 0 16 16" fill="none" className="relative shrink-0 w-3.5 h-3.5 text-limao group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}
