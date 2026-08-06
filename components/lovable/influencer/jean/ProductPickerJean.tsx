import CTAButton from "@/components/lovable/CTAButton";
import FreteBadge from "@/components/lovable/FreteBadge";
import { FireIcon } from "@/components/lovable/Icons";
import FotoProduto, { FOTO_SACHE, FOTO_FRASCOS } from "@/components/lovable/FotoProduto";

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
    <section
      id="escolha-produto"
      className="py-16 md:py-24 bg-gradient-to-b from-[#E4EBE8] via-[#ECF1EF] to-[#E7EEEB]"
    >
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
          <div className="flex-1 flex items-center gap-3 rounded-xl border border-verde-escuro/[0.08] bg-white px-4 py-3 shadow-[0_2px_10px_-4px_rgba(9,58,48,0.14)]">
            <span className="shrink-0 w-9 h-9 rounded-full bg-verde-escuro/[0.06] flex items-center justify-center">
              <DropletIcon />
            </span>
            <p className="font-[family-name:var(--font-archivo)] text-sm text-zinc-700">
              <strong className="font-bold text-verde-escuro">1 sachê de 10ml</strong> trata até{" "}
              <strong className="font-bold text-verde-escuro">10 litros</strong> — ideal para pequenos abastecimentos.
            </p>
          </div>
          <div className="flex-1 flex items-center gap-3 rounded-xl border border-verde-escuro/[0.08] bg-white px-4 py-3 shadow-[0_2px_10px_-4px_rgba(9,58,48,0.14)]">
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
          <div className="bg-white border border-verde-escuro/[0.08] rounded-2xl p-8 flex flex-col gap-5
                          shadow-[0_10px_36px_-12px_rgba(9,58,48,0.18)]
                          hover:shadow-[0_16px_44px_-12px_rgba(9,58,48,0.26)] hover:-translate-y-0.5
                          transition-all duration-300">
            <FotoProduto
              src={FOTO_SACHE}
              alt="Kit CarboZé com 10 sachês de 10ml"
            />

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

            <CTAButton label="Quero economizar na moto" href={motoHref} size="card" className="w-full" />
          </div>

          {/* Card FRASCO — o mais escolhido */}
          <div
            className="relative bg-white border-2 border-[#D4A72C] rounded-2xl p-8 flex flex-col gap-5
                       hover:-translate-y-0.5 transition-transform duration-300"
            style={{ boxShadow: "0 14px 50px -12px rgba(212,167,44,0.45), 0 0 0 5px rgba(212,167,44,0.10)" }}
          >
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1.5 bg-gradient-to-r from-[#F4D06A] to-[#C9971F] text-verde-escuro font-[family-name:var(--font-basement)] font-black text-[11px] uppercase tracking-wide px-3.5 py-1.5 rounded-full shadow-lg shadow-[#C9971F]/40 whitespace-nowrap">
              <FireIcon className="w-3.5 h-3.5" />
              O mais escolhido
            </span>
            <FotoProduto
              src={FOTO_FRASCOS}
              alt="Kit CarboZé com 5 frascos de 100ml"
            />

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

            <CTAButton label="Quero economizar no carro" href={carroHref} size="card" className="w-full" />
          </div>

        </div>
      </div>
    </section>
  );
}
