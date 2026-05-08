export default function Sachet() {
  return (
    <section className="bg-off-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5">
        {/* Headline — full width */}
        <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-verde-escuro text-2xl sm:text-3xl md:text-4xl leading-tight mb-10">
          Calibrado para o tanque da moto.{" "}
          <span className="text-verde-medio">Sem sobra, sem desperdício.</span>
        </h2>

        {/* 2 colunas: corpo (esq) + specs destaque (dir) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
          {/* Coluna esquerda: corpo */}
          <div className="space-y-4 font-[family-name:var(--font-archivo)] text-verde-escuro/80 text-base md:text-lg leading-relaxed">
            <p>
              A proporção do CarboZé é 1ml para cada 1.000ml de combustível. O
              sachê de 10ml foi calibrado para tratar exatamente 10L, o tanque
              cheio da grande maioria das motos brasileiras.
            </p>
            <p>
              Um sachê por abastecimento. Você rasga, despeja no tanque antes
              de abastecer e pronto.
            </p>
          </div>

          {/* Coluna direita: destaque numérico / specs */}
          <div className="bg-verde-escuro rounded-2xl p-7">
            <p className="font-[family-name:var(--font-barlow)] font-bold uppercase text-limao text-xs tracking-widest mb-5">
              Especificações
            </p>
            <ul className="space-y-4">
              {[
                "10ml trata até 10L de combustível",
                "Compatível com gasolina e etanol",
                "Um sachê = um abastecimento completo protegido",
              ].map((spec) => (
                <li
                  key={spec}
                  className="flex items-start gap-3 font-[family-name:var(--font-archivo)] text-white text-base"
                >
                  <span className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-limao" />
                  {spec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
