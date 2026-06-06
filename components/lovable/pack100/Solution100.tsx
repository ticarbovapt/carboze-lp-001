const mechanisms = [
  {
    num: "01",
    title: "Estabiliza o combustível",
    body: "Retarda a oxidação e prolonga a vida útil do combustível no tanque — essencial para veículos que ficam dias sem rodar.",
  },
  {
    num: "02",
    title: "Elimina a umidade",
    body: "Encapsula a água presente no combustível, impedindo que ela danifique o sistema de injeção e cause oxidação interna.",
  },
  {
    num: "03",
    title: "Otimiza a combustão",
    body: "Melhora a eficiência da queima, gerando mais energia por litro abastecido. Menos consumo, mais resposta.",
  },
  {
    num: "04",
    title: "Protege o sistema de injeção",
    body: "Melhora a lubricidade e reduz o acúmulo de depósitos nos bicos injetores — revisão chega na hora certa.",
  },
];

export default function Solution100() {
  return (
    <section className="bg-white py-16 md:py-28">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl mb-14">
          <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight mb-5">
            Do tanque até a câmara de combustão.{" "}
            <span className="text-verde-medio">O tratamento é completo.</span>
          </h2>
          <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-base md:text-lg leading-relaxed">
            Uma fórmula multifuncional que atua em quatro frentes: protege, otimiza e preserva
            — a cada abastecimento, em qualquer combustível.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {mechanisms.map((m) => (
            <div
              key={m.num}
              className="bg-verde-escuro/[0.05] border border-verde-escuro/10 rounded-2xl p-7 flex flex-col gap-5"
            >
              <span className="font-[family-name:var(--font-basement)] font-extrabold text-verde-escuro/20 text-4xl leading-none select-none">
                {m.num}
              </span>
              <div>
                <h3 className="font-[family-name:var(--font-basement)] font-bold uppercase text-verde-escuro text-base leading-snug mb-3">
                  {m.title}
                </h3>
                <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm leading-relaxed">
                  {m.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
