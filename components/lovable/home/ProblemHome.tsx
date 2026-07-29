const problems = [
  {
    num: "01",
    title: "Separação de fases",
    body: "O etanol absorve umidade e se separa: bolsões de água no tanque que travam a combustão e corroem o sistema.",
  },
  {
    num: "02",
    title: "Saturação por borras",
    body: "Resíduos entopem injetores e câmara. O fluxo cai e o motor força mais a cada ciclo.",
  },
  {
    num: "03",
    title: "Perda de energia",
    body: "Queima mais para render menos. Mais consumo, menos desempenho, vida útil curta.",
  },
];

export default function ProblemHome() {
  return (
    <section className="bg-verde-escuro pt-16 md:pt-24 pb-12 md:pb-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Label */}
        <p className="font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-xs tracking-widest mb-4">
          O problema
        </p>

        {/* Heading */}
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight max-w-3xl mb-5">
          Seu combustível é desperdiçado{" "}
          <span className="text-limao">antes de virar energia.</span>
        </h2>

        {/* Intro — uma linha */}
        <p className="font-[family-name:var(--font-archivo)] text-white/60 text-base md:text-lg leading-relaxed max-w-2xl mb-10">
          O combustível brasileiro absorve água do ar. Não é defeito do motor — é o etanol e o
          biodiesel que chegam na bomba. E acontece a cada abastecimento.
        </p>

        {/* 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {problems.map((p) => (
            <div
              key={p.num}
              className="bg-white/[0.07] rounded-2xl p-7 border border-white/10"
            >
              <span className="inline-block font-[family-name:var(--font-basement)] font-extrabold text-limao text-sm mb-3">
                {p.num}
              </span>
              <h3 className="font-[family-name:var(--font-basement)] font-bold text-white text-xl mb-2">
                {p.title}
              </h3>
              <p className="font-[family-name:var(--font-archivo)] text-white/60 text-sm leading-relaxed">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
