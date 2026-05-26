export default function Problem() {
  return (
    <section className="bg-white py-16 md:py-28">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Headline */}
        <div className="max-w-3xl mb-12">
          <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight mb-8">
            Moto mais gastona e começando a falhar por uma razão que ninguém sabe
            explicar corretamente.
          </h2>

          {/* Body copy */}
          <div className="space-y-5 font-[family-name:var(--font-archivo)] text-verde-escuro/65 text-base md:text-lg leading-relaxed">
            <p>
              A gasolina brasileira tem 30% de etanol (com previsão de aumento
              para 32%{" "}
              <span className="font-medium text-verde-escuro/80">[E32]</span>).
              Etanol absorve umidade do ar de forma mais rápida e contínua. Dentro
              do tanque de uma moto, com volume menor e variações maiores de
              temperatura ao longo do dia, esse processo acontece{" "}
              <strong className="text-verde-escuro font-semibold">
                mais rápido do que em qualquer carro.
              </strong>
            </p>
            <p>
              A umidade deixa a queima do combustível prejudicada, a oxidação
              aumenta e o motor que rodava redondo começa a engasgar na partida
              fria, perder força na subida ou consumir mais sem motivo aparente.
            </p>
            <p>
              Não é desgaste normal.{" "}
              <strong className="text-verde-escuro font-semibold">
                É o combustível trabalhando contra o sistema,
              </strong>{" "}
              abastecimento após abastecimento, muitas vezes, sem que nada apareça
              no painel para avisar.
            </p>
          </div>
        </div>

        {/* 2 cards — fundo verde escuro, título limão */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          <div className="bg-verde-escuro rounded-2xl p-8 border-l-4 border-limao">
            <h3 className="font-[family-name:var(--font-barlow)] font-bold uppercase text-limao text-lg mb-4">
              Partida falhando de manhã
            </h3>
            <p className="font-[family-name:var(--font-archivo)] text-white/60 text-sm leading-relaxed">
              Combustível com resíduo de umidade não ignita bem quando o motor está frio. Você tenta, tenta, gasta energia e já se aborrece antes de sair de casa.
            </p>
            <p className="font-[family-name:var(--font-archivo)] text-white/60 text-sm leading-relaxed mt-3">
              Com o tempo, o motor começa a depender de tentativas extras a cada manhã — sinal claro de degradação silenciosa no sistema.
            </p>
          </div>
          <div className="bg-verde-escuro rounded-2xl p-8 border-l-4 border-limao">
            <h3 className="font-[family-name:var(--font-barlow)] font-bold uppercase text-limao text-lg mb-4">
              Bico entupindo antes do prazo
            </h3>
            <p className="font-[family-name:var(--font-archivo)] text-white/60 text-sm leading-relaxed">
              A ineficiência da queima do combustível entope bicos injetores
              mais rápido. A revisão chega antes do tempo, geralmente, sempre no
              pior momento.
            </p>
          </div>
        </div>

        {/* Conceitual */}
        <div className="bg-verde-escuro/4 border-l-4 border-verde-medio rounded-r-2xl p-7 max-w-2xl">
          <p className="font-[family-name:var(--font-archivo)] text-verde-escuro text-base md:text-lg leading-relaxed">
            Pense no CarboZé como uma{" "}
            <strong className="font-semibold">vacina do motor</strong> — você aplica antes do problema aparecer, a cada abastecimento, para que o dano nunca aconteça.
          </p>
        </div>
      </div>
    </section>
  );
}
