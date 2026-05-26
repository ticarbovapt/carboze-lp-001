import CTAButton from "../CTAButton";

export default function CostValue100() {
  return (
    <section className="bg-off-white py-16 md:py-28">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl mb-12">
          <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight mb-5">
            R$ 149,90 por frasco.{" "}
            <span className="text-verde-medio">
              O custo de proteger o motor por 100 litros — com retorno maior que
              o investimento.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Coluna esquerda */}
          <div>
            <div className="space-y-5 font-[family-name:var(--font-archivo)] text-verde-escuro/70 text-base md:text-lg leading-relaxed mb-10">
              <p>
                Um frasco de 100ml trata 100 litros de combustível no uso
                padrão. Para quem abastece carro ou caminhonete regularmente,
                isso representa semanas de proteção contínua.
              </p>
              <p>
                A queima eficiente reduz desperdício e devolve o que estava
                sendo perdido em consumo — essa é a primeira economia. A
                segunda é evitar a oficina antes da hora.
              </p>
              <p>
                Colocado contra o custo de uma limpeza de bico injetor, uma
                descarbonização ou um dia parado sem poder trabalhar, o
                CarboZé 100ml é o investimento mais barato da manutenção do
                seu veículo.
              </p>
            </div>
            <CTAButton label="QUERO O PACK 100ML" size="large" href="/checkoutpack100" />
          </div>

          {/* Coluna direita — imagem pickup */}
          <div className="relative w-full rounded-2xl overflow-hidden aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cz-vehicle-pickup.jpg"
              alt="CarboZé — Para carros e caminhonetes"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
