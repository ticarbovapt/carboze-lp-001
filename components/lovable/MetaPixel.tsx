"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { META_PIXEL_ID, esvaziarFilaPorBeacon, track } from "@/lib/metaPixel";

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

  // Rede de segurança da fila: quem esconde ou fecha a página antes de o
  // fbevents.js carregar teria PageView/ViewContent descartados junto com a
  // fila do stub. Ao sair, o que estiver pendente vai por beacon (e sai da
  // fila, para não duplicar se a pessoa voltar à aba). Depois que a biblioteca
  // carrega, a chamada vira no-op. `pagehide` cobre o fechamento em navegador
  // que não dispara `visibilitychange`; se os dois vierem, o segundo acha a
  // fila vazia.
  useEffect(() => {
    const aoEsconder = () => {
      if (document.visibilityState === "hidden") esvaziarFilaPorBeacon();
    };
    document.addEventListener("visibilitychange", aoEsconder);
    window.addEventListener("pagehide", esvaziarFilaPorBeacon);
    return () => {
      document.removeEventListener("visibilitychange", aoEsconder);
      window.removeEventListener("pagehide", esvaziarFilaPorBeacon);
    };
  }, []);

  return (
    <>
      {/*
        Stub agora, biblioteca quando a página estiver ociosa.

        O snippet oficial do Meta faz duas coisas na mesma linha: define o `fbq`
        (que é só uma fila) e injeta o fbevents.js. A biblioteca é o maior custo
        de JS da página: o fbevents.js tem 420 KB crus e ele ainda baixa o
        config do pixel (signals/config), outros 502 KB — ~920 KB para o
        navegador parsear e executar.

        As duas etapas ficam separadas. O stub e os `fbq(...)` rodam de
        imediato: `init` e `PageView` entram na fila. Quando a biblioteca
        carrega, esvazia a fila — é para isso que a fila do `fbq` existe.

        `autoConfig` desligado antes do `init`: sem ele o fbevents liga
        SubscribedButtonClick e Microdata, que varrem o DOM a cada clique para
        inferir eventos. Não usamos nenhum dos dois (os eventos são explícitos),
        e esse trabalho caía justamente no clique de "Escolher produto".

        Quando injetar — histórico das tentativas:
        1. `requestIdleCallback` com timeout de 2,5s: disparava perto de 1s e
           disputava banda com o LCP.
        2. Primeiro toque/rolagem (fallback 10s): protegeu o LCP, mas empurrou
           o parse dos ~920 KB para logo depois do primeiro toque — exatamente
           quando a pessoa toca no card de preço. O CrUX mostrou INP de 304ms
           no mobile.
        3. Horário fixo após o `load` (+3s, depois +6s): tirou o parse do
           primeiro toque, mas continuava caindo em cima de algum toque — em
           teste com CPU 4x, +6s ainda gerou interações de 500ms. Com +3s o
           Lighthouse às vezes pegava o parse (242ms no fbevents + 153ms no
           config) dentro da janela do TBT.
        4. Agora: espera o `load` + 5s E uma pausa de 1,5s sem toque, tecla ou
           rolagem; aí `requestIdleCallback` (timeout 1s). O parse cai enquanto
           a pessoa está lendo, não enquanto está tocando. Os listeners só
           gravam um timestamp (custo zero na interação). Teto de 20s para
           quem nunca para de rolar. Quem sai antes disso é coberto pelo beacon
           abaixo.

        A troca: o evento da fila só sai quando a biblioteca carrega. Para não
        perder quem sai antes disso, a fila vai por beacon ao esconder/fechar a
        página (efeito acima) e o InitiateCheckout usa `trackGarantido` (ver
        lib/metaPixel.ts). `__czFbReady` marca que a biblioteca assumiu.
      */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[]}(window,document,'script');
fbq('set','autoConfig',false,'${META_PIXEL_ID}');
fbq('init','${META_PIXEL_ID}');
fbq('track','PageView');
(function(){var carregou=false;
function carregar(){if(carregou)return;carregou=true;
var t=document.createElement('script');t.async=!0;
t.onload=function(){window.__czFbReady=true};
t.src='https://connect.facebook.net/en_US/fbevents.js';
document.head.appendChild(t);}
var ultimo=0;
['pointerdown','touchstart','keydown','scroll','wheel'].forEach(function(ev){
addEventListener(ev,function(){ultimo=Date.now()},{capture:true,passive:true})});
function tenta(){if(carregou)return;var quieto=Date.now()-ultimo;
if(quieto<1500){setTimeout(tenta,1550-quieto);return}
if(window.requestIdleCallback)requestIdleCallback(carregar,{timeout:1000});
else carregar()}
function agendar(){setTimeout(tenta,5000)}
if(document.readyState==='complete')agendar();
else addEventListener('load',agendar,{once:true});
setTimeout(carregar,20000)})();`}
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
