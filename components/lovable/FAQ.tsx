const faqs = [
  {
    q: "Funciona em qualquer moto?",
    a: "Em qualquer moto a gasolina, etanol ou flex — urbana, trail, sport, scooter, moto de entrega. O CarboZé é compatível com todos os combustíveis líquidos e não interfere em nenhum componente mecânico.",
  },
  {
    q: "Por que 10ml e não mais? A dose não deveria ser maior?",
    a: "A proporção correta é 1ml para cada 1.000ml de combustível. O sachê de 10ml trata exatamente 10L — o tanque cheio da maioria das motos brasileiras. Aumentar a dose não melhora o resultado; a fórmula já é calculada para eficiência máxima nessa proporção.",
  },
  {
    q: "Quanto tempo até sentir diferença na prática?",
    a: "Muitos usuários relatam melhora na partida e na suavidade já no primeiro sachê. O efeito de limpeza progressiva se completa após 3 abastecimentos consecutivos — a partir daí o motor está trabalhando no seu estado ótimo.",
  },
  {
    q: "Preciso usar toda vez que abastecer?",
    a: "Sim. A cada abastecimento entra combustível novo que precisa ser estabilizado. O tratamento funciona por acumulação — interromper desfaz parte do progresso. Use sempre: é R$ 5,99 para proteger um motor que pode custar muito mais para consertar.",
  },
];

export default function FAQ({ dark = false }: { dark?: boolean }) {
  return (
    <section
      id="faq"
      className={`${dark ? "bg-verde-escuro" : "bg-off-white"} py-16 md:py-28`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Label */}
        <p className={`font-[family-name:var(--font-archivo)] text-xs uppercase tracking-[0.18em] mb-3 ${dark ? "text-white/30" : "text-verde-escuro/40"}`}>
          Dúvidas frequentes
        </p>

        <h2 className={`font-[family-name:var(--font-basement)] font-extrabold uppercase text-3xl sm:text-4xl md:text-5xl leading-tight mb-12 ${dark ? "text-white" : "text-verde-escuro"}`}>
          Perguntas e respostas
        </h2>

        <div className="max-w-2xl">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className={`group border-b last:border-0 ${dark ? "border-white/8" : "border-verde-escuro/8"}`}
            >
              <summary className={`flex items-center justify-between gap-6 py-6 font-[family-name:var(--font-basement)] font-bold text-base md:text-lg select-none cursor-pointer list-none ${dark ? "text-white" : "text-verde-escuro"}`}>
                {faq.q}
                <span className={`faq-icon shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-transform duration-300 ${dark ? "border-white/15 text-limao" : "border-verde-escuro/15 text-verde-medio"}`}>
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
              </summary>
              <div className="faq-content pb-6 -mt-1">
                <p className={`font-[family-name:var(--font-archivo)] text-sm md:text-base leading-relaxed ${dark ? "text-white/55" : "text-verde-escuro/60"}`}>
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
