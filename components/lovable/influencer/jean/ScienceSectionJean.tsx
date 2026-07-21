import CTAButton from "@/components/lovable/CTAButton";
import InViewVideo from "@/components/lovable/InViewVideo";

interface ScienceSectionJeanProps {
  /** Vídeo da coluna direita — permite vídeo próprio por campanha. */
  videoSrc?: string;
  videoPoster?: string;
  /** Proporção do container (ex.: "9 / 16" p/ vídeo vertical). Sem valor = caixa larga padrão. */
  videoAspect?: string;
}

export default function ScienceSectionJean({
  videoSrc = "/sache-video.mp4",
  videoPoster = "/sache-moto.jpg",
  videoAspect,
}: ScienceSectionJeanProps = {}) {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Coluna esquerda */}
          <div>
            <p className="font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-xs tracking-widest mb-4">
              A ciência
            </p>
            <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-6">
              Quer entender a ciência por trás{" "}
              <span className="text-limao">desse resultado?</span>
            </h2>

            {/* 3 bullets visuais */}
            <ul className="flex flex-col gap-4 mt-2 mb-8">
              <li className="flex items-start gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-limao mt-0.5 shrink-0" aria-hidden="true">
                  <path d="M12 2.7c3.4 4 6 7 6 10.1a6 6 0 11-12 0c0-3.1 2.6-6.1 6-10.1z" />
                  <path d="M4 4l16 16" />
                </svg>
                <p className="text-white/80 text-sm font-[family-name:var(--font-archivo)] leading-snug">
                  <strong className="text-white font-bold">Elimina a umidade</strong> — o etanol da gasolina absorve água. O CarboZé age antes que isso roube força do motor.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-limao mt-0.5 shrink-0" aria-hidden="true">
                  <path d="M12 3c2 3 4.5 4.5 4.5 8a4.5 4.5 0 11-9 0c0-1.5.6-2.6 1.4-3.6C9.6 8.5 11 7 12 3z" />
                </svg>
                <p className="text-white/80 text-sm font-[family-name:var(--font-archivo)] leading-snug">
                  <strong className="text-white font-bold">Queima mais completa</strong> — estabiliza os compostos voláteis e maximiza cada litro abastecido.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-limao mt-0.5 shrink-0" aria-hidden="true">
                  <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
                  <path d="M9.5 12l1.8 1.8 3.2-3.4" />
                </svg>
                <p className="text-white/80 text-sm font-[family-name:var(--font-archivo)] leading-snug">
                  <strong className="text-white font-bold">Protege o sistema de injeção</strong> — forma película protetora nas superfícies metálicas a cada abastecimento.
                </p>
              </li>
            </ul>

            <CTAButton label="QUERO MEU CARBOZÉ" href="#escolha-produto" />
          </div>

          {/* Coluna direita: vídeo */}
          <div
            className={
              videoAspect
                ? "relative w-full max-w-[300px] sm:max-w-[340px] mx-auto rounded-2xl overflow-hidden bg-white/5"
                : "relative w-full rounded-2xl overflow-hidden bg-white/5 min-h-[320px] md:min-h-[400px]"
            }
            style={videoAspect ? { aspectRatio: videoAspect } : undefined}
          >
            <InViewVideo
              src={videoSrc}
              poster={videoPoster}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
