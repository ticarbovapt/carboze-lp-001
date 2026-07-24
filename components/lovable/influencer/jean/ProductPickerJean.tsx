import CTAButton from "@/components/lovable/CTAButton";
import FreteBadge from "@/components/lovable/FreteBadge";

interface ProductPickerJeanProps {
  motoHref?: string;
  carroHref?: string;
}

/* Ícones de produto (sem emoji) */
function DropletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-verde-escuro" aria-hidden="true">
      <path d="M12 2.7c3.4 4 6 7 6 10.1a6 6 0 11-12 0c0-3.1 2.6-6.1 6-10.1z" />
    </svg>
  );
}
function BottleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-verde-escuro" aria-hidden="true">
      <path d="M10 2h4M11 2v3.2c0 .5-.2 1-.6 1.4L9 8.2A2 2 0 008.3 9.6V20a2 2 0 002 2h3.4a2 2 0 002-2V9.6a2 2 0 00-.7-1.4l-1.4-1.6a2 2 0 01-.6-1.4V2" />
      <path d="M8.5 13h7" />
    </svg>
  );
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
          Para cada abastecimento,{" "}
          <span className="text-verde-medio">a dose certa.</span>
        </h2>

        {/* Faixa de dosagem */}
        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <div className="flex-1 flex items-center gap-3 rounded-xl border border-verde-escuro/10 bg-verde-escuro/[0.03] px-4 py-3">
            <span className="shrink-0 w-9 h-9 rounded-full bg-verde-escuro/[0.06] flex items-center justify-center">
              <DropletIcon />
            </span>
            <p className="font-[family-name:var(--font-archivo)] text-sm text-zinc-700">
              <strong className="font-bold text-verde-escuro">1 sachê de 10ml</strong> trata até{" "}
              <strong className="font-bold text-verde-escuro">10 litros</strong> — ideal para pequenos abastecimentos.
            </p>
          </div>
          <div className="flex-1 flex items-center gap-3 rounded-xl border border-verde-escuro/10 bg-verde-escuro/[0.03] px-4 py-3">
            <span className="shrink-0 w-9 h-9 rounded-full bg-verde-escuro/[0.06] flex items-center justify-center">
              <BottleIcon />
            </span>
            <p className="font-[family-name:var(--font-archivo)] text-sm text-zinc-700">
              <strong className="font-bold text-verde-escuro">1 frasco de 100ml</strong> trata até{" "}
              <strong className="font-bold text-verde-escuro">100 litros</strong> — rende até 2 tanques por frasco.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Card SACHÊ */}
          <div className="border-2 border-limao/40 rounded-2xl p-8 flex flex-col gap-5 bg-limao/[0.02]">
            <div className="w-12 h-12 rounded-full bg-verde-escuro/[0.06] flex items-center justify-center">
              <DropletIcon />
            </div>

            <div>
              <p className="font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-[11px] tracking-widest mb-1">
                Pequenos abastecimentos
              </p>
              <h3 className="font-[family-name:var(--font-basement)] font-extrabold text-verde-escuro text-2xl mb-3">
                Kit 10 Sachês de 10ml
              </h3>
              <p className="font-[family-name:var(--font-archivo)] text-zinc-700 text-sm leading-relaxed mb-5">
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
                <p className="font-[family-name:var(--font-archivo)] font-semibold text-zinc-600 text-xs">
                  R$ 5,99 por sachê
                </p>
                <p className="font-[family-name:var(--font-basement)] font-bold text-verde-medio text-xs mt-2">
                  <FreteBadge litros={100} />
                </p>
              </div>
            </div>

            <CTAButton label="Quero economizar na moto" href={motoHref} />
          </div>

          {/* Card FRASCO */}
          <div className="border-2 border-verde-escuro/10 rounded-2xl p-8 flex flex-col gap-5 hover:border-verde-escuro/25 transition-colors">
            <div className="w-12 h-12 rounded-full bg-verde-escuro/[0.06] flex items-center justify-center">
              <BottleIcon />
            </div>

            <div>
              <p className="font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-[11px] tracking-widest mb-1">
                Rende até 2 tanques
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
                  R$ 149,50
                </p>
                <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm mt-1">
                  Kit com 5 frascos de 100ml
                </p>
                <hr className="border-verde-escuro/10 my-2" />
                <p className="font-[family-name:var(--font-archivo)] font-semibold text-zinc-600 text-xs">
                  R$ 29,90 por frasco 100ml
                </p>
                <p className="font-[family-name:var(--font-basement)] font-bold text-verde-medio text-xs mt-2">
                  <FreteBadge litros={500} />
                </p>
              </div>
            </div>

            <CTAButton label="Quero economizar no carro" href={carroHref} />
          </div>

        </div>
      </div>
    </section>
  );
}
