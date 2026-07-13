const SELOS = [
  "Insumos importados",
  "Compatível com gasolina, etanol e diesel",
  "Disponível no Mercado Livre e Amazon",
];

const COMPOSICAO = ["Tensoativos", "Dispersantes", "Estabilizantes", "Solventes especiais", "Agentes de proteção"];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-limao shrink-0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function ProvaSocial() {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        <p className="font-[family-name:var(--font-archivo)] text-xs uppercase tracking-[0.18em] text-white/30 mb-3">
          Credibilidade
        </p>
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-4">
          Não é aditivo de posto.{" "}
          <span className="text-limao">É engenharia.</span>
        </h2>
        <p className="font-[family-name:var(--font-archivo)] text-white/60 text-base leading-relaxed max-w-2xl mb-8">
          Uma fórmula desenvolvida com insumos importados para o combustível brasileiro — que
          hoje carrega até 30% de etanol e biodiesel na mistura.
        </p>

        {/* Selos técnicos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {SELOS.map((s) => (
            <div
              key={s}
              className="flex items-start gap-2.5 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3"
            >
              <CheckIcon />
              <span className="font-[family-name:var(--font-archivo)] text-white/80 text-sm leading-snug">{s}</span>
            </div>
          ))}
        </div>

        {/* Composição */}
        <div className="border-t border-white/10 pt-6">
          <p className="font-[family-name:var(--font-archivo)] text-white/40 text-xs uppercase tracking-[0.14em] mb-3">
            Composição da fórmula:
          </p>
          <div className="flex flex-wrap gap-2">
            {COMPOSICAO.map((c) => (
              <span
                key={c}
                className="inline-block bg-limao/10 border border-limao/25 text-limao rounded-full px-3 py-1 font-[family-name:var(--font-basement)] font-bold text-xs"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
