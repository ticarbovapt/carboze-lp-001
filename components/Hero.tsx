import QuantityPicker from "./QuantityPicker";

/* Badges de compatibilidade */
const badges = ["Gasolina", "Etanol", "Diesel", "Motos", "Carros", "Caminhonetes"];

export default function Hero() {
  return (
    <section className="relative bg-verde-escuro py-24 md:py-36 overflow-hidden min-h-[600px] flex items-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
        aria-hidden="true"
      />
      {/* Gradient — escurece mais à esquerda para legibilidade */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(100deg, rgba(9,58,48,0.95) 0%, rgba(9,58,48,0.70) 55%, rgba(9,58,48,0.25) 100%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 w-full">
        <div className="max-w-2xl">

          {/* Label editorial */}
          <p className="font-[family-name:var(--font-archivo)] text-white/30 text-xs tracking-[0.18em] uppercase mb-7">
            Estabilizador e otimizador de combustível
          </p>

          {/* H1 */}
          <h1 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] mb-7">
            Ciência aplicada em cada gota.{" "}
            <span className="text-limao">Combustível protegido.</span>
          </h1>

          {/* Body */}
          <p className="font-[family-name:var(--font-archivo)] text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
            O CarboZé protege o combustível e limpa o motor a cada abastecimento —
            menos quebra, mais performance e mais economia.
          </p>

          {/* Compatibilidade */}
          <div className="flex flex-wrap gap-2 mb-10">
            {badges.map((b) => (
              <span
                key={b}
                className="font-[family-name:var(--font-archivo)] text-xs text-white/45 border border-white/12 rounded-full px-3 py-1"
              >
                {b}
              </span>
            ))}
          </div>

          {/* QuantityPicker (sachê moto — produto principal) */}
          <QuantityPicker variant="dark" />

          <p className="mt-6 text-xs text-white/25 font-[family-name:var(--font-archivo)]">
            Disponível no Mercado Livre, Shopee e TikTok Shop
          </p>
        </div>
      </div>
    </section>
  );
}
