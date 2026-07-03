"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface SlideCarouselProps {
  slides: ReactNode[];
  /** Intervalo do auto-play (ms). 0 = desliga. */
  autoMs?: number;
  /** Cor das setas/dots: para fundo escuro use "light", branco use "dark". */
  theme?: "light" | "dark";
  className?: string;
}

export default function SlideCarousel({
  slides,
  autoMs = 4000,
  theme = "light",
  className = "",
}: SlideCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (i: number) => setIndex(((i % count) + count) % count);

  useEffect(() => {
    if (!autoMs || count <= 1 || paused) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    timer.current = setInterval(() => setIndex((p) => (p + 1) % count), autoMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [autoMs, count, paused]);

  const arrowBase =
    theme === "light"
      ? "bg-white/10 hover:bg-white/20 text-white border border-white/15"
      : "bg-verde-escuro/5 hover:bg-verde-escuro/10 text-verde-escuro border border-verde-escuro/10";
  const dotOn = theme === "light" ? "bg-limao" : "bg-verde-escuro";
  const dotOff = theme === "light" ? "bg-white/25" : "bg-verde-escuro/20";

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Track */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((s, i) => (
            <div key={i} className="w-full shrink-0 px-1" aria-hidden={i !== index}>
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Controles */}
      {count > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => go(index - 1)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${arrowBase}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir para o slide ${i + 1}`}
                onClick={() => go(i)}
                className={`h-2 rounded-full transition-all ${i === index ? `w-6 ${dotOn}` : `w-2 ${dotOff}`}`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Próximo"
            onClick={() => go(index + 1)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${arrowBase}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
