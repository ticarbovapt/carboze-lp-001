import Image from "next/image";
import CTAButton from "@/components/lovable/CTAButton";

const vehicles = [
  {
    category: "Categoria A",
    title: "Motos e Scooters",
    desc: "Kit 10 Sachês · gasolina e etanol — urbana, trail, sport, scooter ou entrega.",
    image: "/cz-vehicle-moto.jpg",
    alt: "Moto",
  },
  {
    category: "Categoria B",
    title: "Carros e SUVs",
    desc: "Kit 5 Frascos · flex e gasolina — veículos de passeio, SUVs e utilitários.",
    image: "/cz-vehicle-car.jpg",
    alt: "Carro",
  },
  {
    category: "Categoria C",
    title: "Caminhonetes e Vans",
    desc: "Kit 5 Frascos · diesel e flex — veículos de carga leve e transporte.",
    image: "/cz-vehicle-truck.jpg",
    alt: "Caminhonete",
  },
  {
    category: "Categoria D",
    title: "Aplicações Náuticas",
    desc: "Kit 5 Frascos · motores marítimos — barcos, lanchas e motores de popa.",
    image: "/cz-vehicle-boat.jpg",
    alt: "Lancha",
  },
];

export default function CompatibilidadeSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Label */}
        <p className="font-[family-name:var(--font-archivo)] text-xs uppercase tracking-[0.18em] text-verde-escuro/40 mb-3">
          Compatibilidade
        </p>

        {/* Heading */}
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight mb-4">
          Para qualquer veículo na estrada.
        </h2>

        {/* Intro */}
        <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-base leading-relaxed max-w-2xl mb-10">
          O CarboZé funciona com qualquer veículo que use combustível líquido. Se tem motor
          e abastece num posto brasileiro, o CarboZé foi feito para ele.
        </p>

        {/* 4-card grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {vehicles.map((v) => (
            <div
              key={v.category}
              className="rounded-2xl overflow-hidden bg-verde-escuro/[0.04] border border-verde-escuro/10"
            >
              {/* Image */}
              <div className="relative h-40 bg-verde-escuro/5">
                <Image
                  src={v.image}
                  alt={v.alt}
                  fill
                  className="object-cover opacity-80"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              {/* Body */}
              <div className="p-5">
                <p className="font-[family-name:var(--font-basement)] font-bold text-verde-medio text-xs uppercase tracking-wide mb-1">
                  {v.category}
                </p>
                <h3 className="font-[family-name:var(--font-basement)] font-bold text-verde-escuro text-base mb-2">
                  {v.title}
                </h3>
                <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/45 text-xs leading-relaxed">
                  {v.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pill destacado */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center bg-verde-escuro/5 border border-verde-escuro/20 text-verde-escuro font-[family-name:var(--font-basement)] font-bold text-sm uppercase tracking-wide px-6 py-3 rounded-full">
            Funciona em qualquer motor que queima combustível brasileiro.
          </span>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <CTAButton label="QUERO CARBOZÉ" href="/choice" />
        </div>
      </div>
    </section>
  );
}
