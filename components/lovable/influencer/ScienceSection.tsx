import CTAButton from "@/components/lovable/CTAButton";

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

          {/* Coluna direita: vídeo em loop */}
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
