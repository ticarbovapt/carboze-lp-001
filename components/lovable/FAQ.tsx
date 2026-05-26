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
    <section id="faq" className="bg-off-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5">
        <p className="font-[family-name:var(--font-barlow)] font-bold uppercase text-verde-escuro/50 text-xs tracking-widest mb-4">
          Dúvidas frequentes
        </p>
        <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-verde-escuro text-2xl sm:text-3xl md:text-4xl leading-tight mb-10">
          Perguntas e respostas
        </h2>

        <div className="max-w-3xl space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-white border border-verde-escuro/10 rounded-2xl overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-6 py-5 font-[family-name:var(--font-barlow)] font-bold text-verde-escuro text-base md:text-lg select-none">
                {faq.q}
                <span className="faq-icon shrink-0 text-verde-medio text-2xl font-light transition-transform duration-300">
                  +
                </span>
              </summary>
              <div className="faq-content">
                <p className="px-6 pb-5 font-[family-name:var(--font-archivo)] text-verde-escuro/70 text-sm md:text-base leading-relaxed">
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
