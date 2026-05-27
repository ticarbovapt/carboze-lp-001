/* SVG icons */
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
    body: "A qualidade do combustível varia entre postos e lotes — e o motor absorve cada variação. Oxidação, depósitos e queima ineficiente se acumulam silenciosamente.",
  },
  {
    Icon: WaterIcon,
    title: "Umidade e contaminação",
    body: "Água e partículas entram no tanque a cada abastecimento e comprometem a combustão. O etanol e o biodiesel brasileiros absorvem umidade mais do que qualquer outro combustível.",
  },
  {
    Icon: GearIcon,
    title: "Desgaste silencioso",
    body: "Bicos injetores, bomba de combustível e sistema de injeção se desgastam invisívelmente — até a conta chegar na oficina, sempre no pior momento.",
  },
];

export default function Problem100() {
  return (
    <section className="bg-white py-16 md:py-28">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Headline + body */}
        <div className="max-w-3xl mb-12">
          <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight mb-8">
            O motor não avisa quando está sendo destruído por dentro.
          </h2>

          <div className="space-y-5 font-[family-name:var(--font-archivo)] text-verde-escuro/65 text-base md:text-lg leading-relaxed">
            <p>
              <strong className="font-semibold text-verde-escuro">A gasolina brasileira tem 30% de etanol.</strong>{" "}
              O diesel brasileiro tem{" "}
              <strong className="font-semibold text-verde-escuro">
                um dos maiores percentuais de biodiesel do mundo, 15%
              </strong>.
              Essa mistura, que não existe em nenhum outro país, atrai umidade de forma constante,
              oxida mais rápido que combustíveis convencionais e deposita borras e crostas no sistema
              de combustão antes de qualquer sintoma aparecer no painel.
            </p>
            <p>
              O problema não é o posto que você escolhe. É a composição química do combustível que
              qualquer posto vende. E os aditivos que dominam as prateleiras de alta qualidade foram
              desenvolvidos para o combustível europeu, americano, asiático. Não para o nosso. Além
              de, muitas vezes, serem bem caros e difíceis de sustentar.
            </p>
          </div>
        </div>

        {/* 3 cards — estilo claro */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {problems.map((p) => (
            <div
              key={p.title}
              className="bg-verde-escuro/[0.06] border border-verde-escuro/10 rounded-2xl p-7 flex flex-col gap-5"
            >
              <span className="text-verde-escuro/70">
                <p.Icon />
              </span>
              <div>
                <h3 className="font-[family-name:var(--font-basement)] font-bold uppercase text-verde-escuro text-base mb-2">
                  {p.title}
                </h3>
                <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm leading-relaxed">
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
