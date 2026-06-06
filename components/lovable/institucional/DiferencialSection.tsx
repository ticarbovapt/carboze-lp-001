import CTAButton from "@/components/lovable/CTAButton";

export default function DiferencialSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Label */}
        <p className="font-[family-name:var(--font-archivo)] text-xs uppercase tracking-[0.18em] text-verde-escuro/40 mb-3">
          O Que Diferencia
        </p>

        {/* Heading */}
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight mb-4 max-w-2xl">
          Um otimizador molecular. Não um aditivo comum.
        </h2>

        {/* Intro */}
        <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-base leading-relaxed max-w-2xl mb-12">
          Aditivos convencionais cobrem sintomas com solventes e detergentes genéricos.
          O CarboZé age diferente — atua na estrutura molecular do combustível, onde o
          problema realmente começa.
        </p>

        {/* Comparison cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">

          {/* Card ERRADO */}
          <div className="bg-red-50 border-2 border-red-400/40 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-red-400 text-xl" aria-hidden="true">✕</span>
              <h3 className="font-[family-name:var(--font-basement)] font-bold text-red-400 text-lg uppercase">
                Aditivos Convencionais
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                "Atuam apenas na superfície do combustível.",
                "Tratam sintomas temporários, não a causa.",
                "Fórmulas antigas e genéricas.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg viewBox="0 0 12 12" fill="none" className="w-4 h-4 text-red-400 shrink-0 mt-0.5">
                    <path d="M10 2L2 10M2 2l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card CERTO */}
          <div className="bg-limao/[0.08] border-2 border-limao rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-verde-escuro text-xl" aria-hidden="true">✓</span>
              <h3 className="font-[family-name:var(--font-basement)] font-bold text-verde-escuro text-lg uppercase">
                Otimizador Molecular CarboZé
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                "Atua na estrutura molecular (origem do problema).",
                "Encapsula a água e estabiliza o etanol/biodiesel.",
                "Fórmula específica para o cenário brasileiro atual.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg viewBox="0 0 12 12" fill="none" className="w-4 h-4 text-verde-medio shrink-0 mt-0.5">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-[family-name:var(--font-archivo)] text-verde-escuro/70 text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Impact phrase */}
        <p className="text-center font-[family-name:var(--font-basement)] font-bold text-verde-medio text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-snug">
          "Não é um aditivo que você espera funcionar. É um otimizador que você sente funcionando."
        </p>

        {/* CTA */}
        <div className="flex justify-center">
          <CTAButton label="ESCOLHER CARBOZÉ" href="/choice" />
        </div>
      </div>
    </section>
  );
}
