const bullets = [
  "Menos desperdício = mais km por litro a cada tanque",
  "Motor limpo = menos manutenção corretiva e menos oficina",
  "Proteção constante = durabilidade real do seu investimento",
];

const metrics = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-limao" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Queima completa",
    body: "Menos CO e hidrocarbonetos não queimados na atmosfera.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-limao" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Menos desperdício",
    body: "Menos combustível para o mesmo resultado, do poço ao tanque.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-limao" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Renovável otimizado",
    body: "Etanol e biodiesel aproveitados ao máximo a cada ciclo.",
  },
];

export default function BeneficiosHome() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Badge — conceito da vacina */}
        <span className="inline-flex items-center gap-1.5 bg-limao/10 border border-limao/30 text-verde-escuro text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full font-[family-name:var(--font-basement)] mb-5">
          A vacina do combustível
        </span>

        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight mb-5">
          Não é aditivo de posto.{" "}
          <span className="text-verde-medio">É a vacina que otimiza o seu bolso.</span>
        </h2>

        {/* Conceito — uma linha */}
        <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-base md:text-lg leading-relaxed max-w-2xl mb-10">
          Assim como a vacina age antes da doença, o CarboZé trata o combustível antes do dano
          acontecer — a cada tanque, sem esforço nenhum da sua parte.
        </p>

        {/* Benefícios econômicos */}
        <ul className="space-y-5 mb-12">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-4">
              <span className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-limao flex items-center justify-center">
                <svg viewBox="0 0 12 12" fill="none" className="w-3.5 h-3.5">
                  <path d="M2 6.5L4.5 9L10 3" stroke="#093a30" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/75 text-base md:text-lg leading-relaxed">
                {bullet}
              </p>
            </li>
          ))}
        </ul>

        {/* Faixa sustentabilidade — bloco escuro dentro da seção clara */}
        <div className="bg-verde-escuro rounded-2xl p-8 md:p-10">
          <h3 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-xl md:text-2xl leading-tight mb-7">
            E o que é bom pro bolso{" "}
            <span className="text-limao">é bom pro planeta.</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {metrics.map((m) => (
              <div key={m.title} className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-limao/15 flex items-center justify-center">
                  {m.icon}
                </div>
                <div>
                  <h4 className="font-[family-name:var(--font-basement)] font-bold text-white text-base mb-1">
                    {m.title}
                  </h4>
                  <p className="font-[family-name:var(--font-archivo)] text-white/60 text-sm leading-relaxed">
                    {m.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
