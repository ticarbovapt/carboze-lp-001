export default function Sachet() {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5">
        {/* Grid: texto à esq, vídeo/imagem à dir */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Coluna esquerda: título + corpo + specs */}
          <div>
            {/* Título em 2 linhas */}
            <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase leading-tight mb-8 text-2xl sm:text-3xl md:text-4xl">
              <span className="text-white block">
                Calibrado para o tanque.
              </span>
              <span className="text-limao block">
                Sem sobra, sem desperdício.
              </span>
            </h2>

            {/* Corpo */}
            <div className="space-y-4 font-[family-name:var(--font-archivo)] text-white/80 text-base md:text-lg leading-relaxed mb-8">
              <p>
                A proporção do CarboZé é 1ml para cada 1.000ml de combustível.
                O sachê de 10ml foi calibrado para tratar exatamente 10L, o
                tanque cheio da grande maioria das motos brasileiras.
              </p>
              <p>
                Um sachê por abastecimento. Você rasga, despeja no tanque antes
                de abastecer e pronto.
              </p>
            </div>

            {/* Specs — abaixo do texto */}
            <div className="bg-white/10 rounded-2xl p-6">
              <p className="font-[family-name:var(--font-barlow)] font-bold uppercase text-limao text-xs tracking-widest mb-4">
                Especificações
              </p>
              <ul className="space-y-3">
                {[
                  "10ml trata até 10L de combustível",
                  "Compatível com gasolina e etanol",
                  "Um sachê = um abastecimento completo protegido",
                ].map((spec) => (
                  <li
                    key={spec}
                    className="flex items-start gap-3 font-[family-name:var(--font-archivo)] text-white text-sm md:text-base"
                  >
                    <span className="mt-2 shrink-0 w-2 h-2 rounded-full bg-limao" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Coluna direita: vídeo / imagem do produto */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-[9/16] rounded-2xl overflow-hidden bg-white/5">
              {/* Vídeo loop — quando disponível */}
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
              {/* Fallback: imagem do sachê */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sache-moto.jpg"
                alt="CarboZé Sachê"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
