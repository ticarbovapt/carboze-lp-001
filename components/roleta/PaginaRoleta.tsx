import Image from "next/image";
import RoletaClient from "./RoletaClient";

/**
 * A página da roleta, sem a rota.
 *
 * Uma tela e ponto final: `100svh` com `overflow-hidden`. Como o botão de
 * girar está DENTRO da roda, nada precisa vir abaixo dela, e rolar só
 * afastaria a pessoa do único gesto que a página pede. O aviso legal fica,
 * mas dentro da tela — sumir com ele para caber seria trocar transparência
 * por pixel.
 */
export default function PaginaRoleta() {
  return (
    <main className="relative h-[100svh] overflow-hidden bg-[#050705] flex flex-col items-center justify-between px-3 py-4">
      {/* Fundo: grade em fuga + raios de luz, o clima da arte da roleta */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 roleta-raios" />
        <div className="absolute inset-x-0 bottom-0 h-[45vh] roleta-grade" />
        <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[720px] max-w-[130vw] aspect-square rounded-full bg-limao/[0.09] blur-[130px]" />
      </div>

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

      <div className="relative z-10 w-full min-h-0 flex flex-col items-center justify-center">
        <RoletaClient />
      </div>

      <p className="relative z-10 font-[family-name:var(--font-archivo)] text-white/25 text-[10px] leading-snug max-w-sm text-center">
        Promoção válida para clientes com pedido confirmado, um giro por
        cliente. Prêmios sujeitos a confirmação pelo time CarboZé.
      </p>
    </main>
  );
}
