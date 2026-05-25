import NumberBadge from "./NumberBadge";

const mechanisms = [
  {
    num: "01",
    title: "Elimina a umidade antes que vire problema",
    body: "O CarboZé captura as partículas de água e as queima junto com o combustível, de forma segura. A umidade não chega ao sistema provocando oxidação.",
  },
  {
    num: "02",
    title: "Queima mais completa, motor mais eficiente",
    body: "Melhora a eficiência da combustão, gerando mais energia por litro. Com o combustível estabilizado, a câmara de combustão trabalha com o que deveria trabalhar. Menos esforço, mais resposta no acelerador.",
  },
  {
    num: "03",
    title: "Limpeza acumulada a cada uso",
    body: "O efeito não é pontual. A cada sachê, o CarboZé vai removendo o que já estava depositado. Após 3 abastecimentos seguidos, a diferença no comportamento do motor é perceptível.",
  },
];

export default function Solution() {
  return (
    <section className="bg-off-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5">
        {/* Headline */}
        <h2 className="font-[family-name:var(--font-barlow)] font-extrabold uppercase text-verde-escuro text-2xl sm:text-3xl md:text-4xl leading-tight mb-6">
          Um sachê antes de abastecer. O combustível entra no motor{" "}
          <span className="text-verde-medio">já vacinado.</span>
        </h2>

        {/* Corpo introdutório */}
        <p className="font-[family-name:var(--font-archivo)] text-verde-escuro/70 text-base md:text-lg leading-relaxed mb-14">
          O CarboZé foi desenvolvido para a composição química específica do
          combustível brasileiro. Não é adaptação de fórmula estrangeira. É um
          produto construído a partir do problema que o nosso etanol e o nosso
          biodiesel criam dentro do nosso motor.
        </p>

        {/* 3 mecanismos — cards verde escuro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {mechanisms.map((m) => (
            <div
              key={m.num}
              className="bg-verde-escuro rounded-2xl p-6 flex flex-col items-center text-center gap-4"
            >
              <NumberBadge number={m.num} variant="limao" />
              <h3 className="font-[family-name:var(--font-barlow)] font-bold uppercase text-white text-base md:text-lg leading-snug">
                {m.title}
              </h3>
              <p className="font-[family-name:var(--font-archivo)] text-white/65 text-sm md:text-base leading-relaxed">
                {m.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
