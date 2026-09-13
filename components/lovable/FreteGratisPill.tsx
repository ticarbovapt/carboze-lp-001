"use client";
import { useEffect, useRef, useState } from "react";
import { TruckIcon } from "@/components/lovable/Icons";

// A rotação é 100% CSS (.frete-verbo em globals.css). As porcentagens dos
// keyframes assumem 5 verbos × 3,5s — mudou a quantidade, ajuste lá também.
const VERBOS = [
  "Quero gastar menos",
  "Quero frete grátis",
  "Quero vacinar meu combustível",
  "Quero proteger meu motor",
  "Quero mais potência",
];
const PASSO_S = 3.5;

interface FreteGratisPillProps {
  /** Destino do clique — sempre o mesmo, independente do verbo exibido. */
  href?: string;
  /** Classe de posição vertical (p/ empilhar acima da StickyPriceBar). */
  bottomClass?: string;
  /** Some quando a seção #cta-final-section entra na tela. */
  hideAtCtaFinal?: boolean;
}

/**
 * Pill flutuante de frete grátis — para páginas SEM StickyPriceBar (nas que têm,
 * o frete grátis já vive dentro da barra).
 *
 * POR QUE O VERBO GIRA EM CSS. A versão anterior trocava o verbo com
 * setInterval + setState a cada 3,5s. Cada troca mexia em nó de texto, e o
 * UTMify tem um MutationObserver no <body> que reescreve todos os links e
 * forms a cada mutação — ou seja, a página inteira era reprocessada a cada
 * 3,5s, para sempre, e isso aparecia no INP. Agora os cinco verbos nascem no
 * HTML e só a opacidade anima: zero mutação de DOM depois do load.
 */
export default function FreteGratisPill({
  href = "#escolha-produto",
  bottomClass = "bottom-24",
  hideAtCtaFinal = true,
}: FreteGratisPillProps) {
  const [show, setShow] = useState(false);
  const sentinelaRef = useRef<HTMLDivElement>(null);

  // Só aparece depois de passar do hero (evita cobrir o CTA da 1ª dobra) e
  // some na CTA final. IntersectionObserver no lugar do listener de scroll:
  // acorda só quando uma borda é cruzada, e o estado só muda se o valor mudar.
  useEffect(() => {
    const sentinela = sentinelaRef.current;
    const cta = hideAtCtaFinal ? document.getElementById("cta-final-section") : null;

    let passouHero = false;
    let naCta = false;
    let atual = false;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === sentinela) {
            passouHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
          } else {
            naCta = entry.isIntersecting;
          }
        }
        const proximo = passouHero && !naCta;
        if (proximo === atual) return;
        atual = proximo;
        setShow(proximo);
      },
      { threshold: 0 }
    );
    if (sentinela) obs.observe(sentinela);
    if (cta) obs.observe(cta);
    return () => obs.disconnect();
  }, [hideAtCtaFinal]);

  return (
    <>
      {/* Sentinela a 75% da 1ª dobra (equivale ao antigo scrollY > 0,75 × innerHeight).
          Ancora no documento porque nenhum ancestral é posicionado. */}
      <div
        ref={sentinelaRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-[75vh] h-px w-px"
      />

      <div
        data-show={show}
        inert={!show}
        className={`frete-pill fixed ${bottomClass} left-1/2 -translate-x-1/2 z-40 px-2 w-max max-w-[calc(100vw-1rem)] transition-all duration-500 ease-out ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
        }`}
      >
        <a
          href={href}
          aria-label="Quero frete grátis — ver produtos"
          className="group relative flex items-center gap-2 rounded-full py-2 pl-2 pr-3 bg-verde-escuro/85 backdrop-blur-xl border border-limao/40 shadow-[0_10px_40px_-8px_rgba(169,218,0,0.45)] hover:border-limao/70 active:scale-[0.98] transition-all overflow-hidden"
        >
          {/* brilho premium que atravessa o pill */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
            style={{ background: "linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.14) 50%, transparent 70%)" }}
          />

          {/* Selo fixo — a promessa nunca some. O pulse roda poucas vezes e
              só enquanto o pill está na tela (classe entra com o show). */}
          <span
            className={`${show ? "animate-frete-pulse" : ""} relative shrink-0 inline-flex items-center gap-1 bg-limao text-verde-escuro font-[family-name:var(--font-basement)] font-black text-[10px] sm:text-xs uppercase tracking-wide rounded-full pl-1.5 pr-2 py-1`}
          >
            <TruckIcon className="w-3.5 h-3.5" />
            Frete grátis
          </span>

          {/* Verbo girando — largura estável via grid empilhado. Todos no DOM;
              a pausa no hover/foco e o reduced-motion são resolvidos no CSS. */}
          <span className="relative grid shrink-0 items-center" aria-hidden="true">
            {VERBOS.map((v, idx) => (
              <span
                key={v}
                style={{
                  gridArea: "1 / 1",
                  animationDuration: `${VERBOS.length * PASSO_S}s`,
                  animationDelay: `${idx * PASSO_S}s`,
                }}
                className="frete-verbo font-[family-name:var(--font-archivo)] font-semibold text-white text-xs sm:text-sm whitespace-nowrap"
              >
                {v}
              </span>
            ))}
          </span>

          {/* Seta */}
          <svg viewBox="0 0 16 16" fill="none" className="relative shrink-0 w-3.5 h-3.5 text-limao group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </>
  );
}
