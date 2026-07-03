"use client";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (images.length <= 1) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(
      () => setActive((p) => (p + 1) % images.length),
      intervalMs
    );
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-top bg-no-repeat block sm:hidden"
            style={{ backgroundImage: `url('${img.mobile}')` }}
          />
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden sm:block"
            style={{ backgroundImage: `url('${img.desktop}')` }}
          />
        </div>
      ))}
    </div>
  );
}
