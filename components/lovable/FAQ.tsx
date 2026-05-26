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

export default function FAQ() {
  return (
    <section id="faq" className="bg-off-white py-16 md:py-28">
      <div className="max-w-6xl mx-auto px-5">
        <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight mb-12">
          Perguntas e respostas
        </h2>

        <div className="max-w-3xl">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group border-b border-verde-escuro/8 last:border-0"
            >
              <summary className="flex items-center justify-between gap-6 py-6 font-[family-name:var(--font-barlow)] font-bold text-verde-escuro text-base md:text-lg select-none cursor-pointer list-none">
                {faq.q}
                <span className="shrink-0 w-6 h-6 rounded-full border border-verde-escuro/15 flex items-center justify-center text-verde-medio transition-transform duration-300 group-open:rotate-45">
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
              </summary>
              <div className="pb-6 -mt-1">
                <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm md:text-base leading-relaxed max-w-2xl">
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
