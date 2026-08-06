import Image from "next/image";

/**
 * Packshot no topo do card de preço.
 *
 * As fotos já vêm com cenário e iluminação próprios (fundo verde, glow,
 * reflexo). Por isso aqui não há palco nem overlay: qualquer camada extra
 * brigaria com a luz que já existe na imagem. O componente só enquadra.
 *
 * `object-cover` porque os arquivos já foram recortados em 4:3 com o produto
 * na posição certa — sachê puxado para a direita (onde estão os produtos no
 * banner original), frasco centralizado.
 *
 * O fundo escuro das fotos separa o topo do card do corpo claro, o que puxa
 * o olho para o produto antes do preço.
 */
export default function FotoProduto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-verde-escuro ring-1 ring-inset ring-white/10">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 90vw, 420px"
        className="object-cover"
      />
    </div>
  );
}

/** Caminhos dos assets, para não repetir string solta pelos componentes. */
export const FOTO_SACHE = "/produto-kit-sache.webp";
export const FOTO_FRASCOS = "/produto-kit-frascos.webp";
