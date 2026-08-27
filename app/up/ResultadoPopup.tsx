"use client";

import { useEffect, useRef } from "react";
import { ROLETA, resgateWhatsApp, type KitRoleta, type PremioRoleta } from "@/lib/constants";
import { marcarUpsellResolvido } from "@/lib/funnelState";
import { track } from "@/lib/metaPixel";

/**
 * O resultado do giro, subindo na frente da roleta.
 *
 * Sobe da base no celular e centraliza no desktop: no celular o canto de baixo
 * é onde o polegar já está, e a animação vindo dali faz o botão chegar embaixo
 * do dedo em vez de longe dele.
 *
 * `max-h: 85svh` com rolagem interna porque o conteúdo varia — o card do kit é
 * bem mais alto que o aviso de chance extra, e em tela baixa o de cima é o que
 * some primeiro. `svh` e não `dvh`: o painel não pode mudar de tamanho enquanto
 * a barra do navegador aparece e some.
 */

type Props = {
  premio: PremioRoleta;
  codigo: string;
  /** Sobrou giro: o desfecho ainda não é o final, é uma chance a mais. */
  chanceExtra: boolean;
  /** Kit que casa com o que a pessoa comprou, e o outro. */
  kit: KitRoleta;
  outroKit: KitRoleta;
  onFechar: () => void;
  /** Só existe quando há giro sobrando. */
  onGirarDeNovo?: () => void;
};

