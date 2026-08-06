import CTAButton from "@/components/lovable/CTAButton";
import FreteBadge from "@/components/lovable/FreteBadge";
import { FireIcon } from "@/components/lovable/Icons";
import FotoProduto, { FOTO_SACHE, FOTO_FRASCOS } from "@/components/lovable/FotoProduto";

interface ProductPickerProps {
  motoHref?: string;
  carroHref?: string;
}

export default function ProductPicker({
  motoHref = "/checkoutsache-influencer",
  carroHref = "/checkoutpack100-influencer",
}: ProductPickerProps) {
  return (
    <section
      id="escolha-produto"
      className="py-16 md:py-24 bg-gradient-to-b from-[#E4EBE8] via-[#ECF1EF] to-[#E7EEEB]"
    >
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
          <div className="bg-white border border-verde-escuro/[0.08] rounded-2xl p-8 flex flex-col gap-5
                          shadow-[0_10px_36px_-12px_rgba(9,58,48,0.18)]
                          hover:shadow-[0_16px_44px_-12px_rgba(9,58,48,0.26)] hover:-translate-y-0.5
                          transition-all duration-300">
            <FotoProduto src={FOTO_SACHE} alt="Kit CarboZé com 10 sachês de 10ml" />

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
                  <FreteBadge litros={100} />
                </p>
              </div>
            </div>

            <CTAButton label="Quero economizar na moto" href={motoHref} size="card" className="w-full" />
          </div>

          {/* Card CARRO — o mais escolhido */}
          <div
            className="relative bg-white border-2 border-[#D4A72C] rounded-2xl p-8 flex flex-col gap-5
                       hover:-translate-y-0.5 transition-transform duration-300"
            style={{ boxShadow: "0 14px 50px -12px rgba(212,167,44,0.45), 0 0 0 5px rgba(212,167,44,0.10)" }}
          >
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1.5 bg-gradient-to-r from-[#F4D06A] to-[#C9971F] text-verde-escuro font-[family-name:var(--font-basement)] font-black text-[11px] uppercase tracking-wide px-3.5 py-1.5 rounded-full shadow-lg shadow-[#C9971F]/40 whitespace-nowrap">
              <FireIcon className="w-3.5 h-3.5" />
              O mais escolhido
            </span>
            <FotoProduto src={FOTO_FRASCOS} alt="Kit CarboZé com 5 frascos de 100ml" />

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
                  <FreteBadge litros={500} />
                </p>
              </div>
            </div>

            <CTAButton label="Quero economizar no carro" href={carroHref} size="card" className="w-full" />
          </div>

        </div>
      </div>
    </section>
  );
}
