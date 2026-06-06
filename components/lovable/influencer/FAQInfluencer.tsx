const faqs = [
  {
    q: "Posso usar o CarboZé em qualquer combustível?",
    a: "Sim. O CarboZé é multi-combustível: funciona em gasolina comum, gasolina aditivada, etanol e diesel — incluindo as misturas obrigatórias com etanol e biodiesel que existem no Brasil. Uma única fórmula para todos os combustíveis líquidos.",
  },
  {
    q: "Com que frequência devo usar?",
    a: "A cada abastecimento. A cada tanque cheio, entra combustível novo que precisa ser estabilizado e protegido. O efeito é cumulativo — quem usa consistentemente começa a perceber os benefícios a partir do 3º abastecimento.",
  },
  {
    q: "Em quanto tempo vejo resultado?",
    a: "Muitos usuários relatam partida mais fácil e motor mais suave já no primeiro uso. A limpeza progressiva dos bicos injetores e a remoção de depósitos acontece ao longo de 3 abastecimentos consecutivos. A proteção contra corrosão começa imediatamente.",
  },
];

export default function FAQInfluencer() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        <p className="font-[family-name:var(--font-archivo)] text-xs uppercase tracking-[0.18em] text-verde-escuro/40 mb-3">
          Dúvidas frequentes
        </p>

        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight mb-12">
          Perguntas e respostas
        </h2>

        <div className="max-w-2xl">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group border-b border-verde-escuro/8 last:border-0"
            >
              <summary className="flex items-center justify-between gap-6 py-6 font-[family-name:var(--font-basement)] font-bold text-verde-escuro text-base md:text-lg select-none cursor-pointer list-none">
                {faq.q}
                <span className="shrink-0 w-6 h-6 rounded-full border border-verde-escuro/15 flex items-center justify-center text-verde-medio">
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
              </summary>
              <div className="pb-6 -mt-1">
                <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm md:text-base leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </details>
          ))}
        </div>

      </div>
    </section>
  );
}
