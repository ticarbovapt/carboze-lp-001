/* SVG icons — combustível, umidade, engrenagem */
function FuelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <path d="M4 22V6a2 2 0 012-2h8a2 2 0 012 2v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 10l3-3 1 1v6a1 1 0 01-1 1h-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 22h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M8 10h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function WaterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0c0-5-7-13-7-13z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M8.5 17a3.5 3.5 0 006.5-1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

const problems = [
  {
    Icon: FuelIcon,
    title: "Combustível degradado",
    body: "A qualidade do combustível varia entre postos e lotes — e o motor absorve cada variação.",
  },
  {
    Icon: WaterIcon,
    title: "Umidade e contaminação",
    body: "Água e partículas entram no tanque a cada abastecimento e comprometem a combustão.",
  },
  {
    Icon: GearIcon,
    title: "Desgaste silencioso",
    body: "Bicos injetores, bomba de combustível e sistema de injeção se desgastam invisívelmente — até a conta chegar.",
  },
];

export default function Problem100() {
  return (
    <section className="bg-off-white py-16 md:py-28">
      <div className="max-w-6xl mx-auto px-5">
        <div className="max-w-2xl mb-12">
          <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight mb-5">
            O combustível também envelhece —{" "}
            <span className="text-verde-medio">e o motor sente.</span>
          </h2>
          <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-base md:text-lg leading-relaxed">
            Degradação durante o armazenamento, contaminantes e variação de
            qualidade afetam a combustão, aumentam o consumo e aceleram desgastes
            — em qualquer tipo de veículo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {problems.map((p) => (
            <div
              key={p.title}
              className="bg-verde-escuro rounded-2xl p-7 flex flex-col gap-5"
            >
              <span className="text-limao/80">
                <p.Icon />
              </span>
              <div>
                <h3 className="font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-base mb-2">
                  {p.title}
                </h3>
                <p className="font-[family-name:var(--font-archivo)] text-white/60 text-sm leading-relaxed">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
