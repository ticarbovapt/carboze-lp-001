const problems = [
  {
    icon: "⛽",
    title: "Combustível degradado",
    body: "A qualidade do combustível varia entre postos e lotes — e o motor absorve cada variação.",
  },
  {
    icon: "💧",
    title: "Umidade e contaminação",
    body: "Água e partículas entram no tanque a cada abastecimento e comprometem a combustão.",
  },
  {
    icon: "🔧",
    title: "Desgaste silencioso",
    body: "Bicos injetores, bomba de combustível e sistema de injeção se desgastam invisívelmente — até a conta chegar.",
  },
];

export default function Problem100() {
  return (
    <section className="bg-off-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5">
        <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-verde-escuro text-2xl sm:text-3xl md:text-4xl leading-tight mb-4">
          O combustível também envelhece —{" "}
          <span className="text-verde-medio">e o motor sente.</span>
        </h2>
        <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/70 text-base md:text-lg leading-relaxed mb-10 max-w-2xl">
          Degradação durante o armazenamento, contaminantes e variação de
          qualidade afetam a combustão, aumentam o consumo e aceleram desgastes
          — em qualquer tipo de veículo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div
              key={p.title}
              className="bg-verde-escuro rounded-2xl p-7 flex flex-col gap-4"
            >
              <span className="text-3xl">{p.icon}</span>
              <h3 className="font-[family-name:var(--font-barlow)] font-bold uppercase text-limao text-base">
                {p.title}
              </h3>
              <p className="font-[family-name:var(--font-archivo)] text-white/70 text-sm leading-relaxed">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
