"use client";
import { useEffect, useRef } from "react";

interface InViewVideoProps {
  src: string;
  poster?: string;
  className?: string;
  controls?: boolean;
}

/**
 * Vídeo que só carrega e toca quando entra na tela (IntersectionObserver).
 * preload="none" evita baixar o arquivo no load inicial — economiza dados no mobile.
 */
export default function InViewVideo({ src, poster, className = "", controls = false }: InViewVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
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
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      controls={controls}
      preload="none"
      poster={poster}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
