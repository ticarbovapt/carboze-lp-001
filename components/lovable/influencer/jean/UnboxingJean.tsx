export default function UnboxingJean() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">

          {/* Copy */}
          <div>
            <p className="font-[family-name:var(--font-basement)] font-bold uppercase text-verde-medio text-xs tracking-widest mb-4">
              Na prática
            </p>
            <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight mb-4">
              Do envelope ao tanque{" "}
              <span className="text-verde-medio">em segundos.</span>
            </h2>
            <p className="font-[family-name:var(--font-archivo)] text-zinc-700 text-base leading-relaxed mb-6 max-w-md">
              Veja o unboxing real do sachê CarboZé: abre, despeja e abastece. Sem ferramenta,
              sem oficina — a dose já vem calibrada.
            </p>
            <ul className="space-y-2.5">
              {["Abra o sachê de 10ml", "Despeje direto no tanque", "Abasteça normalmente"].map((t, i) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-limao/15 text-verde-escuro flex items-center justify-center font-[family-name:var(--font-basement)] font-extrabold text-xs">
                    {i + 1}
                  </span>
                  <span className="font-[family-name:var(--font-archivo)] text-verde-escuro text-sm">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vídeo vertical (unboxing real) */}
          <div className="mx-auto w-full max-w-[300px] sm:max-w-[320px]">
            <div className="relative rounded-3xl overflow-hidden bg-verde-escuro aspect-[9/16] shadow-xl shadow-verde-escuro/20 border border-verde-escuro/10">
              <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="metadata"
                poster="/unboxing-jean-poster.webp"
              >
                <source src="/unboxing-jean.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
