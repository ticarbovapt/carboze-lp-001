import CTAButton from "@/components/lovable/CTAButton";

interface ProductPickerJeanProps {
  motoHref?: string;
  carroHref?: string;
}

export default function ProductPickerJean({
  motoHref = "/checkoutsache-jean",
  carroHref = "/checkoutpack100-jean",
}: ProductPickerJeanProps) {
  return (
    <section id="escolha-produto" className="bg-white py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10">

        <p className="font-[family-name:var(--font-archivo)] text-xs uppercase tracking-[0.18em] text-verde-escuro/40 mb-3">
          Escolha seu produto
        </p>
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight mb-6">
          Para cada veículo,{" "}
          <span className="text-verde-medio">uma fórmula calibrada.</span>
        </h2>

        {/* Faixa de dosagem — ideal para motos / pequenos abastecimentos */}
        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <div className="flex-1 flex items-center gap-3 rounded-xl border border-verde-escuro/10 bg-verde-escuro/[0.03] px-4 py-3">
            <span className="text-2xl shrink-0" aria-hidden="true">💧</span>
            <p className="font-[family-name:var(--font-archivo)] text-sm text-zinc-700">
              <strong className="font-bold text-verde-escuro">1 sachê de 10ml</strong> trata até{" "}
              <strong className="font-bold text-verde-escuro">10 litros</strong> — ideal para motos e pequenos abastecimentos.
            </p>
          </div>
          <div className="flex-1 flex items-center gap-3 rounded-xl border border-verde-escuro/10 bg-verde-escuro/[0.03] px-4 py-3">
            <span className="text-2xl shrink-0" aria-hidden="true">🛢️</span>
            <p className="font-[family-name:var(--font-archivo)] text-sm text-zinc-700">
              <strong className="font-bold text-verde-escuro">1 frasco de 100ml</strong> trata até{" "}
              <strong className="font-bold text-verde-escuro">100 litros</strong> — para carros e caminhonetes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Card MOTO */}
          <div className="border-2 border-limao/40 rounded-2xl p-8 flex flex-col gap-5 bg-limao/[0.02]">
            <div className="w-12 h-12 rounded-full bg-verde-escuro/[0.06] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-verde-escuro">
                <path d="M5 17H3a2 2 0 01-2-2v-4a2 2 0 012-2h2l4-4h4l3 3 2-1 2 2-1 2 1 1-2 3h-3l-2-2H9l-4 4z" />
                <circle cx="7.5" cy="17.5" r="1.5" />
                <circle cx="17.5" cy="17.5" r="1.5" />
              </svg>
            </div>

            <div>
              <p className="font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-[11px] tracking-widest mb-1">
                Para motos
              </p>
              <h3 className="font-[family-name:var(--font-basement)] font-extrabold text-verde-escuro text-2xl mb-3">
                Kit 10 Sachês de 10ml
              </h3>
              <p className="font-[family-name:var(--font-archivo)] text-zinc-700 text-sm leading-relaxed mb-5">
                O etanol presente na gasolina absorve umidade e cria condições que corroem o sistema
                de injeção. O CarboZé elimina essa umidade, estabiliza o combustível e limpa os bicos
                injetores a cada abastecimento.
              </p>

              {/* Price block */}
              <div className="bg-verde-escuro/[0.04] rounded-xl p-4 mb-5">
                <p className="font-[family-name:var(--font-basement)] font-extrabold text-verde-escuro text-4xl leading-none">
                  R$ 5,99
                </p>
                <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm mt-1">
                  por sachê
                </p>
                <hr className="border-verde-escuro/10 my-2" />
                <p className="font-[family-name:var(--font-archivo)] text-zinc-500 text-xs">
                  Kit Sachê 10ml com 10 unidades: R$ 59,90
                </p>
              </div>
            </div>

            <CTAButton label="Comprar para minha Moto" href={motoHref} />
          </div>

          {/* Card CARRO */}
          <div className="border-2 border-verde-escuro/10 rounded-2xl p-8 flex flex-col gap-5 hover:border-verde-escuro/25 transition-colors">
            <div className="w-12 h-12 rounded-full bg-verde-escuro/[0.06] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-verde-escuro">
                <path d="M5 17H3a2 2 0 01-2-2v-3a2 2 0 012-2h14a2 2 0 012 2v3a2 2 0 01-2 2h-2M5 17a2 2 0 104 0M15 17a2 2 0 104 0M7 10l2-5h6l2 5" />
              </svg>
            </div>

            <div>
              <p className="font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-[11px] tracking-widest mb-1">
                Para carros
              </p>
              <h3 className="font-[family-name:var(--font-basement)] font-extrabold text-verde-escuro text-2xl mb-3">
                Kit 5 Frascos de 100ml
              </h3>
              <p className="font-[family-name:var(--font-archivo)] text-zinc-700 text-sm leading-relaxed mb-5">
                O biodiesel no diesel oxida rapidamente e forma depósitos nos injetores. O CarboZé
                estabiliza o combustível, remove a oxidação acumulada e protege o sistema de injeção
                — seja gasolina, diesel ou etanol.
              </p>
              <div className="bg-verde-escuro/[0.04] rounded-xl p-4 mb-5">
                <p className="font-[family-name:var(--font-basement)] font-extrabold text-verde-escuro text-4xl leading-none">
                  R$ 29,90
                </p>
                <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm mt-1">
                  por frasco 100ml
                </p>
                <hr className="border-verde-escuro/10 my-2" />
                <p className="font-[family-name:var(--font-archivo)] text-zinc-500 text-xs">
                  Kit Frasco 100ml com 5 unidades: R$ 149,50
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
