import NumberBadge from "./NumberBadge";

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
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5">
        {/* Headline */}
        <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-verde-escuro text-2xl sm:text-3xl md:text-4xl leading-tight max-w-xl mb-12">
          Três passos. Antes de chegar no posto já está feito.
        </h2>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {steps.map((s) => (
            <div key={s.num} className="flex flex-col gap-4">
              <NumberBadge number={s.num} variant="limao" />
              <h3 className="font-[family-name:var(--font-barlow)] font-bold uppercase text-verde-escuro text-lg">
                {s.title}
              </h3>
              <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/70 text-sm leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/50 text-sm border-t border-verde-escuro/10 pt-6 max-w-xl">
          Use a cada abastecimento. O tratamento é contínuo porque o combustível
          que entra no tanque é novo toda vez.
        </p>
      </div>
    </section>
  );
}
