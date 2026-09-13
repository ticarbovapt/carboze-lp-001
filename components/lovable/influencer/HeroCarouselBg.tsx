"use client";
import { useEffect, useRef, useState } from "react";
import HeroBgPicture from "./HeroBgPicture";

interface Img {
  desktop: string;
  mobile: string;
}

export default function HeroCarouselBg({
  images,
  intervalMs = 3500,
}: {
  images: Img[];
  intervalMs?: number;
}) {
  const [active, setActive] = useState(0);
  // Quantos quadros existem no DOM. Começa em 1: os quadros seguintes estão
  // dentro da viewport (absolute inset-0, opacity-0), então nascer com
  // loading="lazy" não os pouparia — o navegador baixaria todos junto com o
  // primeiro e o hero perderia banda no momento em que mais precisa dela.
  const [montados, setMontados] = useState(1);
  const raizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (images.length <= 1) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // Sobem depois que o hero já pintou, com folga até a 1ª troca.
    const monta = setTimeout(() => setMontados(images.length), 1200);

    // O intervalo só roda com o hero na tela e a aba visível. Antes ele girava
    // para sempre: cada troca é um re-render, e quem já estava lá embaixo
    // escolhendo produto pagava esse trabalho no meio dos próprios toques (INP).
    let id: ReturnType<typeof setInterval> | undefined;
    let naTela = true; // o hero é a 1ª dobra; o observer corrige se não for
    const avanca = () => setActive((p) => (p + 1) % images.length);

    const sincroniza = () => {
      const rodar = naTela && !document.hidden;
      if (rodar && id === undefined) {
        id = setInterval(avanca, intervalMs);
      } else if (!rodar && id !== undefined) {
        clearInterval(id);
        id = undefined;
      }
    };

    const raiz = raizRef.current;
    const obs = new IntersectionObserver(
      ([entry]) => {
        naTela = entry.isIntersecting;
        sincroniza();
      },
      { threshold: 0 }
    );
    if (raiz) obs.observe(raiz);
    document.addEventListener("visibilitychange", sincroniza);
    sincroniza();

    return () => {
      clearTimeout(monta);
      if (id !== undefined) clearInterval(id);
      obs.disconnect();
      document.removeEventListener("visibilitychange", sincroniza);
    };
  }, [images.length, intervalMs]);

  return (
    <div ref={raizRef} className="absolute inset-0" aria-hidden="true">
      {images.slice(0, montados).map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <HeroBgPicture desktop={img.desktop} mobile={img.mobile} prioritaria={idx === 0} />
        </div>
      ))}
    </div>
  );
}
