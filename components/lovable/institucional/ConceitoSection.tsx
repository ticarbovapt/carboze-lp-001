export default function ConceitoSection() {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Col esq — copy */}
          <div>
            <p className="font-[family-name:var(--font-archivo)] text-xs uppercase tracking-[0.18em] text-white/30 mb-3">
              O Conceito
            </p>
            <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl md:text-5xl leading-tight mb-6">
              Por que CarboZé? Porque resolve como um "Zé" de verdade!
            </h2>
            <p className="font-[family-name:var(--font-archivo)] text-white/60 text-base leading-relaxed mb-4">
              O nome vem de "Zé" — simples, direto e resolutivo. Enquanto outros produtos complicam,
              o CarboZé resolve na raiz: trata o combustível antes que ele cause dano ao motor.
              Sem promessas vazias. Sem ciência de ficção.
            </p>
            <p className="font-[family-name:var(--font-archivo)] text-white/60 text-base leading-relaxed">
              A fórmula foi desenvolvida especificamente para o cenário brasileiro, onde etanol e
              biodiesel estão presentes em todos os combustíveis disponíveis nos postos. Uma
              solução que atua onde o problema começa — na mistura, antes da ignição.
            </p>
          </div>

          {/* Col dir — destaque card */}
          <div className="bg-white/[0.07] border border-white/15 rounded-2xl p-8">
            <span className="inline-flex items-center gap-1.5 bg-limao/10 border border-limao/30 text-limao text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full font-[family-name:var(--font-basement)] mb-6">
              A Vacina do Combustível
            </span>
            <h3 className="font-[family-name:var(--font-basement)] font-extrabold text-white text-2xl uppercase leading-tight mb-4">
              CarboZé: A vacina do combustível.
            </h3>
            <p className="font-[family-name:var(--font-archivo)] text-white/60 text-base leading-relaxed">
              Assim como uma vacina age antes de a doença se instalar, o CarboZé trata o
              combustível antes que a degradação aconteça. Resolve na origem da mistura,
              a cada tanque, sem deixar rastro de dano.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
