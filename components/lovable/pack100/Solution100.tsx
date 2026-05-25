const mechanisms = [
  {
    title: "Estabiliza o combustível",
    body: "Retarda a oxidação e prolonga a vida útil do combustível no tanque.",
  },
  {
    title: "Elimina a umidade",
    body: "Encapsula a água presente no combustível, impedindo que ela danifique o sistema de injeção.",
  },
  {
    title: "Otimiza a combustão",
    body: "Melhora a eficiência da queima, gerando mais energia por litro abastecido.",
  },
  {
    title: "Protege o sistema de injeção",
    body: "Melhora a lubricidade e reduz o acúmulo de depósitos nos bicos injetores.",
  },
  {
    title: "Reduz emissões",
    body: "Combustão mais eficiente significa menos fumaça, menos CO e menos resíduo.",
  },
  {
    title: "Combate bactérias (Diesel B15)",
    body: "Inibe a proliferação de microrganismos no biodiesel, um problema crescente com o B15.",
  },
];

export default function Solution100() {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5">
        <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-white text-2xl sm:text-3xl md:text-4xl leading-tight mb-4">
          Como o CarboZé{" "}
          <span className="text-limao">age no combustível</span>
        </h2>
        <p className="font-[family-name:var(--font-archivo)] text-white/70 text-base md:text-lg leading-relaxed mb-10 max-w-2xl">
          Uma fórmula multifuncional que atua em três frentes: protege, otimiza
          e preserva — a cada abastecimento.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mechanisms.map((m) => (
            <div
              key={m.title}
              className="bg-white/10 rounded-2xl p-6 flex flex-col gap-3"
            >
              <span className="w-2 h-2 rounded-full bg-limao shrink-0" />
              <h3 className="font-[family-name:var(--font-barlow)] font-bold uppercase text-limao text-sm">
                {m.title}
              </h3>
              <p className="font-[family-name:var(--font-archivo)] text-white/70 text-sm leading-relaxed">
                {m.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
