export default function WhyFormed100() {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-6">
          O CarboZé não foi adaptado para o Brasil.{" "}
          <span className="text-limao">Foi construído para ele.</span>
        </h2>

        <div className="space-y-5 font-[family-name:var(--font-archivo)] text-white/60 text-base md:text-lg leading-relaxed mb-8">
          <p>
            Os insumos são importados, selecionados entre os melhores disponíveis no mercado
            global. Mas a composição química é exclusiva e foi desenvolvida a partir da realidade
            do combustível brasileiro: os percentuais de mistura, as variações climáticas, as
            diferenças de qualidade entre regiões. Cada decisão de formulação partiu do problema
            específico que o nosso combustível cria dentro do nosso motor.
          </p>
        </div>

        <p className="font-[family-name:var(--font-basement)] font-bold text-lg md:text-xl mb-8">
          <span className="text-limao">Multi-combustível. Gasolina, diesel e etanol.</span>{" "}
          <span className="text-white">
            Uma única fórmula. Não existe outro produto com essa potência no Brasil.
          </span>
        </p>

        <div className="bg-white/10 border-l-4 border-limao rounded-r-2xl p-6 max-w-2xl">
          <p className="font-[family-name:var(--font-archivo)] text-white/70 text-base md:text-lg leading-relaxed">
            Você não precisa mais de um produto diferente para cada tipo de combustível — o{" "}
            <strong className="font-semibold">CarboZé resolve os três</strong>. Para quem
            abastece flex, para quem tem dois veículos, para quem troca de combustível conforme
            o preço, a cobertura é total.
          </p>
        </div>
      </div>
    </section>
  );
}
