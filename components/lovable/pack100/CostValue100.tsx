import CTAButton from "../CTAButton";

export default function CostValue100() {
  return (
    <section className="bg-verde-escuro py-16 md:py-28">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Coluna esquerda */}
          <div>
            <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-3xl sm:text-4xl md:text-5xl leading-tight mb-8">
              <span className="text-limao">R$ 14,99 por tanque.</span>{" "}
              <span className="text-white">
                Menos do que o arredondamento do seu abastecimento.
              </span>
            </h2>

            <div className="space-y-5 font-[family-name:var(--font-archivo)] text-white/70 text-base md:text-lg leading-relaxed mb-10">
              <p>
                Um frasco de 100ml trata 100 litros de combustível no uso padrão. Para quem
                abastece carro ou caminhonete regularmente, isso representa semanas de proteção
                contínua.
              </p>
              <p>
                A queima eficiente reduz desperdício e devolve o que estava sendo perdido em
                consumo — essa é a primeira economia. A segunda é evitar a oficina antes da hora.
              </p>
              <p>
                Colocado contra o custo de uma limpeza de bico injetor, uma descarbonização ou
                um dia parado sem poder trabalhar, o CarboZé 100ml é o investimento mais barato
                da manutenção do seu veículo.
              </p>
            </div>
            <CTAButton label="QUERO O PACK 100ML" size="large" href="/checkoutpack100" />
          </div>

          {/* Coluna direita — imagem + badge */}
          <div className="relative w-full rounded-2xl overflow-hidden aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cz-pack100-costvalue.jpg"
              alt="CarboZé — Para carros e caminhonetes"
              className="w-full h-full object-cover"
            />
            {/* Badge overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-verde-escuro/90 rounded-xl p-4">
              <p className="font-[family-name:var(--font-basement)] font-bold text-limao text-xs uppercase tracking-wide leading-relaxed">
                5 FRASCOS = 10 TANQUES = ATÉ 500L DE COMBUSTÍVEL TRATADO
                <span className="text-white"> = R$ 14,99 POR TANQUE</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
