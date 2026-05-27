export default function Problem() {
  return (
    <section className="bg-white py-16 md:py-28">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Headline — centralizado */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight mb-8">
            Moto mais gastona e começando a falhar por uma razão que ninguém sabe explicar.
          </h2>

          {/* Texto de apoio */}
          <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/65 text-base md:text-lg leading-relaxed">
            A gasolina brasileira tem 30% de etanol. Etanol absorve umidade do ar de forma
            contínua. Dentro do tanque de uma moto — com volume menor e variações maiores de
            temperatura — esse processo acontece mais rápido do que em qualquer carro.
            O motor engasga, perde força, consome mais. Não é desgaste normal. É o combustível
            trabalhando contra o sistema.
          </p>
        </div>

        {/* 2 cards — consequências */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          <div className="bg-verde-escuro/[0.06] border border-verde-escuro/10 rounded-2xl p-8">
            <h3 className="font-[family-name:var(--font-basement)] font-bold uppercase text-verde-escuro text-lg mb-4">
              Partida falhando de manhã
            </h3>
            <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm leading-relaxed">
              Combustível com resíduo de umidade não ignita bem quando o motor está frio. Você
              tenta, tenta, gasta energia e já se aborrece antes de sair de casa.
            </p>
            <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm leading-relaxed mt-3">
              Com o tempo, o motor começa a depender de tentativas extras a cada manhã —
              sinal claro de degradação silenciosa no sistema.
            </p>
          </div>
          <div className="bg-verde-escuro/[0.06] border border-verde-escuro/10 rounded-2xl p-8">
            <h3 className="font-[family-name:var(--font-basement)] font-bold uppercase text-verde-escuro text-lg mb-4">
              Bico entupindo antes do prazo
            </h3>
            <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm leading-relaxed">
              A ineficiência da queima do combustível entope bicos injetores mais rápido.
              A revisão chega antes do tempo, geralmente, sempre no pior momento.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
