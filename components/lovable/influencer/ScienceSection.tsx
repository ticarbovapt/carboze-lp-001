import CTAButton from "@/components/lovable/CTAButton";
import VturbPlayer from "@/components/lovable/VturbPlayer";
import { VSL_VTURB } from "@/lib/constants";

export default function ScienceSection() {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">

          {/* Coluna esquerda: copy.
              `contents` no mobile dissolve esta div para o vídeo poder entrar
              entre o título e o argumento. No md+ volta a ser uma coluna. */}
          <div className="contents md:block">
            <div className="order-1 md:order-none">
              <p className="font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-xs tracking-widest mb-4">
                A ciência
              </p>
              <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-0 md:mb-6">
                Quer entender a ciência por trás{" "}
                <span className="text-limao">desse resultado?</span>
              </h2>
            </div>

            <div className="order-3 md:order-none">
              <p className="font-[family-name:var(--font-archivo)] text-white/60 text-base md:text-lg leading-relaxed mb-8">
                A fórmula do CarboZé age em nível molecular: estabiliza os compostos voláteis,
                elimina a água emulsionada no combustível e forma uma película protetora que impede
                a oxidação progressiva nas superfícies metálicas do motor.
              </p>
              <CTAButton label="CONHECER O CARBOZÉ" href="/sache" />
            </div>
          </div>

          {/* VSL do VTurb — order-2 no mobile: entre o título e o argumento */}
          <VturbPlayer
            playerId={VSL_VTURB.playerId}
            videoId={VSL_VTURB.videoId}
            aspect="9 / 16"
            className="order-2 md:order-none w-full max-w-[300px] sm:max-w-[340px] mx-auto rounded-2xl overflow-hidden bg-black"
          />

        </div>
      </div>
    </section>
  );
}
