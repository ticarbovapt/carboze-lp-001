"use client";

const steps = [
  {
    num: "01",
    title: "Abra o sachê",
    body: "Rasge o sachê de 10ml. Nenhuma medição necessária — a dose já vem calibrada para o tanque da moto.",
    gif: "/gifs/passo-1-abrir-sache.gif",
    gifAlt: "Como abrir o sachê CarboZé",
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
    gif: "/gifs/passo-2-despejar.gif",
    gifAlt: "Como despejar o CarboZé no tanque",
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
    gif: "/gifs/passo-3-abastecer.gif",
    gifAlt: "Abastecer normalmente após usar CarboZé",
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
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-12">
          3 passos.{" "}
          <span className="text-limao">Nenhum mecânico envolvido.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="bg-white rounded-2xl p-7 flex flex-col gap-4">

              {/* GIF / Placeholder */}
              <div className="w-full rounded-xl overflow-hidden bg-verde-escuro/5 aspect-video flex items-center justify-center mb-2">
                {/* Quando os GIFs estiverem prontos, a tag <img> abaixo será ativada automaticamente */}
                <img
                  src={step.gif}
                  alt={step.gifAlt}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback visual enquanto GIFs não existem
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                    (e.currentTarget.parentElement as HTMLElement).innerHTML =
                      `<div class="flex flex-col items-center gap-2 text-verde-escuro/20"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1' class='w-10 h-10'><rect x='3' y='3' width='18' height='18' rx='2'/><circle cx='8.5' cy='8.5' r='1.5'/><path d='M21 15l-5-5L5 21'/></svg><span class='text-xs font-archivo'>GIF em produção</span></div>`;
                  }}
                />
              </div>

              {/* Número + ícone */}
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
        </div>

      </div>
    </section>
  );
}
