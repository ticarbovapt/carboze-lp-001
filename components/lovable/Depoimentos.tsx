const DEPOIMENTOS = [
  { src: "/depoimentos/depoimento-1.webp", w: 700, h: 929 },
  { src: "/depoimentos/depoimento-2.webp", w: 700, h: 578 },
  { src: "/depoimentos/depoimento-3.webp", w: 700, h: 669 },
  { src: "/depoimentos/depoimento-4.webp", w: 700, h: 568 },
];

export default function Depoimentos({ dark = false }: { dark?: boolean }) {
  const bg = dark ? "bg-verde-escuro" : "bg-white";
  const eyebrow = dark ? "text-white/40" : "text-verde-escuro/40";
  const heading = dark ? "text-white" : "text-verde-escuro";
  const cardBorder = dark ? "border-white/10" : "border-verde-escuro/10";

  return (
    <section className={`${bg} py-16 md:py-24`}>
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <p className={`font-[family-name:var(--font-archivo)] text-xs uppercase tracking-[0.18em] ${eyebrow} mb-3`}>
          Depoimentos
        </p>
        <h2 className={`font-[family-name:var(--font-basement)] font-extrabold uppercase ${heading} text-3xl sm:text-4xl md:text-5xl leading-tight mb-10`}>
          Quem já usa,{" "}
          <span className="text-verde-medio">continua usando.</span>
        </h2>

        {/* Masonry — acomoda prints de alturas diferentes */}
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 [column-fill:_balance]">
          {DEPOIMENTOS.map((d, i) => (
            <div
              key={d.src}
              className={`mb-4 break-inside-avoid rounded-2xl overflow-hidden border ${cardBorder} shadow-sm bg-white`}
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
        </div>
      </div>
    </section>
  );
}
