const metrics = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-limao" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Queima completa",
    body: "Menos emissões de CO e hidrocarbonetos não queimados lançados na atmosfera a cada ciclo do motor.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-limao" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Menos desperdício",
    body: "Menos combustível para o mesmo resultado. Menos extração, menos transporte, menos impacto na cadeia.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-limao" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Energia renovável otimizada",
    body: "O etanol e o biodiesel são aproveitados ao máximo — mais energia renovável, menos dependência de combustível fóssil.",
  },
];

export default function SustentabilidadeSection() {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

          {/* Col esq — copy */}
          <div>
            <p className="font-[family-name:var(--font-archivo)] text-xs uppercase tracking-[0.18em] text-white/30 mb-3">
              Sustentabilidade
            </p>
            <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl md:text-5xl leading-tight mb-6">
              Proteger o motor é proteger o planeta.
            </h2>
            <p className="font-[family-name:var(--font-archivo)] text-white/60 text-base leading-relaxed mb-4">
              Quando o motor queima combustível de forma mais eficiente, menos resíduos são
              lançados na atmosfera. O CarboZé otimiza a combustão, resultando em uma queima
              mais limpa e completa a cada ciclo — sem nenhum esforço adicional do motorista.
            </p>
            <p className="font-[family-name:var(--font-archivo)] text-white/60 text-base leading-relaxed">
              Com os injetores limpos e a mistura estabilizada, o motor precisa de menos
              combustível para realizar o mesmo trabalho. Isso significa menos extração,
              menos transporte e menos impacto ao longo de toda a cadeia de energia.
            </p>
          </div>

          {/* Col dir — 3 metric cards */}
          <div className="space-y-4">
            {metrics.map((m) => (
              <div
                key={m.title}
                className="bg-white/[0.07] rounded-2xl p-6 border border-white/10 flex items-start gap-4"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-limao/15 flex items-center justify-center">
                  {m.icon}
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-basement)] font-bold text-white text-base mb-1">
                    {m.title}
                  </h3>
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
