import CTAButton from "@/components/lovable/CTAButton";
import { WHATSAPP_URL } from "@/lib/constants";

const faqs = [
  {
    q: "Por que um produto novo vai funcionar melhor que marcas consagradas?",
    a: "Porque foi desenvolvido para o combustível brasileiro atual — com alta concentração de etanol e biodiesel compulsório. Marcas consagradas foram formuladas para um cenário diferente e não acompanharam as mudanças na composição dos combustíveis no Brasil.",
  },
  {
    q: "Funciona com qualquer combustível?",
    a: "Sim. O CarboZé é compatível com gasolina comum, gasolina aditivada, etanol hidratado, flex, diesel B12 e diesel aditivado. Qualquer combustível líquido vendido nos postos brasileiros.",
  },
  {
    q: "Quando vou sentir diferença?",
    a: "A maioria dos usuários nota melhora na partida fria e na resposta do acelerador já no primeiro uso. O efeito de limpeza progressiva se completa em 3 abastecimentos consecutivos — a partir daí o motor opera em estado ótimo.",
  },
  {
    q: "O CarboZé danifica o motor ou a bomba de combustível?",
    a: "Não. A fórmula é inerte para todos os materiais do sistema de combustível — borracha, metal, plástico e vedações. O CarboZé foi testado em motores a gasolina, flex e diesel sem apresentar nenhum efeito adverso.",
  },
  {
    q: "Preciso usar a cada abastecimento?",
    a: "Sim, porque a cada abastecimento entra combustível novo sem tratamento. O efeito é cumulativo: quanto mais regular o uso, mais limpo e protegido o sistema. Interromper o tratamento desfaz parte do progresso acumulado.",
  },
];

export default function FAQInstitucional() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Label */}
        <p className="font-[family-name:var(--font-archivo)] text-xs uppercase tracking-[0.18em] text-verde-escuro/40 mb-3">
          Dúvidas Frequentes
        </p>

        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight mb-12">
          Perguntas e respostas
        </h2>

        {/* Accordion */}
        <div className="max-w-3xl mb-10">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group border-b border-verde-escuro/8 last:border-0"
            >
              <summary className="flex items-center justify-between gap-6 py-6 font-[family-name:var(--font-basement)] font-bold text-verde-escuro text-base md:text-lg select-none cursor-pointer list-none">
                {faq.q}
                <span className="faq-icon shrink-0 w-6 h-6 rounded-full border border-verde-escuro/15 flex items-center justify-center text-verde-medio transition-transform duration-300">
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
              </summary>
              <div className="faq-content pb-6 -mt-1">
                <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm md:text-base leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <CTAButton label="TENHO DÚVIDAS" href={WHATSAPP_URL} />
        </div>
      </div>
    </section>
  );
}