export default function ResultadoPopup({
  premio,
  codigo,
  chanceExtra,
  kit,
  outroKit,
  onFechar,
  onGirarDeNovo,
}: Props) {
  const painelRef = useRef<HTMLDivElement | null>(null);
  const primeiroRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

  // Foco no botão principal e Esc para fechar. Sem isso o popup é uma imagem:
  // quem navega por teclado ficaria preso atrás dele.
  useEffect(() => {
    primeiroRef.current?.focus();
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "Escape") onFechar();
    }
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [onFechar]);

  // Trava a rolagem do fundo enquanto o popup está aberto — senão o toque
  // "atravessa" o overlay e a página corre por baixo dele no celular.
  useEffect(() => {
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = antes;
    };
  }, []);

  const cor = premio.tom === "nada" ? "text-red-400" : "text-limao";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="roleta-resultado-titulo"
    >
      {/* Fundo. Clicar fora fecha — é o gesto que todo mundo tenta primeiro. */}
      <button
        type="button"
        aria-label="Fechar"
        onClick={onFechar}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-default"
      />

      <div
        ref={painelRef}
        className="popup-sobe relative w-full max-w-md max-h-[85svh] overflow-y-auto
                   rounded-t-3xl sm:rounded-3xl sm:mx-4
                   border border-limao/25 bg-[#0a0d08] p-6 pb-8 text-center
                   shadow-[0_-8px_60px_rgba(169,218,0,0.18)] sm:shadow-[0_0_60px_rgba(169,218,0,0.18)]"
        style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
      >
        {/* Alça: no celular ela diz "isto se puxa/fecha" sem precisar escrever */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20 sm:hidden" />

        <p
          className={`font-[family-name:var(--font-basement)] font-bold uppercase text-[11px] tracking-[0.18em] ${cor}`}
        >
          {chanceExtra ? "Quase!" : "Você ganhou"}
        </p>

        <h2
          id="roleta-resultado-titulo"
          className="mt-2 font-[family-name:var(--font-basement)] font-extrabold uppercase text-white text-[26px] leading-[1.05]"
        >
          {chanceExtra ? (
            <>
              Você ganhou <span className="text-limao">mais 1 chance</span>
            </>
          ) : (
            premio.titulo
          )}
        </h2>

        <p className="mt-3 font-[family-name:var(--font-archivo)] text-white/60 text-sm leading-relaxed">
          {chanceExtra
            ? "A roda parou no gomo vazio, mas você não vai embora assim. Gire de novo — esta é por nossa conta."
            : premio.descricao}
        </p>

        {chanceExtra ? (
          <button
            type="button"
            ref={primeiroRef as React.RefObject<HTMLButtonElement>}
            onClick={onGirarDeNovo}
            className="cta-shine roleta-cta mt-6 w-full rounded-2xl bg-limao px-6 py-5
                       font-[family-name:var(--font-basement)] font-extrabold uppercase
                       text-verde-escuro text-xl tracking-wide
                       hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Girar de novo
          </button>
        ) : premio.resgate === "whatsapp" ? (
          <>
            <div className="mt-5 rounded-xl border border-limao/25 bg-limao/[0.06] px-4 py-3">
              <p className="font-[family-name:var(--font-archivo)] text-white/45 text-[11px] uppercase tracking-wider">
                Código do seu giro
              </p>
              <p className="mt-1 font-[family-name:var(--font-basement)] font-extrabold text-limao text-2xl tracking-[0.12em] tabular-nums">
                {codigo}
              </p>
            </div>
            <a
              ref={primeiroRef as React.RefObject<HTMLAnchorElement>}
              href={resgateWhatsApp(premio.titulo, codigo)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("Lead", { content_name: `roleta:${premio.id}` })}
              className="cta-shine mt-4 block w-full rounded-2xl bg-limao px-5 py-4
                         font-[family-name:var(--font-basement)] font-extrabold uppercase
                         text-verde-escuro text-base hover:brightness-110 active:scale-[0.98] transition-all"
            >
              {premio.ctaLabel}
            </a>
            <p className="mt-3 font-[family-name:var(--font-archivo)] text-white/35 text-xs">
              Guarde o código: ele é o comprovante do seu giro.
            </p>
          </>
        ) : (
          <>
            {/* O produto, o preço e a seta: daqui a pessoa vai direto ao
                checkout com o desconto já no preço. */}
            <a
              ref={primeiroRef as React.RefObject<HTMLAnchorElement>}
              href={kit.href}
              onClick={marcarUpsellResolvido}
              className="cta-shine group mt-5 flex w-full items-center justify-between gap-3
                         rounded-2xl bg-limao px-5 py-4 text-left text-verde-escuro
                         hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <span>
                <span className="block font-[family-name:var(--font-basement)] font-extrabold uppercase text-base leading-tight">
                  {kit.titulo}
                </span>
                <span className="block font-[family-name:var(--font-archivo)] text-verde-escuro/60 text-xs mt-0.5">
                  {kit.subtitulo}
                </span>
                <span className="mt-1.5 flex items-baseline gap-2">
                  <span className="font-[family-name:var(--font-archivo)] text-verde-escuro/50 text-sm line-through">
                    {kit.de}
                  </span>
                  <span className="font-[family-name:var(--font-basement)] font-extrabold text-2xl leading-none">
                    {kit.por}
                  </span>
                </span>
              </span>
              <svg
                viewBox="0 0 16 16"
                className="w-6 h-6 shrink-0 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>

            {/* O desconto vale para os dois kits; quem tem moto e carro não
                precisa voltar à loja para achar o outro. */}
            <a
              href={outroKit.href}
              onClick={marcarUpsellResolvido}
              className="mt-3 block font-[family-name:var(--font-archivo)]
                         text-white/45 text-xs underline underline-offset-4 hover:text-white/75 transition-colors"
            >
              Quero o {outroKit.titulo.toLowerCase()} com o mesmo desconto
            </a>
          </>
        )}

        {!chanceExtra && (
          <a
            href={ROLETA.declineHref}
            onClick={marcarUpsellResolvido}
            className="mt-6 block font-[family-name:var(--font-archivo)]
                       text-white/30 text-xs underline underline-offset-4 hover:text-white/60 transition-colors"
          >
            {premio.resgate === "whatsapp"
              ? "Resgatar depois, ir para o meu pedido"
              : "Não quero agora, ir para o meu pedido"}
          </a>
        )}
      </div>
    </div>
  );
}
