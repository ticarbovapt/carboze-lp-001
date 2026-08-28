"use client";

import Script from "next/script";
import type { ReactNode } from "react";
import { PAYT_ONECLICK } from "@/lib/constants";

/*
 * `payt_action` e `payt_element` são atributos da Payt, não do HTML. O React
 * repassa atributos minúsculos desconhecidos para o DOM sem reclamar, mas o
 * TypeScript não conhece os dois — daí a declaração. Sem ela, a alternativa
 * seria um `as any` no JSX, que apagaria a checagem do resto das props.
 */
declare module "react" {
  interface AnchorHTMLAttributes<T> {
    payt_action?: string;
  }
  interface SelectHTMLAttributes<T> {
    payt_element?: string;
  }
}

/**
 * Botão de compra em 1 clique da Payt.
 *
 * O script da Payt procura no DOM os elementos com `payt_action` e liga o
 * clique neles. Isso impõe duas coisas ao redor deste componente:
 *
 * 1. **O script carrega DEPOIS do botão existir.** Por isso ele é montado
 *    aqui dentro, junto do <a>, e não no layout da página. Carregado no topo,
 *    ele varreria um DOM em que o botão ainda não existe — o popup do prêmio
 *    só aparece uns 20s depois, no fim do segundo giro.
 *
 * 2. **O botão não pode ser destruído e recriado.** Se a Payt guardou uma
 *    referência ao nó, um <a> novo nasce sem vínculo. É por isso que o popup
 *    do prêmio final fica montado e apenas se esconde ao fechar, em vez de
 *    desmontar — ver `ResultadoPopup`.
 *
 * `next/script` cuida de carregar uma vez só, mesmo com o componente montando
 * mais de uma vez.
 *
 * O <select> de parcelas vem do snippet da Payt e fica escondido: o upsell
 * cobra em 1x. Para deixar o comprador escolher, é no editor da Payt que se
 * marca "permitir parcelas" — não aqui.
 */

type Props = {
  className?: string;
  children: ReactNode;
  /** Dispara junto do clique: pixel, marca de funil, o que for. */
  onClick?: () => void;
};

export default function BotaoPayt({ className, children, onClick }: Props) {
  return (
    <>
      {/*
        `href="#"` é o que o snippet da Payt manda usar — quem cancela o
        pulo é o script deles. Se ele não tiver carregado, o clique não
        compra: é o motivo de o script vir junto e não depois.
      */}
      <a
        href="#"
        payt_action="oneclick_buy"
        data-object={PAYT_ONECLICK.objeto}
        onClick={onClick}
        className={className}
      >
        {children}
      </a>

      <select
        payt_element="installment"
        data-object={PAYT_ONECLICK.objeto}
        style={{ display: "none" }}
        aria-hidden="true"
        tabIndex={-1}
      />

      <Script src={PAYT_ONECLICK.script} strategy="afterInteractive" />
    </>
  );
}
