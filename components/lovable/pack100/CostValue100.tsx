import CTAButton from "../CTAButton";

export default function CostValue100() {
  return (
    <section className="bg-off-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5">
        <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-verde-escuro text-2xl sm:text-3xl md:text-4xl leading-tight mb-10">
          R$ [A DEFINIR] por frasco.{" "}
          <span className="text-verde-medio">
            O custo de proteger o motor por 100 litros — com retorno maior que
            o investimento.
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Coluna esquerda */}
          <div>
            <div className="space-y-4 font-[family-name:var(--font-archivo)] text-verde-escuro text-base md:text-lg leading-relaxed mb-8">
              <p className="font-bold">
                Um frasco de 100ml trata 100 litros de combustível no uso
                padrão. Para quem abastece carro regularmente, isso representa
                semanas de proteção contínua por menos do que uma pizza.
              </p>
              <p className="font-bold">
                A queima eficiente reduz desperdício e devolve o que estava
                sendo perdido em consumo — essa é a primeira economia. A
                segunda é evitar a oficina antes da hora.
              </p>
              <p className="font-bold">
                Colocado contra o custo de uma limpeza de bico injetor, uma
                descarbonização ou um dia parado sem poder trabalhar, o
                CarboZé 100ml é o investimento mais barato da manutenção do
                seu veículo.
              </p>
            </div>
            <CTAButton label="QUERO O PACK 100ML" size="large" href="/checkoutpack100" />
          </div>

          {/* Coluna direita — imagem produto */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-verde-escuro/10 aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/produto-dobra5.png"
              alt="Pack CarboZé 100ml"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
