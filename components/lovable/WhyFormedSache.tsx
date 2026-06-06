export default function WhyFormedSache() {
  return (
    <section className="bg-verde-escuro py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6 md:px-10">

        <h2 className="font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-8">
          O CarboZé não foi adaptado para motos brasileiras.{" "}
          <span className="text-limao">Foi construído para elas.</span>
        </h2>

        <p className="font-[family-name:var(--font-archivo)] text-white/60 text-base md:text-lg leading-relaxed mb-6">
          O combustível brasileiro tem uma composição que não existe em nenhum outro país.
          A mistura obrigatória de etanol — entre 22% e 27% na gasolina — cria condições
          únicas de oxidação, absorção de umidade e variação química que afetam diretamente
          o motor da sua moto.
        </p>

        <p className="font-[family-name:var(--font-basement)] font-extrabold text-white text-lg md:text-xl uppercase leading-snug mb-8">
          <span className="text-limao">Multi-combustível. Gasolina e etanol.</span>{" "}
          Uma única fórmula. Não existe outro produto com essa resposta no Brasil.
        </p>

        <div className="bg-white/10 border-l-4 border-limao rounded-r-2xl p-6 max-w-2xl">
          <p className="font-[family-name:var(--font-archivo)] text-white/70 text-base leading-relaxed">
            Você não precisa de um produto diferente para gasolina e outro para etanol.
            O CarboZé foi formulado para tratar os dois — e entregar proteção real
            independentemente de onde você abastece.
          </p>
        </div>

      </div>
    </section>
  );
}
