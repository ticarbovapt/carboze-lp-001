const steps = [
  {
    num: "01",
    title: "Encapsula a Água na Estrutura",
    body: "As moléculas ativas do CarboZé identificam e encapsulam as moléculas de água separadas do combustível, impedindo que elas interfiram na combustão e corroam o sistema.",
  },
  {
    num: "02",
    title: "Reorganiza as Moléculas",
    body: "A fórmula estabiliza a mistura etanol-gasolina ou biodiesel-diesel, reorganizando a estrutura molecular para máxima eficiência de queima a cada ciclo do motor.",
  },
  {
    num: "03",
    title: "Limpeza Molecular Progressiva",
    body: "A cada abastecimento, o CarboZé dissolve e remove depósitos acumulados nos injetores, bicos e câmara de combustão — sem solventes agressivos.",
  },
  {
    num: "04",
    title: "Proteção Contínua na Estrutura",
    body: "Com o uso regular, o CarboZé mantém o sistema limpo e estabilizado, garantindo que o motor opere sempre em estado ótimo, abastecimento após abastecimento.",
  },
];

export default function ComoFunciona() {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Label */}
        <p className="font-[family-name:var(--font-archivo)] text-xs uppercase tracking-[0.18em] text-white/30 mb-3">
          Como Funciona
        </p>

        {/* Heading */}
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight max-w-3xl mb-12">
          Como o CarboZé otimiza seu combustível no nível molecular.
        </h2>

        {/* 4-step grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="rounded-2xl p-7 border border-white/10 bg-white/[0.05] hover:bg-white/[0.08] transition-colors"
            >
              {/* Number badge */}
              <div className="flex items-center justify-center w-10 h-10 bg-limao text-verde-escuro rounded-xl font-[family-name:var(--font-basement)] font-extrabold text-sm mb-5">
                {step.num}
              </div>

              <h3 className="font-[family-name:var(--font-basement)] font-bold uppercase text-white text-base leading-snug mb-3">
                {step.title}
              </h3>
              <p className="font-[family-name:var(--font-archivo)] text-white/60 text-sm leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
