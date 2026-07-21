import CTAButton from "@/components/lovable/CTAButton";

interface ProductPickerProps {
  motoHref?: string;
  carroHref?: string;
}

export default function ProductPicker({
  motoHref = "/checkoutsache-influencer",
  carroHref = "/checkoutpack100-influencer",
}: ProductPickerProps) {
  return (
    <section id="escolha-produto" className="bg-white py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10">

        {/* Header */}
        <p className="font-[family-name:var(--font-archivo)] text-xs uppercase tracking-[0.18em] text-verde-escuro/40 mb-3">
          Escolha seu produto
        </p>
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight mb-12">
          Para cada veículo,{" "}
          <span className="text-verde-medio">uma fórmula calibrada.</span>
        </h2>

        {/* 2-col product grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Card MOTO */}
          <div className="border-2 border-verde-escuro/10 rounded-2xl p-8 flex flex-col gap-5 hover:border-verde-escuro/25 transition-colors">
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-verde-escuro/[0.06] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-verde-escuro">
                <path d="M5 17H3a2 2 0 01-2-2v-4a2 2 0 012-2h2l4-4h4l3 3 2-1 2 2-1 2 1 1-2 3h-3l-2-2H9l-4 4z" />
                <circle cx="7.5" cy="17.5" r="1.5" />
                <circle cx="17.5" cy="17.5" r="1.5" />
              </svg>
            </div>

            {/* Content */}
            <div>
              <p className="font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-[11px] tracking-widest mb-1">
                Para motos
              </p>
              <h3 className="font-[family-name:var(--font-basement)] font-extrabold text-verde-escuro text-2xl mb-3">
                Kit 10 Sachês de 10ml
              </h3>
              <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm leading-relaxed mb-5">
                O etanol presente na gasolina absorve umidade e cria condições que corroem o sistema
                de injeção. O CarboZé elimina essa umidade, estabiliza o combustível e limpa os bicos
                injetores a cada abastecimento.
              </p>
              <div className="bg-verde-escuro/[0.04] rounded-xl p-4 mb-5">
                <p className="font-[family-name:var(--font-basement)] font-extrabold text-verde-escuro text-4xl leading-none">
                  R$ 59,90
                </p>
                <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm mt-1">
                  Kit com 10 sachês de 10ml
                </p>
                <hr className="border-verde-escuro/10 my-2" />
                <p className="font-[family-name:var(--font-archivo)] font-semibold text-verde-escuro/70 text-xs">
                  R$ 5,99 por sachê
                </p>
                <p className="font-[family-name:var(--font-basement)] font-bold text-verde-medio text-xs mt-2">
                  🚚 Frete grátis · trata até 100 litros
                </p>
              </div>
            </div>

            <CTAButton label="Comprar para minha Moto" href={motoHref} />
          </div>

          {/* Card CARRO */}
          <div className="border-2 border-verde-escuro/10 rounded-2xl p-8 flex flex-col gap-5 hover:border-verde-escuro/25 transition-colors">
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-verde-escuro/[0.06] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-verde-escuro">
                <path d="M5 17H3a2 2 0 01-2-2v-3a2 2 0 012-2h14a2 2 0 012 2v3a2 2 0 01-2 2h-2M5 17a2 2 0 104 0M15 17a2 2 0 104 0M7 10l2-5h6l2 5" />
              </svg>
            </div>

            {/* Content */}
            <div>
              <p className="font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-[11px] tracking-widest mb-1">
                Para carros
              </p>
              <h3 className="font-[family-name:var(--font-basement)] font-extrabold text-verde-escuro text-2xl mb-3">
                Kit 5 Frascos de 100ml
              </h3>
              <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm leading-relaxed mb-5">
                O biodiesel no diesel oxida rapidamente e forma depósitos nos injetores. O CarboZé
                estabiliza o combustível, remove a oxidação acumulada e protege o sistema de injeção
                — seja gasolina, diesel ou etanol.
              </p>
              <div className="bg-verde-escuro/[0.04] rounded-xl p-4 mb-5">
                <p className="font-[family-name:var(--font-basement)] font-extrabold text-verde-escuro text-4xl leading-none">
                  R$ 149,50
                </p>
                <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm mt-1">
                  Kit com 5 frascos de 100ml
                </p>
                <hr className="border-verde-escuro/10 my-2" />
                <p className="font-[family-name:var(--font-archivo)] font-semibold text-verde-escuro/70 text-xs">
                  R$ 29,90 por frasco 100ml
                </p>
                <p className="font-[family-name:var(--font-basement)] font-bold text-verde-medio text-xs mt-2">
                  🚚 Frete grátis · trata até 500 litros
                </p>
              </div>
            </div>

            <CTAButton label="Comprar para meu Carro" href={carroHref} />
          </div>

        </div>
      </div>
    </section>
  );
}
