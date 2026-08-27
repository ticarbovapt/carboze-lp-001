import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import RoletaClient from "./RoletaClient";
import { ROLETA } from "@/lib/constants";

export const metadata: Metadata = {
  title: "CarboZé — Gire a roleta e concorra a prêmios",
  description:
    "Oferta liberada depois da sua compra: gire a roleta CarboZé e concorra a prêmios, com 20% off no kit garantido.",
  // Etapa de funil, atrás da compra: não indexar.
  robots: { index: false, follow: false },
};

export default function UpPage() {
  // Roleta desligada: manda para o upsell direto, que entrega o mesmo desconto
  // sem a roda. Nunca 404 — este link vai em snippet de pós-compra e some do
  // nosso controle assim que é publicado.
  if (!ROLETA.enabled) redirect("/upsell");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050705] flex flex-col items-center px-3 py-5 sm:px-4 sm:py-10">
      {/* Fundo: grade em fuga + raios de luz, o clima da arte da roleta */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 roleta-raios" />
        <div className="absolute inset-x-0 bottom-0 h-[45vh] roleta-grade" />
        <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[720px] max-w-[130vw] aspect-square rounded-full bg-limao/[0.09] blur-[130px]" />
      </div>

      {/*
        A ordem aqui é a da dobra do celular pequeno: logo, a retenção, o H1, a
        roda e o botão. O texto de apoio desceu para DEPOIS da roleta — no
        iPhone SE ele era justamente o que empurrava o botão de girar para fora
        da tela, e explicação nenhuma vale um CTA invisível.
      */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg flex flex-col items-center text-center">
        <Image
          src="/logo-footer.png"
          alt="CarboZé"
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
          className="h-11 sm:h-16 w-auto"
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

        <div className="mt-3 sm:mt-6 w-full flex flex-col items-center">
          <RoletaClient />
        </div>

        <p className="mt-7 font-[family-name:var(--font-archivo)] text-white/55 text-sm leading-relaxed max-w-xs">
          Enquanto a confirmação não chega, aproveite a sua vez e concorra a
          prêmios incríveis.
        </p>

        <p className="mt-5 font-[family-name:var(--font-archivo)] text-white/25 text-[11px] leading-relaxed max-w-sm">
          Promoção válida para clientes com pedido confirmado, um giro por
          cliente. Prêmios sujeitos a confirmação pelo time CarboZé.
        </p>
      </div>
    </main>
  );
}
