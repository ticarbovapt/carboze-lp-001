export default function Problem() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5">
        {/* Headline */}
        <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-verde-escuro text-2xl sm:text-3xl md:text-4xl leading-tight mb-10">
          Moto mais gastona e começando a falhar por uma razão que ninguém sabe
          explicar corretamente.
        </h2>

        {/* Body copy */}
        <div className="space-y-5 font-[family-name:var(--font-archivo)] text-verde-escuro/80 text-base md:text-lg leading-relaxed mb-10">
          <p>
            A gasolina brasileira tem 30% de etanol (com previsão de aumento
            para 32%{" "}
            <span className="font-semibold text-verde-escuro">[E32]</span>).
            Etanol absorve umidade do ar de forma mais rápida e contínua. Dentro
            do tanque de uma moto, com volume menor e variações maiores de
            temperatura ao longo do dia, esse processo acontece{" "}
            <strong className="text-verde-escuro">
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
            <strong className="text-verde-escuro">
              É o combustível trabalhando contra o sistema,
            </strong>{" "}
            abastecimento após abastecimento, muitas vezes, sem que nada apareça
            no painel para avisar.
          </p>
        </div>

        {/* 2 cards — fundo verde escuro, título limão */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <div className="bg-verde-escuro rounded-2xl p-6">
            <h3 className="font-[family-name:var(--font-barlow)] font-bold uppercase text-limao text-lg mb-3">
              Partida falhando de manhã
            </h3>
            <p className="font-[family-name:var(--font-archivo)] text-white/70 text-sm leading-relaxed">
              Combustível com resíduo de umidade não ignita bem quando o motor está frio. Você tenta, tenta, gasta energia e já se aborrece antes de sair de casa.
            </p>
            <p className="font-[family-name:var(--font-archivo)] text-white/70 text-sm leading-relaxed mt-2">
              Com o tempo, o motor começa a depender de tentativas extras a cada manhã — sinal claro de degradação silenciosa no sistema.
            </p>
          </div>
          <div className="bg-verde-escuro rounded-2xl p-6">
            <h3 className="font-[family-name:var(--font-barlow)] font-bold uppercase text-limao text-lg mb-3">
              Bico entupindo antes do prazo
            </h3>
            <p className="font-[family-name:var(--font-archivo)] text-white/70 text-sm leading-relaxed">
              A ineficiência da queima do combustível entope bicos injetores
              mais rápido. A revisão chega antes do tempo, geralmente, sempre no
              pior momento.
            </p>
          </div>
        </div>

        {/* Parágrafo conceitual — vacina do motor */}
        <div className="mt-10 bg-verde-escuro/5 border-l-4 border-verde-medio rounded-r-2xl p-6 max-w-2xl">
          <p className="font-[family-name:var(--font-archivo)] text-verde-escuro text-base md:text-lg leading-relaxed">
            Pense no CarboZé como uma{" "}
            <strong className="text-verde-escuro">vacina do motor</strong> — você aplica antes do problema aparecer, a cada abastecimento, para que o dano nunca aconteça.
          </p>
        </div>

      </div>
    </section>
  );
}
