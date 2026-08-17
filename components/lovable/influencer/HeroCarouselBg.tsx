"use client";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (images.length <= 1) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // Sobem depois que o hero já pintou, com folga até a 1ª troca.
    const monta = setTimeout(() => setMontados(images.length), 1200);
    const id = setInterval(
      () => setActive((p) => (p + 1) % images.length),
      intervalMs
    );
    return () => {
      clearTimeout(monta);
      clearInterval(id);
    };
  }, [images.length, intervalMs]);

  return (
    <div className="absolute inset-0" aria-hidden="true">
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
