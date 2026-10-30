import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: { absolute: "Ação Parada Certa — Grupo Carbo" },
  description: "Os agendamentos da Ação Parada Certa estão encerrados. Quem já agendou, compareça no horário marcado.",
  alternates: { canonical: "/parada-certa" },
  robots: { index: false, follow: false },
};

// Os agendamentos foram encerrados: a página pública não recebe mais cadastro
// nem lista de espera — só informa que encerrou e lembra quem já agendou.
// O painel interno segue ativo em /parada-certa/admin.
// (O formulário continua em ParadaCertaForm.tsx caso a ação seja reaberta.)
export default function ParadaCertaPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-verde-escuro px-5 py-10 text-center">
      <Image
        src="/grupocarbo-logo.png"
        alt="Grupo Carbo"
        width={200}
        height={60}
        className="h-auto w-44 opacity-95"
        priority
      />

      <div className="mt-10 w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-[family-name:var(--font-archivo)] text-xs font-bold uppercase tracking-widest text-white"
          style={{ backgroundImage: "linear-gradient(100deg, #2b7fe4, #1fae4d)" }}
        >
          Ação Parada Certa
        </span>

        <h1 className="mt-5 font-[family-name:var(--font-basement)] text-3xl font-extrabold uppercase leading-tight text-white">
          Agendamentos
          <br />
          encerrados
        </h1>

        <p className="mt-4 font-[family-name:var(--font-archivo)] text-[15px] leading-relaxed text-white/70">
          As vagas já foram preenchidas e não estamos mais recebendo novos
          agendamentos.
        </p>

        {/* Lembrete para quem já agendou */}
        <div className="mt-6 rounded-xl border border-limao/40 bg-limao/10 p-4 text-left">
          <p className="font-[family-name:var(--font-basement)] text-sm font-extrabold uppercase text-limao">
            Já agendou?
          </p>
          <p className="mt-1.5 font-[family-name:var(--font-archivo)] text-[14px] leading-relaxed text-white/85">
            Fique atento e compareça no <b>dia e horário que você marcou</b>, no
            Container Parada Certa — Marginal Arena das Dunas, Lagoa Nova,
            Natal/RN.
          </p>
          <p className="mt-2 font-[family-name:var(--font-archivo)] text-[14px] font-semibold text-white">
            ⏰ Chegue 10 minutos antes do seu horário.
          </p>
        </div>

        <p className="mt-6 font-[family-name:var(--font-archivo)] text-[14px] leading-relaxed text-white/60">
          Obrigado pelo interesse! Fique de olho nas nossas redes para as
          próximas ações do Grupo Carbo. 💙
        </p>
      </div>

      <a
        href="https://www.carboze.com.br"
        className="mt-8 font-[family-name:var(--font-archivo)] text-sm font-semibold text-limao transition hover:underline"
      >
        Conhecer o CarboZé →
      </a>
    </main>
  );
}
