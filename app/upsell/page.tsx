import type { Metadata } from "next";
import Image from "next/image";
import UpsellClient from "./UpsellClient";
import { UPSELL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "CarboZé — Seu desconto exclusivo de cliente",
  description:
    "Oferta liberada após a sua compra: leve mais CarboZé com desconto já aplicado no preço.",
  // Etapa de funil, atrás da compra: não indexar.
  robots: { index: false, follow: false },
};

export default function UpsellPage() {
  return (
    <main className="min-h-screen bg-verde-escuro flex flex-col items-center justify-center px-4 py-10">
      {/* Glow de fundo */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-limao/[0.07] blur-[160px]" />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center">
        <Image
          src="/logo-footer.png"
          alt="CarboZé"
          width={1920}
          height={1080}
          priority
          className="w-auto"
          style={{ height: "80px" }}
        />

        <p className="mt-4 font-[family-name:var(--font-basement)] font-bold uppercase text-limao text-[11px] tracking-[0.18em]">
          Pagamento confirmado
        </p>

        <h1 className="mt-2 font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-2xl sm:text-3xl leading-tight">
          Só para clientes:{" "}
          <span className="text-limao">20% off agora.</span>
        </h1>

        <p className="mt-3 font-[family-name:var(--font-archivo)] text-white/60 text-sm leading-relaxed max-w-sm">
          Seu pedido já está garantido. Aproveite para reforçar o estoque com
          desconto — este preço não aparece na loja.
        </p>

        <div className="mt-7 w-full">
          <UpsellClient />
        </div>
      </div>
    </main>
  );
}
