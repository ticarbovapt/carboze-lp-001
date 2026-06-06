import CTAButton from "@/components/lovable/CTAButton";

export default function HeroInstitucional() {
  return (
    <section
      className="relative min-h-screen flex items-end pb-20"
      style={{ backgroundImage: "url('/design-builder-46bfb20e.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* Gradient overlay — heavy at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-verde-escuro/90 via-verde-escuro/40 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 w-full">
        <div className="max-w-2xl">
          {/* Tag pill */}
          <span className="inline-flex items-center gap-1.5 border border-limao/50 text-limao text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full font-[family-name:var(--font-basement)] mb-6">
            Otimizador Molecular
          </span>

          {/* Headline */}
          <h1 className="font-[family-name:var(--font-basement)] font-extrabold text-4xl md:text-6xl text-white uppercase leading-tight tracking-tight mb-6">
            O único otimizador molecular feito para o combustível que você abastece.
          </h1>

          {/* Subheadline */}
          <p className="font-[family-name:var(--font-archivo)] text-white/65 text-base md:text-lg leading-relaxed mb-10">
            A gasolina da bomba tem etanol. O diesel tem biodiesel. O combustível brasileiro é
            único — e precisa de um tratamento feito para ele. O CarboZé age na estrutura
            molecular, a cada abastecimento, antes do dano acontecer.
          </p>

          <CTAButton label="QUERO CARBOZÉ" href="/choice" size="large" />
        </div>
      </div>
    </section>
  );
}
