interface HeroBgPictureProps {
  /** Arte de desktop. */
  desktop: string;
  /** Arte de mobile (recorte diferente). Sem isso, usa a de desktop nos dois. */
  mobile?: string;
  /** Primeira imagem visível da página — vira o elemento de LCP. */
  prioritaria?: boolean;
}

/**
 * Fundo do hero como <picture>, não como background-image.
 *
 * DOIS MOTIVOS, os dois medidos:
 *
 * 1. Uma imagem em vez de duas. Com dois <div> de background e
 *    `block sm:hidden` / `hidden sm:block`, o Chrome baixa as DUAS artes —
 *    confirmado na produção: 84 KB (desktop) + 59 KB (mobile) no mesmo load,
 *    com uma delas em display:none. O <source media> faz o navegador escolher
 *    uma e ignorar a outra antes de qualquer download.
 *
 * 2. LCP mais cedo. `background-image` em style inline só é buscada depois do
 *    CSS e do layout; um <img> no HTML é achado pelo preload scanner na hora
 *    em que o HTML chega. Com fetchPriority alto na primeira arte, ela sai na
 *    frente sem precisar de <link rel="preload"> — que na home apontava para a
 *    arte de DESKTOP e, no celular, gastava prioridade alta numa imagem que
 *    nunca era pintada.
 */
export default function HeroBgPicture({ desktop, mobile, prioritaria = false }: HeroBgPictureProps) {
  return (
    <picture>
      {mobile && <source media="(max-width: 639px)" srcSet={mobile} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={desktop}
        alt=""
        aria-hidden="true"
        fetchPriority={prioritaria ? "high" : "low"}
        loading={prioritaria ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-top sm:object-center"
      />
    </picture>
  );
}
