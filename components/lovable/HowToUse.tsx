const benefits = [
  {
    title: "Proteção na partida fria",
    body: "Com o combustível tratado, o motor ignita melhor quando está frio. Menos tentativas, menos desgaste, mais confiança em cada manhã.",
  },
  {
    title: "Bicos injetores mais limpos",
    body: "O efeito de limpeza se acumula a cada uso. Menos depósito nos bicos = combustão mais eficiente e revisão chegando na hora certa.",
  },
  {
    title: "Consumo reduzido com o tempo",
    body: "Combustível bem queimado não é desperdiçado. A economia aparece na bomba e na manutenção — o investimento se paga sozinho.",
  },
];

export default function HowToUse() {
  return (
    <section className="bg-verde-escuro py-16 md:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Callout de preço */}
        <div className="bg-limao/10 border border-limao/20 rounded-2xl p-6 text-center mb-14">
          <p className="font-[family-name:var(--font-basement)] font-bold text-limao text-base md:text-lg uppercase tracking-wide">
            10 SACHÊS = 10 TANQUES = MAIS DE 1 MÊS DE PROTEÇÃO ={" "}
            <span className="text-white">R$ 59,90</span>
          </p>
        </div>

        {/* Headline */}
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-14 max-w-2xl mx-auto text-center">
          Proteção que você sente abastecimento a abastecimento.
        </h2>

        {/* 3 cards — brancos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {benefits.map((b) => (
            <div key={b.title} className="bg-white rounded-2xl p-7 flex flex-col gap-5">
              <div className="w-10 h-10 rounded-full bg-limao flex items-center justify-center shrink-0">
                <div className="w-4 h-4 rounded-full bg-verde-escuro" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-basement)] font-bold uppercase text-verde-escuro text-base leading-snug mb-3">
                  {b.title}
                </h3>
                <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm leading-relaxed">
                  {b.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Nota */}
        <p className="font-[family-name:var(--font-archivo)] text-white/30 text-sm border-t border-white/8 pt-8 mt-14 max-w-xl">
          Use a cada abastecimento. O tratamento é contínuo porque o combustível que entra
          no tanque é novo toda vez.
        </p>
      </div>
    </section>
  );
}
