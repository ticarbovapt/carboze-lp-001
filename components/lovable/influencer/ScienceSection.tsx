import CTAButton from "@/components/lovable/CTAButton";
import VturbPlayer from "@/components/lovable/VturbPlayer";
import { VSL_VTURB } from "@/lib/constants";

export default function ScienceSection() {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Coluna esquerda: copy */}
          <div>
            <p className="font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-xs tracking-widest mb-4">
              A ciência
            </p>
            <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-6">
              Quer entender a ciência por trás{" "}
              <span className="text-limao">desse resultado?</span>
            </h2>
            <p className="font-[family-name:var(--font-archivo)] text-white/60 text-base md:text-lg leading-relaxed mb-8">
              A fórmula do CarboZé age em nível molecular: estabiliza os compostos voláteis,
              elimina a água emulsionada no combustível e forma uma película protetora que impede
              a oxidação progressiva nas superfícies metálicas do motor.
            </p>
            <CTAButton label="CONHECER O CARBOZÉ" href="/sache" />
          </div>

          {/* Coluna direita: VSL do VTurb */}
          <VturbPlayer
            playerId={VSL_VTURB.playerId}
            videoId={VSL_VTURB.videoId}
            aspect="9 / 16"
            className="w-full max-w-[300px] sm:max-w-[340px] mx-auto rounded-2xl overflow-hidden bg-black"
          />

        </div>
      </div>
    </section>
  );
}
