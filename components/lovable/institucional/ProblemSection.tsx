const problems = [
  {
    num: "01",
    title: "Separação de Fases",
    body: "O etanol presente na gasolina absorve umidade do ar e se separa do combustível, criando bolsões de água no tanque que impedem a combustão eficiente e corroem o sistema.",
  },
  {
    num: "02",
    title: "Saturação por Borras",
    body: "Resíduos e impurezas do combustível acumulam nos injetores e na câmara de combustão, reduzindo o fluxo e forçando o motor a trabalhar com mais esforço a cada ciclo.",
  },
  {
    num: "03",
    title: "Perda de Energia",
    body: "Com o combustível degradado e os injetores entupidos, o motor queima mais para gerar menos — resultado direto: maior consumo, menor desempenho e vida útil reduzida.",
  },
];

export default function ProblemSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Label */}
        <p className="font-[family-name:var(--font-archivo)] text-xs uppercase tracking-[0.18em] text-limao mb-3">
          O Problema
        </p>

        {/* Heading */}
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight max-w-3xl mb-6">
          Seu combustível está sendo desperdiçado antes de virar energia.
        </h2>

        {/* Intro paragraph */}
        <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-base md:text-lg leading-relaxed max-w-3xl mb-12">
          O combustível brasileiro é <strong className="text-verde-escuro font-semibold">altamente higroscópico</strong> — absorve água do ar com facilidade. Isso não é um defeito do motor. É a natureza do etanol e do biodiesel misturados ao combustível que chega na sua bomba. E acontece a cada abastecimento, silenciosamente.
        </p>

        {/* 3-col problem grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {problems.map((p) => (
            <div
              key={p.num}
              className="bg-verde-escuro/[0.03] rounded-2xl p-8 border border-verde-escuro/8"
            >
              <span className="inline-block font-[family-name:var(--font-basement)] font-extrabold text-limao text-sm mb-4">
                {p.num}
              </span>
              <h3 className="font-[family-name:var(--font-basement)] font-bold text-verde-escuro text-xl mb-3">
                {p.title}
              </h3>
              <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm leading-relaxed">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
