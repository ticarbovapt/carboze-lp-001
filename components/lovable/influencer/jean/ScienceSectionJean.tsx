import CTAButton from "@/components/lovable/CTAButton";

export default function ScienceSectionJean() {
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
                <span className="text-limao text-xl mt-0.5 shrink-0">⚡</span>
                <p className="text-white/80 text-sm font-[family-name:var(--font-archivo)] leading-snug">
                  <strong className="text-white font-bold">Elimina a umidade</strong> — o etanol da gasolina absorve água. O CarboZé age antes que isso roube força do motor.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-limao text-xl mt-0.5 shrink-0">🔥</span>
                <p className="text-white/80 text-sm font-[family-name:var(--font-archivo)] leading-snug">
                  <strong className="text-white font-bold">Queima mais completa</strong> — estabiliza os compostos voláteis e maximiza cada litro abastecido.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-limao text-xl mt-0.5 shrink-0">🛡️</span>
                <p className="text-white/80 text-sm font-[family-name:var(--font-archivo)] leading-snug">
                  <strong className="text-white font-bold">Protege o sistema de injeção</strong> — forma película protetora nas superfícies metálicas a cada abastecimento.
                </p>
              </li>
            </ul>

            <CTAButton label="CONHECER O CARBOZÉ" href="/sache" />
          </div>

          {/* Coluna direita: vídeo */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-white/5 min-h-[320px] md:min-h-[400px]">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              poster="/sache-moto.jpg"
            >
              <source src="/sache-video.mp4" type="video/mp4" />
            </video>
          </div>

        </div>
      </div>
    </section>
  );
}
