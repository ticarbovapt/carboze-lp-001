const bullets = [
  "Menos desperdício = mais km por litro a cada tanque",
  "Motor limpo = menos manutenção corretiva e menos oficina",
  "Proteção constante = durabilidade real do seu investimento",
];

export default function MoneyBurn() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight mb-10">
          Não é aditivo de posto.{" "}
          <span className="text-verde-medio">É a vacina que otimiza o seu bolso.</span>
        </h2>

        <ul className="space-y-5">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-4">
              {/* Check icon */}
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

      </div>
    </section>
  );
}
