export default function UnboxingJean() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <p className="font-[family-name:var(--font-basement)] font-bold uppercase text-verde-medio text-xs tracking-widest mb-4">
          Na prática
        </p>
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight mb-3">
          Do envelope ao tanque{" "}
          <span className="text-verde-medio">em segundos.</span>
        </h2>
        <p className="font-[family-name:var(--font-archivo)] text-zinc-700 text-base leading-snug mb-10 max-w-xl">
          Veja como é simples: abre, despeja e abastece. Sem ferramenta, sem oficina.
        </p>

        {/* Vídeo de unboxing — trocar /unboxing-jean.mp4 pelo arquivo real */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-verde-escuro aspect-video shadow-lg shadow-verde-escuro/10">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            controls
            playsInline
            preload="none"
            poster="/lp-produto-secao5.webp"
          >
            <source src="/unboxing-jean.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
