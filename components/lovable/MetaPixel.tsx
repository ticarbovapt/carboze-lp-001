"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { META_PIXEL_ID, track } from "@/lib/metaPixel";

/**
 * Carrega o Meta Pixel e cuida dos eventos que dependem de navegação.
 *
 * PageView em troca de rota: o App Router navega no cliente, sem recarregar a
 * página. O snippet padrão do Meta dispara PageView uma única vez, no load —
 * então quem vai de /upsell para /obrigado não seria contado.
 *
 * ViewContent: dispara quando a seção de preços entra na tela. Serve para
 * público de remarketing de quem viu preço e não comprou.
 */
export default function MetaPixel() {
  const pathname = usePathname();
  const primeiraRota = useRef(true);

  // O snippet já dispara PageView no load; aqui cobrimos só as trocas seguintes.
  useEffect(() => {
    if (primeiraRota.current) {
      primeiraRota.current = false;
      return;
    }
    track("PageView");
  }, [pathname]);

  // ViewContent — uma vez por rota, quando a seção de preços aparece
  useEffect(() => {
    const alvo = document.getElementById("escolha-produto");
    if (!alvo) return;
    let disparado = false;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || disparado) return;
        disparado = true;
        track("ViewContent", { content_name: "Seção de preços", content_type: "product_group" });
        obs.disconnect();
      },
      { threshold: 0.4 }
    );
    obs.observe(alvo);
    return () => obs.disconnect();
  }, [pathname]);

  return (
    <>
      {/*
        Stub agora, biblioteca depois.

        O snippet oficial do Meta faz duas coisas na mesma linha: define o `fbq`
        (que é só uma fila) e injeta o fbevents.js. A biblioteca são 222 KB
        entre fbevents.js e o config do pixel — o maior custo de JS da página, e
        o principal suspeito do TBT de 445ms no mobile.

        Aqui as duas etapas ficam separadas. O stub e os `fbq(...)` rodam de
        imediato: `init` e `PageView` entram na fila, e qualquer clique que
        dispare InitiateCheckout antes da biblioteca carregar também entra. A
        injeção do fbevents.js espera a página ficar ociosa (ou 2,5s, ou o
        primeiro toque do usuário — o que vier primeiro). Quando ele carrega,
        esvazia a fila e nada se perde: é exatamente para isso que a fila do
        `fbq` existe.
      */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[]}(window,document,'script');
fbq('init','${META_PIXEL_ID}');
fbq('track','PageView');
(function(){var carregou=false;
function carregar(){if(carregou)return;carregou=true;
var t=document.createElement('script');t.async=!0;
t.src='https://connect.facebook.net/en_US/fbevents.js';
document.head.appendChild(t);}
['pointerdown','touchstart','keydown','scroll'].forEach(function(ev){
addEventListener(ev,carregar,{once:true,passive:true})});
if('requestIdleCallback' in window){requestIdleCallback(carregar,{timeout:2500})}
else{setTimeout(carregar,2500)}})();`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
