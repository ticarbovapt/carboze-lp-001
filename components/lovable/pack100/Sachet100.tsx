export default function Sachet100() {
  return (
    <section className="bg-verde-escuro py-16 md:py-28">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-stretch">

          {/* Coluna esquerda: título + corpo + specs */}
          <div>
            <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase leading-tight mb-8 text-3xl sm:text-4xl md:text-5xl">
              <span className="text-white block">
                Calibrado para cada litro.
              </span>
              <span className="text-limao block">
                1ml por litro. Simples assim.
              </span>
            </h2>

            <div className="space-y-4 font-[family-name:var(--font-archivo)] text-white/60 text-base md:text-lg leading-relaxed mb-8">
              <p>
                A proporção do CarboZé é 1ml para cada 1.000ml de combustível.
                O frasco de 100ml foi projetado para tratar até 100 litros —
                compatível com carros, caminhonetes e veículos de frota.
              </p>
              <p>
                Use a cada abastecimento. Meça a dose pelos litros que vai
                colocar, despeje no tanque e abasteça normalmente. Proteção
                contínua, sem complicação.
              </p>
            </div>

            {/* Specs */}
            <div className="bg-white/[0.04] rounded-2xl p-6">
              <p className="font-[family-name:var(--font-barlow)] font-bold uppercase text-limao/60 text-xs tracking-widest mb-4">
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
                    className="flex items-start gap-3 font-[family-name:var(--font-archivo)] text-white/70 text-sm"
                  >
                    <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-limao" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Coluna direita: imagem veículo */}
          <div className="flex items-stretch justify-center min-h-[380px] md:min-h-0">
            <div className="relative w-full rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/cz-vehicle-car.jpg"
                alt="CarboZé Pack 100ml — para carros e caminhonetes"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-verde-escuro/60 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
