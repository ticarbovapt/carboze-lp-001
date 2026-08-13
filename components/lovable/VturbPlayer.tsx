import Script from "next/script";

const VTURB_ACCOUNT = "309da15a-481a-42a5-88a8-7e366ad043fe";

interface VturbPlayerProps {
  /** ID do player no VTurb (o mesmo do id="vid-..." do embed). */
  playerId: string;
  /** ID do vídeo no CDN — usado só para pré-buscar o manifesto HLS. */
  videoId?: string;
  /** Proporção do player. VSL vertical = 9/16 (padrão). */
  aspect?: "9 / 16" | "16 / 9" | "1 / 1";
  className?: string;
}

/**
 * Player do VTurb (ConverteAI).
 *
 * O embed oficial é um custom element (`<vturb-smartplayer>`) que o script do
 * VTurb encontra no DOM e assume. Entregamos ele via `dangerouslySetInnerHTML`
 * de propósito: assim o React nunca reconcilia o conteúdo interno e não briga
 * com as mutações que o player faz na própria árvore. O placeholder já vai no
 * HTML do servidor, então o espaço do vídeo não pula quando o script carrega.
 *
 * Os `<link>` de preload/dns-prefetch vêm da recomendação do VTurb para o
 * <head>; o React 19 iça essas tags automaticamente, então declarar aqui tem o
 * mesmo efeito de colar no head — com a vantagem de só existirem nas páginas
 * que realmente usam o player.
 */
export default function VturbPlayer({
  playerId,
  videoId,
  aspect = "9 / 16",
  className = "",
}: VturbPlayerProps) {
  const playerSrc = `https://scripts.converteai.net/${VTURB_ACCOUNT}/players/${playerId}/v4/player.js`;

  // padding-top que reserva a altura do vídeo antes do script carregar
  const padding =
    aspect === "9 / 16" ? "177.77777777777777%" : aspect === "1 / 1" ? "100%" : "56.25%";

  return (
    <>
      <link rel="dns-prefetch" href="https://cdn.converteai.net" />
      <link rel="dns-prefetch" href="https://scripts.converteai.net" />
      <link rel="dns-prefetch" href="https://images.converteai.net" />
      <link rel="dns-prefetch" href="https://license.vturb.com" />
      <link rel="preload" as="script" href={playerSrc} />
      <link
        rel="preload"
        as="script"
        href="https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js"
      />
      {videoId && (
        <link
          rel="preload"
          as="fetch"
          href={`https://cdn.converteai.net/${VTURB_ACCOUNT}/${videoId}/main.m3u8`}
        />
      )}

      {/* Marca o início do carregamento — o player usa isso na métrica de tempo até o play. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "!function(i,n){i._plt=i._plt||(n&&n.timeOrigin?n.timeOrigin+n.now():Date.now())}(window,performance);",
        }}
      />

      <div
        className={className}
        dangerouslySetInnerHTML={{
          __html:
            `<vturb-smartplayer id="vid-${playerId}" style="display:block;margin:0 auto;width:100%">` +
            `<div class="vturb-player-placeholder" style="position:relative;width:100%;padding:${padding} 0 0;z-index:0;background-color:#000"></div>` +
            `</vturb-smartplayer>`,
        }}
      />

      <Script id={`vturb-${playerId}`} src={playerSrc} strategy="afterInteractive" />
    </>
  );
}
