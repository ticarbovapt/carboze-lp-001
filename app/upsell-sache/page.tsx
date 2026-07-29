import type { Metadata } from "next";
import Image from "next/image";
import UpsellClient from "./UpsellClient";

export const metadata: Metadata = {
  title: "CarboZé — Uma oferta antes de fechar seu pedido",
  description:
    "Trate 5× mais combustível pagando pouco mais. Oferta válida apenas nesta etapa do pedido.",
  // Etapa de funil: não deve ser indexada nem competir com a home.
  robots: { index: false, follow: false },
};

export default function UpsellSachePage() {
  return (
    <main className="min-h-screen bg-verde-escuro flex flex-col items-center justify-center px-4 py-10">
      {/* Glow de fundo */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-limao/[0.07] blur-[160px]" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        <Image
          src="/logo-footer.png"
          alt="CarboZé"
          width={1920}
          height={1080}
          priority
          className="w-auto mb-2"
          style={{ height: "88px" }}
        />

        {/* Progresso do pedido — compromisso já assumido */}
        <div className="mb-6 flex items-center gap-2" aria-label="Etapa 2 de 3">
          <span className="w-8 h-1 rounded-full bg-limao" />
          <span className="w-8 h-1 rounded-full bg-limao" />
          <span className="w-8 h-1 rounded-full bg-white/15" />
          <span className="ml-2 font-[family-name:var(--font-archivo)] text-white/40 text-[11px] uppercase tracking-widest">
            Quase lá
          </span>
        </div>

        <UpsellClient />
      </div>
    </main>
  );
}
