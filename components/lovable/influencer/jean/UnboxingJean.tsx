import InViewVideo from "@/components/lovable/InViewVideo";

export default function UnboxingJean() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">

          {/* Copy — apenas headline */}
          <div>
            <p className="font-[family-name:var(--font-basement)] font-bold uppercase text-verde-medio text-xs tracking-widest mb-4">
              Na prática
            </p>
            <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight">
              Do envelope ao tanque{" "}
              <span className="text-verde-medio">em segundos.</span>
            </h2>
          </div>

          {/* Vídeo vertical (unboxing real) */}
          <div className="mx-auto w-full max-w-[300px] sm:max-w-[320px]">
            <div className="relative rounded-3xl overflow-hidden bg-verde-escuro aspect-[9/16] shadow-xl shadow-verde-escuro/20 border border-verde-escuro/10">
              <InViewVideo
                src="/unboxing-jean.mp4"
                poster="/unboxing-jean-poster.webp"
                controls
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
