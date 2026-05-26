const steps = [
  {
    num: "1",
    title: "Agite o frasco",
    body: "Agite bem antes de usar para garantir a homogeneidade da fórmula.",
  },
  {
    num: "2",
    title: "Meça a dose",
    body: "Use as marcações do frasco: 1ml por litro que vai abastecer.",
  },
  {
    num: "3",
    title: "Despeje no tanque",
    body: "Adicione no tanque antes ou durante o abastecimento.",
  },
  {
    num: "4",
    title: "Abasteça normalmente",
    body: "O CarboZé mistura sozinho e começa a agir enquanto você roda.",
  },
];

export default function HowToUse100() {
  return (
    <section className="bg-verde-escuro py-16 md:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5">
        <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-16 max-w-xl">
          4 passos. Mais simples que trocar um filtro.
        </h2>

        {/* Steps — horizontal com linha conectora */}
        <div className="relative">
          {/* Linha conectora (desktop) */}
          <div className="hidden lg:block absolute top-8 left-[3.5rem] right-[3.5rem] h-px bg-white/10" aria-hidden="true" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-6">
            {steps.map((s) => (
              <div key={s.num} className="flex flex-col gap-5">
                <div className="relative">
                  <span className="font-[family-name:var(--font-barlow)] font-extrabold text-7xl leading-none text-white/[0.05] select-none absolute -top-4 -left-2" aria-hidden="true">
                    {s.num}
                  </span>
                  <div className="relative w-16 h-16 rounded-2xl bg-limao flex items-center justify-center">
                    <span className="font-[family-name:var(--font-barlow)] font-extrabold text-verde-escuro text-2xl">
                      {s.num}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-barlow)] font-bold uppercase text-white text-base mb-2">
                    {s.title}
                  </h3>
                  <p className="font-[family-name:var(--font-archivo)] text-white/50 text-sm leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="font-[family-name:var(--font-archivo)] text-white/30 text-sm border-t border-white/8 pt-8 mt-14 max-w-xl">
          Use a cada abastecimento. O tratamento é contínuo porque o combustível
          que entra no tanque é novo toda vez.
        </p>
      </div>
    </section>
  );
}
