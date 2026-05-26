const steps = [
  {
    num: "1",
    title: "Rasge o sachê",
    body: "Rasge o sachê antes de abastecer.",
  },
  {
    num: "2",
    title: "Despeje no tanque",
    body: "Despeje o conteúdo inteiro no tanque vazio ou quase vazio.",
  },
  {
    num: "3",
    title: "Abasteça normalmente",
    body: "O CarboZé mistura sozinho e começa a agir enquanto você roda.",
  },
];

export default function HowToUse() {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5">
        {/* Headline — maior, linha única */}
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-12">
          3 passos. Antes de chegar no posto já está feito.
        </h2>

        {/* Steps — cards verde escuro com borda, centralizados */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {steps.map((s) => (
            <div
              key={s.num}
              className="bg-white/10 rounded-2xl p-7 flex flex-col items-center text-center gap-4"
            >
              {/* Número grande */}
              <div className="w-14 h-14 rounded-full bg-limao flex items-center justify-center shrink-0">
                <span className="font-[family-name:var(--font-basement)] font-extrabold text-verde-escuro text-2xl">
                  {s.num}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-basement)] font-bold uppercase text-white text-lg">
                {s.title}
              </h3>
              <p className="font-[family-name:var(--font-archivo)] text-white/70 text-sm leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="font-[family-name:var(--font-archivo)] text-white/40 text-sm border-t border-white/10 pt-6 max-w-xl">
          Use a cada abastecimento. O tratamento é contínuo porque o combustível
          que entra no tanque é novo toda vez.
        </p>
      </div>
    </section>
  );
}
