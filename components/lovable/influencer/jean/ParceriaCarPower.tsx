const SOCIOS = [
  { src: "/carpower-socio-1.webp", alt: "Sócio do CarPower Centro Automotivo" },
  { src: "/carpower-socio-2.webp", alt: "Sócio do CarPower Centro Automotivo" },
];

export default function ParceriaCarPower() {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">

          {/* Copy + logo */}
          <div>
            <p className="font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-xs tracking-widest mb-4">
              Parceria
            </p>
            <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-5">
              CarPower e CarboZé,{" "}
              <span className="text-limao">juntos.</span>
            </h2>
            <p className="font-[family-name:var(--font-archivo)] text-white/70 text-base leading-relaxed mb-8 max-w-md">
              Quem trabalha com motor todos os dias sabe o que faz diferença no tanque.
              O CarPower Centro Automotivo é parceiro do CarboZé — e recomenda o tratamento
              a cada abastecimento.
            </p>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/carpower-logo.webp"
              alt="CarPower Centro Automotivo"
              width={560}
              height={137}
              loading="lazy"
              className="h-12 sm:h-14 w-auto"
            />
          </div>

          {/* Fotos dos sócios */}
          <div className="grid grid-cols-2 gap-4">
            {SOCIOS.map((s) => (
              <div
                key={s.src}
                className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 aspect-[3/4]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={s.alt}
                  width={640}
                  height={960}
                  loading="lazy"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
