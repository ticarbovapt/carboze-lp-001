const benefits = [
  {
    title: "Proteção imediata",
    body: "Elimina a umidade do combustível que entra no tanque agora. O motor recebe combustível estabilizado desde o primeiro litro.",
  },
  {
    title: "Limpeza progressiva",
    body: "A cada abastecimento, o CarboZé remove depósitos acumulados. O efeito não é pontual — é cumulativo e crescente.",
  },
  {
    title: "Resultado que se acumula",
    body: "Após 3 abastecimentos seguidos, a diferença no comportamento do motor é perceptível. Partida mais fácil, resposta mais pronta.",
  },
];

export default function MetadeAgora100() {
  return (
    <section className="bg-white py-16 md:py-28">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-verde-escuro text-3xl sm:text-4xl md:text-5xl leading-tight mb-14">
          Metade agora. <span className="text-verde-medio">Metade no próximo abastecimento.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-verde-escuro/[0.05] border border-verde-escuro/10 rounded-2xl p-7 flex flex-col gap-5"
            >
              <div className="w-10 h-10 rounded-full bg-limao flex items-center justify-center shrink-0">
                <div className="w-4 h-4 rounded-full bg-verde-escuro" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-basement)] font-bold uppercase text-verde-escuro text-base leading-snug mb-3">
                  {b.title}
                </h3>
                <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-sm leading-relaxed">
                  {b.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/30 text-sm border-t border-verde-escuro/8 pt-8 mt-14 max-w-xl">
          Nota: a proporção é 1ml de CarboZé para cada 1.000ml de combustível. Para tanques
          acima de 50L, ajuste proporcionalmente.
        </p>
      </div>
    </section>
  );
}
