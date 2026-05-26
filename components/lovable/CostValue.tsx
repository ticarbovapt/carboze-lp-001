import CTAButton from "./CTAButton";

export default function CostValue() {
  return (
    <section className="bg-off-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5">
        {/* Headline */}
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-2xl sm:text-3xl md:text-4xl leading-tight mb-10">
          R$ 5,99 por tanque.{" "}
          <span className="text-verde-medio">
            O custo de proteger a ferramenta do seu trabalho — e gerar uma
            economia maior que seu investimento.
          </span>
        </h2>

        {/* 2 colunas: corpo + botão (esq) | imagem produto (dir) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Coluna esquerda — parágrafos + botão */}
          <div>
            <div className="space-y-4 font-[family-name:var(--font-archivo)] text-verde-escuro text-base md:text-lg leading-relaxed mb-8">
              <p className="font-bold">
                Para quem abastece a moto duas vezes por semana, o pack de 10
                sachês dura mais de um mês. São R$ 59,90 para manter o motor
                limpo, a partida funcionando e os bicos injetores longe da
                oficina.
              </p>
              <p className="font-bold">
                A queima eficiente do combustível reduz desperdício e devolve o
                que estava sendo perdido em consumo — essa é a primeira economia!
              </p>
              <p className="font-bold">
                Colocado contra o custo de uma limpeza de bico injetor ou de um
                dia parado sem conseguir trabalhar, o sachê deixa de ser gasto e
                passa a ser o investimento mais barato da manutenção da moto.
              </p>
            </div>
            <CTAButton label="QUERO O PACK DE 10 SACHÊS" size="large" href="/checkoutsache" />
          </div>

          {/* Coluna direita — imagem do produto */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-verde-escuro/10 aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/lp-produto-secao5.png"
              alt="Pack CarboZé — 10 sachês"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
