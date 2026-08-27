import Image from "next/image";
import RoletaClient from "./RoletaClient";
import type { VarianteRoleta } from "./Roleta";

/**
 * A página da roleta, sem a rota.
 *
 * Existe porque /up e /up1 são o MESMO funil com uma diferença só: onde fica o
 * botão de girar. Duplicar a página para testar isso garantiria que uma das
 * duas ficasse para trás no primeiro ajuste de texto — e aí o teste A/B não
 * mediria mais o botão, mediria a divergência.
 *
 * A diferença de layout sai daí:
 *
 * - `abaixo`: a página rola. O CTA vem depois da roda, e depois dele cabe o
 *   texto de apoio.
 * - `miolo`: uma tela e ponto final — `100svh` com `overflow-hidden`. Como o
 *   botão está DENTRO da roda, nada precisa vir abaixo dela, e rolar só
 *   afastaria a pessoa do único gesto que a página pede. O aviso legal fica,
 *   mas dentro da tela: sumir com ele para caber seria trocar transparência
 *   por pixel.
 */
export default function PaginaRoleta({ variante }: { variante: VarianteRoleta }) {
  const telaUnica = variante === "miolo";

  return (
    <main
      className={`relative overflow-hidden bg-[#050705] flex flex-col items-center ${
        telaUnica
          ? "h-[100svh] justify-between px-3 py-4"
          : "min-h-screen px-3 py-5 sm:px-4 sm:py-10"
      }`}
    >
      {/* Fundo: grade em fuga + raios de luz, o clima da arte da roleta */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 roleta-raios" />
        <div className="absolute inset-x-0 bottom-0 h-[45vh] roleta-grade" />
        <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[720px] max-w-[130vw] aspect-square rounded-full bg-limao/[0.09] blur-[130px]" />
      </div>

      {/*
        A ordem aqui é a da dobra do celular pequeno: logo, a retenção, o H1 e
        a roda. Na variante que rola, o texto de apoio vem DEPOIS da roleta —
        no iPhone SE era justamente ele que empurrava o botão de girar para
        fora da tela, e explicação nenhuma vale um CTA invisível.
      */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg flex flex-col items-center text-center">
        <Image
          src="/logo-footer.png"
          alt="CarboZé"
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
          className="h-10 sm:h-16 w-auto"
        />

        {/* Segura a pessoa na página enquanto o pagamento confirma: é isso
            que dá à roleta o tempo dela. */}
        <p className="mt-3 sm:mt-4 font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-[11px] tracking-[0.18em]">
          Não saia dessa página ainda
        </p>
        <p className="mt-1 font-[family-name:var(--font-archivo)] text-white/70 text-[13px] sm:text-sm">
          Estamos confirmando seu pagamento.
        </p>

        <h1 className="mt-2.5 sm:mt-4 font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-[28px] sm:text-4xl leading-[0.95]">
          Gire a <span className="text-limao">roleta</span>
        </h1>
      </div>

      <div
        className={`relative z-10 w-full flex flex-col items-center ${
          telaUnica ? "min-h-0 justify-center" : "mt-3 sm:mt-6 max-w-md sm:max-w-lg"
        }`}
      >
        <RoletaClient variante={variante} />
      </div>

      {telaUnica ? (
        <p className="relative z-10 font-[family-name:var(--font-archivo)] text-white/25 text-[10px] leading-snug max-w-sm text-center">
          Promoção válida para clientes com pedido confirmado, um giro por
          cliente. Prêmios sujeitos a confirmação pelo time CarboZé.
        </p>
      ) : (
        <div className="relative z-10 w-full max-w-md sm:max-w-lg flex flex-col items-center text-center">
          <p className="mt-7 font-[family-name:var(--font-archivo)] text-white/55 text-sm leading-relaxed max-w-xs">
            Enquanto a confirmação não chega, aproveite a sua vez e concorra a
            prêmios incríveis.
          </p>

          <p className="mt-5 font-[family-name:var(--font-archivo)] text-white/25 text-[11px] leading-relaxed max-w-sm">
            Promoção válida para clientes com pedido confirmado, um giro por
            cliente. Prêmios sujeitos a confirmação pelo time CarboZé.
          </p>
        </div>
      )}
    </main>
  );
}
