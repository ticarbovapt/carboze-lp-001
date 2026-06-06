const steps = [
  {
    num: "01",
    title: "Abra o sachê ou frasco",
    body: "Para motos: o sachê de 10ml. Para carros: o frasco de 100ml. Nenhuma medição necessária — a dose já é calibrada para o tanque.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-limao" aria-hidden="true">
        <path d="M12 3v13M8 13l4 4 4-4M5 19h14" />
      </svg>
    ),
    split: null,
  },
  {
    num: "02",
    title: "Despeje no tanque antes de abastecer",
    body: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-limao" aria-hidden="true">
        <path d="M12 3C8 3 5 6 5 10c0 5.25 7 13 7 13s7-7.75 7-13c0-4-3-7-7-7z" />
        <circle cx="12" cy="10" r="2" />
      </svg>
    ),
    split: [
      { label: "Motos", desc: "Despeje o sachê na abertura do tanque antes de abastecer. O combustível vai misturar automaticamente." },
      { label: "Carros", desc: "Despeje o frasco direto no tanque. Funciona em gasolina, etanol, diesel e flex." },
    ],
  },
  {
    num: "03",
    title: "Abasteça normalmente",
    body: "Feche o tanque e abasteça como sempre. Não há nada mais a fazer — o CarboZé age durante o funcionamento do motor.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-limao" aria-hidden="true">
        <path d="M3 12a9 9 0 1018 0A9 9 0 003 12z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    split: null,
  },
];

export default function HowToUseInfluencer() {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5">

        <p className="font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-xs tracking-widest mb-4">
          Modo de uso
        </p>
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-12">
          3 passos.{" "}
          <span className="text-limao">Nenhum mecânico envolvido.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-2xl p-7 flex flex-col gap-4"
            >
              {/* Number + icon row */}
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-basement)] font-extrabold text-verde-escuro/15 text-5xl leading-none">
                  {step.num}
                </span>
                <div className="w-11 h-11 rounded-full bg-verde-escuro flex items-center justify-center">
                  {step.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="font-[family-name:var(--font-basement)] font-bold uppercase text-verde-escuro text-base leading-snug">
                {step.title}
              </h3>

              {/* Body or split */}
              {step.body && (
                <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/55 text-sm leading-relaxed">
                  {step.body}
                </p>
              )}
              {step.split && (
                <div className="space-y-3">
                  {step.split.map((s) => (
                    <div key={s.label} className="bg-verde-escuro/[0.05] rounded-xl p-4">
                      <p className="font-[family-name:var(--font-basement)] font-bold text-verde-escuro text-xs uppercase tracking-widest mb-1">
                        {s.label}
                      </p>
                      <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/55 text-sm leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
