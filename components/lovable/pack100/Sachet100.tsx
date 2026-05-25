import Image from "next/image";

export default function Sachet100() {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-stretch">
          {/* Coluna esquerda: título + corpo + specs */}
          <div>
            <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase leading-tight mb-8 text-2xl sm:text-3xl md:text-4xl">
              <span className="text-white block">
                Calibrado para cada litro.
              </span>
              <span className="text-limao block">
                1ml por litro. Simples assim.
              </span>
            </h2>

            <div className="space-y-4 font-[family-name:var(--font-archivo)] text-white/80 text-base md:text-lg leading-relaxed mb-8">
              <p>
                A proporção do CarboZé é 1ml para cada 1.000ml de combustível.
                O frasco de 100ml foi projetado para tratar até 100 litros —
                compatível com carros, caminhões, motos e veículos de frota.
              </p>
              <p>
                Use a cada abastecimento. Meça a dose pelos litros que vai
                colocar, despeje no tanque e abasteça normalmente. Proteção
                contínua, sem complicação.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6">
              <p className="font-[family-name:var(--font-barlow)] font-bold uppercase text-limao text-xs tracking-widest mb-4">
                Especificações
              </p>
              <ul className="space-y-3">
                {[
                  "100ml trata até 100L de combustível",
                  "Compatível com gasolina, etanol e diesel",
                  "Dosagem: 1ml por litro abastecido",
                  "Uso contínuo — a cada abastecimento",
                  "Não contém metais pesados",
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

          {/* Coluna direita: imagem produto placeholder */}
          <div className="flex items-stretch justify-center min-h-[400px] md:min-h-0">
            <div className="relative w-full rounded-2xl overflow-hidden bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/produto-dobra5.png"
                alt="CarboZé Pack 100ml"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-end p-6">
                <span className="bg-limao text-verde-escuro font-[family-name:var(--font-barlow)] font-bold uppercase text-xs px-3 py-1 rounded-full">
                  Imagem do 100ml em breve
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
