// Placeholder — trocar os quadros por logos reais dos clientes B2B (postos, oficinas, frotas).
export default function ClientesB2BJean() {
  const slots = Array.from({ length: 8 });
  return (
    <section className="bg-white py-14 md:py-20 border-t border-verde-escuro/[0.06]">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <p className="font-[family-name:var(--font-archivo)] text-center text-xs uppercase tracking-[0.18em] text-zinc-500 mb-8">
          Já presente em postos, oficinas e frotas
        </p>

        {/* Marquee contínuo (duplicado p/ loop sem emenda) */}
        <div className="overflow-hidden marquee-mask">
          <div className="flex gap-4 w-max animate-marquee">
            {[...slots, ...slots].map((_, i) => (
              <div
                key={i}
                className="w-40 h-16 shrink-0 rounded-xl bg-zinc-100 border border-dashed border-zinc-300 flex items-center justify-center"
              >
                <span className="font-[family-name:var(--font-archivo)] text-zinc-400 text-[11px]">
                  Logo
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
