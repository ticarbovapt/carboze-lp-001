import Script from "next/script";

/**
 * UTMify — captura os parâmetros de UTM da visita e os carrega pelo funil,
 * para a venda ser atribuída à campanha que a originou.
 *
 * O snippet oficial vem ofuscado (base64 + XOR) e monta a tag em runtime.
 * Aqui está a forma direta, com o mesmo efeito: carregar
 * `cdn.utmify.com.br/scripts/utms/latest.js` com os atributos de config.
 * Preferido por ser auditável — dá para ver o que carrega sem decodificar —
 * e por versionar no git como qualquer outra dependência.
 *
 * Fica em `afterInteractive` de propósito, mesmo com o MutationObserver que
 * ele instala no body (reescreve links/forms a cada mutação). O script tem que
 * decorar os links de compra antes do primeiro clique, senão a venda perde a
 * UTM; adiar para `lazyOnload`/ocioso abriria essa janela. O que pesa não é o
 * arquivo (6 KB), é cada mutação de DOM disparar a varredura — o remédio é a
 * página mutar menos, não carregar o UTMify mais tarde.
 *
 * `data-utmify-is-nuvem-shop` NÃO entra aqui de propósito: esse atributo diz
 * ao script que a página é uma loja Nuvemshop, o que vale para
 * loja.carboze.com.br, não para estas LPs em Next.js.
 */
export default function Utmify() {
  return (
    <Script
      id="utmify"
      src="https://cdn.utmify.com.br/scripts/utms/latest.js"
      strategy="afterInteractive"
      data-utmify-prevent-xcod-sck=""
      data-utmify-prevent-subids=""
    />
  );
}
