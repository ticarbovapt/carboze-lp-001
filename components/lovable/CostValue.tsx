import CTAButton from "./CTAButton";

export default function CostValue() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Headline full-width */}
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-2xl sm:text-3xl md:text-4xl leading-tight text-center mb-10">
          R$ 5,99 por tanque.{" "}
          <span className="text-verde-medio">
            O custo de proteger a ferramenta do seu trabalho — e gerar uma economia maior que seu investimento.
          </span>
        </h2>

        {/* 2 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* Coluna esquerda — texto + CTA */}
          <div>
            <div className="space-y-4 font-[family-name:var(--font-archivo)] text-verde-escuro/80 text-base md:text-lg leading-relaxed mb-8">
              <p>
                Para quem abastece a moto duas vezes por semana, o kit com 10 sachês dura
                mais de um mês. São R$ 59,90 para manter o motor limpo, a partida funcionando
                e os bicos injetores longe da oficina.
              </p>
              <p>
                A queima eficiente do combustível reduz desperdício e devolve o que estava
                sendo perdido em consumo — essa é a primeira economia!
              </p>
              <p>
                Colocado contra o custo de uma limpeza de bico injetor ou de um dia parado
                sem conseguir trabalhar, o sachê deixa de ser gasto e passa a ser o
                investimento mais barato da manutenção da moto.
              </p>
            </div>
            <CTAButton label="QUERO O KIT DE 10 SACHÊS" size="large" href="/checkoutsache" />
          </div>

          {/* Coluna direita — foto produto + overlay RESUMINDO */}
          <div className="relative w-full rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/lp-produto-secao5.png"
              alt="CarboZé — Pack 10 Sachês"
              className="w-full object-contain"
            />
            {/* Overlay RESUMINDO */}
            <div className="bg-verde-escuro px-5 py-4">
              <p className="font-[family-name:var(--font-basement)] font-bold text-white/40 text-[10px] uppercase tracking-widest mb-1">
                Resumindo
              </p>
              <p className="font-[family-name:var(--font-basement)] font-extrabold text-white text-sm md:text-base leading-snug">
                10 SACHÊS = 10 TANQUES ={" "}
                <span className="text-limao">MAIS DE 1 MÊS DE PROTEÇÃO</span>{" "}
                = R$ 59,90
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
