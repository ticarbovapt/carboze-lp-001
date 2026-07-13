import SlideCarousel from "@/components/lovable/SlideCarousel";

const DEPOIMENTOS = [
  { src: "/depoimentos/depoimento-1.webp", w: 700, h: 929 },
  { src: "/depoimentos/depoimento-2.webp", w: 700, h: 578 },
  { src: "/depoimentos/depoimento-3.webp", w: 700, h: 669 },
  { src: "/depoimentos/depoimento-4.webp", w: 700, h: 568 },
];

export default function DepoimentosJean() {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <p className="font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-xs tracking-widest mb-4">
          Prova social
        </p>
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-12">
          Quem usa,{" "}
          <span className="text-limao">recomenda.</span>
        </h2>

        <SlideCarousel
          theme="light"
          slides={DEPOIMENTOS.map((d, i) => (
            <div
              key={d.src}
              className="rounded-2xl overflow-hidden border border-white/10 shadow-sm bg-white max-w-md mx-auto"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={d.src}
                alt={`Depoimento de cliente CarboZé ${i + 1}`}
                width={d.w}
                height={d.h}
                loading="lazy"
                className="w-full h-auto"
              />
            </div>
          ))}
        />
      </div>
    </section>
  );
}
