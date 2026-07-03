// Placeholder — trocar os quadros por logos reais dos clientes B2B (postos, oficinas, frotas).
export default function ClientesB2BJean() {
  const slots = Array.from({ length: 6 });
  return (
    <section className="bg-white py-14 md:py-20 border-t border-verde-escuro/[0.06]">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <p className="font-[family-name:var(--font-archivo)] text-center text-xs uppercase tracking-[0.18em] text-zinc-500 mb-8">
          Já presente em postos, oficinas e frotas
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {slots.map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl bg-zinc-100 border border-dashed border-zinc-300 flex items-center justify-center"
            >
              <span className="font-[family-name:var(--font-archivo)] text-zinc-400 text-[11px]">
                Logo
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
