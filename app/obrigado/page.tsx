import type { Metadata } from "next";
import Image from "next/image";
import { WHATSAPP_URL, SOCIAL_LINKS } from "@/lib/constants";
import { TruckIcon } from "@/components/lovable/Icons";

export const metadata: Metadata = {
  title: "CarboZé — Obrigado pela sua compra",
  description: "Recebemos seu pedido. Já estamos preparando o envio.",
  robots: { index: false, follow: false },
};

const passos = [
  {
    n: "01",
    titulo: "Confirmação por e-mail",
    body: "Você recebe os dados do pedido e o link de acompanhamento da entrega.",
  },
  {
    n: "02",
    titulo: "Separação e envio",
    body: "Assim que despachar, o código de rastreio chega no mesmo e-mail.",
  },
  {
    n: "03",
    titulo: "Primeiro uso",
    body: "Despeje no tanque antes de abastecer. Sem medição, sem mecânico.",
  },
];

export default function ObrigadoPage() {
  return (
    <main className="min-h-screen bg-verde-escuro flex flex-col items-center justify-center px-4 py-12">
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-limao/[0.06] blur-[160px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center">
        <Image
          src="/logo-footer.png"
          alt="CarboZé"
          width={1920}
          height={1080}
          priority
          className="w-auto"
          style={{ height: "80px" }}
        />

        <div className="mt-6 w-16 h-16 rounded-2xl bg-limao flex items-center justify-center text-verde-escuro shadow-lg">
          <TruckIcon className="w-8 h-8" />
        </div>

        <h1 className="mt-5 font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-2xl sm:text-3xl leading-tight">
          Obrigado! Seu pedido está{" "}
          <span className="text-limao">confirmado.</span>
        </h1>

        <p className="mt-3 font-[family-name:var(--font-archivo)] text-white/60 text-sm md:text-base leading-relaxed max-w-md">
          Já estamos preparando o envio. Os detalhes do pedido e o rastreio
          chegam no seu e-mail.
        </p>

        {/* O que acontece agora */}
        <div className="mt-8 w-full flex flex-col gap-3 text-left">
          {passos.map((p) => (
            <div
              key={p.n}
              className="rounded-2xl bg-white/[0.06] border border-white/10 p-4 flex gap-4"
            >
              <span className="font-[family-name:var(--font-basement)] font-extrabold text-limao text-sm shrink-0">
                {p.n}
              </span>
              <div>
                <p className="font-[family-name:var(--font-basement)] font-bold text-white text-sm">
                  {p.titulo}
                </p>
                <p className="mt-1 font-[family-name:var(--font-archivo)] text-white/55 text-xs leading-relaxed">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Suporte */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 w-full border border-limao/40 text-limao font-[family-name:var(--font-basement)]
                     font-extrabold uppercase text-sm py-3.5 rounded-xl hover:bg-limao/10
                     active:scale-[0.98] transition-all flex items-center justify-center"
        >
          Falar com o suporte
        </a>

        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 font-[family-name:var(--font-archivo)] text-white/35 text-xs hover:text-limao transition-colors"
        >
          Acompanhe @ocarboze
        </a>
      </div>
    </main>
  );
}
