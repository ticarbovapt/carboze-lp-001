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
 *    em que o HTML chega.
 *
 * O preload continua, agora com `media`. O problema original era um
 * `<link rel="preload">` na home apontando para a arte de DESKTOP: no celular
 * gastava prioridade alta numa imagem que nunca era pintada. Eu tirei o
 * preload inteiro, e isso custou LCP — no desktop foi de 605ms para 995ms,
 * porque a arte passou a ser descoberta no meio do <body> em vez de no <head>.
 * Com `media` o navegador pede uma só, e no lugar certo da fila.
 *
 * O preload mora aqui junto do <picture>, não na página, para não haver duas
 * fontes de verdade sobre qual arte é a prioritária de cada LP.
 */
export default function HeroBgPicture({ desktop, mobile, prioritaria = false }: HeroBgPictureProps) {
  return (
    <picture>
      {prioritaria && mobile && (
        <link rel="preload" as="image" href={mobile} media="(max-width: 639px)" fetchPriority="high" />
      )}
      {prioritaria && (
        <link
          rel="preload"
          as="image"
          href={desktop}
          media={mobile ? "(min-width: 640px)" : undefined}
          fetchPriority="high"
        />
      )}
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
