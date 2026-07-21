import SlideCarousel from "@/components/lovable/SlideCarousel";
import InViewVideo from "@/components/lovable/InViewVideo";

const steps = [
  {
    num: "01",
    title: "Abra o sachê",
    body: "Rasge o sachê de 10ml. Nenhuma medição necessária — a dose já vem calibrada para o tanque da moto.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-limao" aria-hidden="true">
        <path d="M12 3v13M8 13l4 4 4-4M5 19h14" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Despeje no tanque",
    body: "Despeje o sachê direto na abertura do tanque antes de abastecer. O combustível mistura automaticamente.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-limao" aria-hidden="true">
        <path d="M12 3C8 3 5 6 5 10c0 5.25 7 13 7 13s7-7.75 7-13c0-4-3-7-7-7z" />
        <circle cx="12" cy="10" r="2" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Abasteça normalmente",
    body: "Feche o tanque e abasteça como sempre. O CarboZé age durante o funcionamento do motor.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-limao" aria-hidden="true">
        <path d="M3 12a9 9 0 1018 0A9 9 0 003 12z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

export default function HowToUseJean() {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5">

        <p className="font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-xs tracking-widest mb-4">
          Modo de uso
        </p>
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-10">
          3 passos.{" "}
          <span className="text-limao">Nenhum mecânico envolvido.</span>
        </h2>

        {/* Vídeo dos takes */}
        <div className="mx-auto w-full max-w-[360px] sm:max-w-[420px] mb-10">
          <div className="relative rounded-3xl overflow-hidden bg-black aspect-[4/5] shadow-xl shadow-black/30 border border-white/10">
            <InViewVideo
              src="/takes-jean.mp4"
              poster="/takes-jean-poster.webp"
              controls
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Carrossel dos 3 passos (texto) */}
        <SlideCarousel
          theme="light"
          slides={steps.map((step) => (
            <div key={step.num} className="bg-white rounded-2xl p-7 flex flex-col gap-3 max-w-md mx-auto h-full">
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-basement)] font-extrabold text-verde-escuro/15 text-5xl leading-none">
                  {step.num}
                </span>
                <div className="w-11 h-11 rounded-full bg-verde-escuro flex items-center justify-center">
                  {step.icon}
                </div>
              </div>
              <h3 className="font-[family-name:var(--font-basement)] font-bold uppercase text-verde-escuro text-base leading-snug">
                {step.title}
              </h3>
              <p className="font-[family-name:var(--font-archivo)] text-zinc-600 text-sm leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        />

      </div>
    </section>
  );
}
