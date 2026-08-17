"use client";
import { useEffect, useRef, useState } from "react";

interface InViewVideoProps {
  src: string;
  poster?: string;
  className?: string;
  controls?: boolean;
}

/** Distância da viewport em que pôster e vídeo começam a carregar. */
const MARGEM_PX = 300;

/**
 * Vídeo que só baixa e toca quando chega perto da tela.
 *
 * O pôster também é preguiçoso. `preload="none"` segura o vídeo, mas NÃO o
 * pôster: ele baixa junto com a página. Na home isso custava 78 KB
 * (takes-jean-poster 55 KB + unboxing-jean-poster 23 KB) por dois vídeos que
 * ficam muito abaixo da dobra — 11% do peso inicial da página.
 *
 * A margem de 300px faz o pôster chegar antes do vídeo entrar em tela, então
 * não há quadro vazio na rolagem. A checagem é por retângulo em vez de
 * IntersectionObserver para cobrir também mudança de viewport pelo mesmo
 * caminho de código, igual ao VturbPlayer.
 */
export default function InViewVideo({ src, poster, className = "", controls = false }: InViewVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [perto, setPerto] = useState(false);

  // Carregar: pôster e vídeo entram quando faltam 300px.
  useEffect(() => {
    if (perto) return;
    const checar = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight + MARGEM_PX && r.bottom > -MARGEM_PX) setPerto(true);
    };
    checar();
    window.addEventListener("scroll", checar, { passive: true });
    window.addEventListener("resize", checar, { passive: true });
    return () => {
      window.removeEventListener("scroll", checar);
      window.removeEventListener("resize", checar);
    };
  }, [perto]);

  // Tocar: só quando realmente aparece, para não gastar CPU e bateria fora da tela.
  useEffect(() => {
    const v = ref.current;
    if (!v || !perto) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!reduce) v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.35 }
    );

    obs.observe(v);
    return () => obs.disconnect();
  }, [perto]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      controls={controls}
      preload="none"
      poster={perto ? poster : undefined}
    >
      {perto && <source src={src} type="video/mp4" />}
    </video>
  );
}
