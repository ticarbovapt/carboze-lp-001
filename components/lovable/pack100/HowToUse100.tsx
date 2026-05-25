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
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5">
        <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-12 text-center">
          4 passos. Mais simples que trocar um filtro.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {steps.map((s) => (
            <div
              key={s.num}
              className="bg-white/10 rounded-2xl p-7 flex flex-col items-center text-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-limao flex items-center justify-center shrink-0">
                <span className="font-[family-name:var(--font-barlow)] font-extrabold text-verde-escuro text-2xl">
                  {s.num}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-barlow)] font-bold uppercase text-white text-lg">
                {s.title}
              </h3>
              <p className="font-[family-name:var(--font-archivo)] text-white/70 text-sm leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <p className="font-[family-name:var(--font-archivo)] text-white/40 text-sm border-t border-white/10 pt-6 max-w-xl">
          Use a cada abastecimento. O tratamento é contínuo porque o combustível
          que entra no tanque é novo toda vez.
        </p>
      </div>
    </section>
  );
}
