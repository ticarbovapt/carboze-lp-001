import CTAButton from "./CTAButton";

export default function CostValue() {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5">
        {/* Headline — full width */}
        <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-white text-2xl sm:text-3xl md:text-4xl leading-tight mb-10">
          R$ 5,99 por tanque.{" "}
          <span className="text-limao">
            O custo de proteger a ferramenta do seu trabalho e gera uma economia
            maior que seu investimento.
          </span>
        </h2>

        {/* 2 colunas: corpo (esq) + destaque numérico (dir) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div className="space-y-4 font-[family-name:var(--font-archivo)] text-white/75 text-base md:text-lg leading-relaxed">
            <p>
              Para quem abastece a moto duas vezes por semana, o pack de 10
              sachês dura mais de um mês. São R$ 59,90 para manter o motor
              limpo, a partida funcionando e os bicos injetores longe da
              oficina.
            </p>
            <p>
              A queima eficiente do combustível reduz desperdício e devolve o
              que estava sendo perdido em consumo, essa é a primeira economia!
            </p>
            <p>
              Colocado contra o custo de uma limpeza de bico injetor ou de um
              dia parado sem conseguir trabalhar, o sachê deixa de ser gasto e
              passa a ser o investimento mais barato da manutenção da moto.
            </p>
          </div>

          {/* Destaque numérico */}
          <div className="bg-white/10 rounded-2xl p-7 flex flex-col justify-center gap-3">
            <p className="font-[family-name:var(--font-barlow)] font-bold uppercase text-limao text-xs tracking-widest">
              Resumindo
            </p>
            <p className="font-[family-name:var(--font-barlow)] font-extrabold text-white text-xl md:text-2xl leading-snug">
              10 sachês{" "}
              <span className="text-white/40">=</span>{" "}
              10 tanques{" "}
              <span className="text-white/40">=</span>{" "}
              <span className="text-limao">mais de 1 mês de proteção</span>{" "}
              <span className="text-white/40">=</span>{" "}
              <span className="text-limao">R$ 59,90</span>
            </p>
          </div>
        </div>

        <CTAButton label="QUERO O PACK DE 10 SACHÊS" size="large" />
      </div>
    </section>
  );
}
