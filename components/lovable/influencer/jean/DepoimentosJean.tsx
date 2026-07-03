// Placeholder — os criativos de depoimento (GIF/vídeo + texto) entram aqui quando prontos.
import SlideCarousel from "@/components/lovable/SlideCarousel";

const depoimentos = [
  { nome: "Cliente CarboZé", contexto: "Motociclista · SP", texto: "Depoimento em breve." },
  { nome: "Cliente CarboZé", contexto: "Motorista de app · RJ", texto: "Depoimento em breve." },
  { nome: "Cliente CarboZé", contexto: "Frotista · MG", texto: "Depoimento em breve." },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-limao" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function DepoimentosJean() {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <p className="font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-xs tracking-widest mb-4">
          Prova social
        </p>
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-12">
          Quem usa,{" "}
          <span className="text-limao">recomenda.</span>
        </h2>

        <SlideCarousel
          theme="light"
          slides={depoimentos.map((d, i) => (
            <div
              key={i}
              className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 max-w-md mx-auto"
            >
              {/* Espaço reservado p/ GIF/vídeo do depoimento */}
              <div className="w-full aspect-video rounded-xl bg-white/[0.03] border border-dashed border-white/15 flex items-center justify-center">
                <span className="font-[family-name:var(--font-archivo)] text-white/25 text-xs">
                  Depoimento em produção
                </span>
              </div>
              <Stars />
              <p className="font-[family-name:var(--font-archivo)] text-white/70 text-sm leading-relaxed">
                “{d.texto}”
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-9 h-9 rounded-full bg-limao/20 border border-limao/30 flex items-center justify-center text-limao font-[family-name:var(--font-basement)] font-bold text-sm">
                  {d.nome.charAt(0)}
                </div>
                <div>
                  <p className="font-[family-name:var(--font-basement)] font-bold text-white text-sm leading-none">
                    {d.nome}
                  </p>
                  <p className="font-[family-name:var(--font-archivo)] text-white/40 text-xs mt-1">
                    {d.contexto}
                  </p>
                </div>
              </div>
            </div>
          ))}
        />
      </div>
    </section>
  );
}
