import Image from "next/image";

/**
 * Packshot no topo do card de preço.
 *
 * Tratamento de "palco": fundo verde-escuro com um halo limão atrás do
 * produto e vinheta nas bordas. O recorte tem alfa, então o produto flutua
 * sobre esse palco em vez de carregar o cinza do estúdio para dentro do card.
 * O fundo escuro também separa a foto do corpo claro do card, o que puxa o
 * olho para o produto antes do preço.
 *
 * `object-contain` porque sachê (retrato) e frasco (quase quadrado) têm
 * formatos diferentes — cortar deixaria um dos dois desproporcional. Os dois
 * assets foram gerados com o produto na MESMA altura (94% do quadro), então
 * ocupam o mesmo espaço visual apesar da diferença de formato.
 */
export default function FotoProduto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-verde-escuro">
      {/* Halo limão atrás do produto */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 62% 55% at 50% 46%, rgba(169,218,0,0.22), rgba(169,218,0,0.05) 55%, transparent 72%)",
        }}
        aria-hidden="true"
      />
      {/* Vinheta — aprofunda os cantos e destaca o centro */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)",
        }}
        aria-hidden="true"
      />
      {/* Piso: sombra elíptica que apoia o produto */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-[6%] w-[62%] h-[7%] rounded-[50%] blur-md"
        style={{ background: "rgba(0,0,0,0.5)" }}
        aria-hidden="true"
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 90vw, 420px"
        className="object-contain p-2 drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
      />
    </div>
  );
}

/** Caminhos dos assets, para não repetir string solta pelos componentes. */
export const FOTO_SACHE = "/produto-kit-sache.webp";
export const FOTO_FRASCOS = "/produto-kit-frascos.webp";
