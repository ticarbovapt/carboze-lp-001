export default function Problem() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5">
        {/* Headline atualizado */}
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-2xl sm:text-3xl md:text-4xl leading-tight mb-10">
          A moto está bebendo mais que o normal e começando a falhar por uma
          razão que ninguém explica direito.
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
            <h3 className="font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-lg mb-3">
              Partida falhando de manhã
            </h3>
            <p className="font-[family-name:var(--font-archivo)] text-white/70 text-sm leading-relaxed">
              Combustível com resíduo de umidade não dá bem quando o motor está
              frio. Você tenta, tenta, gasta energia e já se aborrece.
            </p>
          </div>
          <div className="bg-verde-escuro rounded-2xl p-6">
            <h3 className="font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-lg mb-3">
              Bico entupindo antes do prazo
            </h3>
            <p className="font-[family-name:var(--font-archivo)] text-white/70 text-sm leading-relaxed">
              A ineficiência da queima do combustível entope bicos injetores
              mais rápido. A revisão chega antes do tempo, geralmente, sempre no
              pior momento.
            </p>
          </div>
        </div>

        {/* Parágrafo conceitual — fundo verde escuro */}
        <div className="bg-verde-escuro rounded-2xl p-7 md:p-9">
          <p className="font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-xs tracking-widest mb-4">
            O porquê do nome
          </p>
          <p className="font-[family-name:var(--font-archivo)] text-white/80 text-base md:text-lg leading-relaxed">
            O CarboZé leva esse nome por um motivo. O Zé Gotinha ensinou o
            Brasil a entender prevenção, a ideia de que você protege antes de
            precisar remediar. O Zé, um apelido carinhoso para os muitos Zés do
            nosso país, também é o cara que resolve, que é pau pra toda obra,
            que não tem tempo ruim, que aparece, que não deixa na mão.
          </p>
          <p className="font-[family-name:var(--font-archivo)] text-white/80 text-base md:text-lg leading-relaxed mt-4">
            O produto foi concebido com essa lógica: é a vacina que você aplica
            a cada abastecimento, é o Zé presente a cada tanque abastecido,
            mantendo seu sistema mais eficiente e protegido.
          </p>
        </div>
      </div>
    </section>
  );
}
