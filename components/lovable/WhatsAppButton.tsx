import { WhatsAppIcon } from "@/components/lovable/Icons";
import { WHATSAPP_URL } from "@/lib/constants";

interface WhatsAppButtonProps {
  label?: string;
  href?: string;
  className?: string;
}

/**
 * Botão de WhatsApp com a identidade do canal (verde #25D366 + ícone).
 *
 * Verde da marca em vez do limão da CarboZé de propósito: no fim do FAQ o
 * usuário está com uma dúvida específica, e o que precisa reconhecer ali é
 * "isso abre uma conversa", não "isso é um botão de compra". O limão já é o
 * CTA de checkout em todas as outras seções — repetir a mesma cor aqui faria
 * as duas ações competirem.
 *
 * Texto em verde-escuro, não branco: branco sobre #25D366 dá ~2:1 de
 * contraste e reprova no Lighthouse (o rótulo tem 16–18px bold, abaixo do
 * "texto grande", então precisa de 4,5:1). Verde-escuro sobre o mesmo verde
 * dá ~6,4:1 e mantém o fundo com a cara do WhatsApp.
 */
export default function WhatsAppButton({
  label = "FALAR NO WHATSAPP",
  href = WHATSAPP_URL,
  className = "",
}: WhatsAppButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-8 py-4
                  font-[family-name:var(--font-basement)] font-bold uppercase tracking-wide
                  text-base md:text-lg text-verde-escuro shadow-lg shadow-black/10
                  transition-all hover:brightness-105 active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 ${className}`}
    >
      <WhatsAppIcon className="w-5 h-5 shrink-0" />
      {label}
    </a>
  );
}
