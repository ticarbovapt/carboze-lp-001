import Image from "next/image";

/**
 * Foto do produto no topo do card de preço.
 *
 * Os arquivos têm fundo recortado, então o produto flutua sobre um tile de
 * tom de marca em vez de carregar o cinza do estúdio para dentro do card.
 *
 * `object-contain` porque sachê (retrato) e frasco (paisagem) têm formatos
 * diferentes — cortar deixaria um dos dois desproporcional. Os dois assets
 * foram gerados com o produto na mesma altura útil, então os cards ficam
 * visualmente equilibrados mesmo sem corte.
 */
export default function FotoProduto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-verde-escuro/[0.08] bg-gradient-to-b from-verde-escuro/[0.07] to-verde-escuro/[0.015]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 90vw, 420px"
        className="object-contain p-5"
      />
    </div>
  );
}

/** Caminhos dos assets, para não repetir string solta pelos componentes. */
export const FOTO_SACHE = "/produto-kit-sache.webp";
export const FOTO_FRASCOS = "/produto-kit-frascos.webp";
