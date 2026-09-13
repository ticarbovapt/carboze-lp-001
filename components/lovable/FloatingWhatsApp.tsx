import { WhatsAppIcon } from "@/components/lovable/Icons";
import { WHATSAPP_URL } from "@/lib/constants";

/**
 * `cz-whatsapp-float`: some via CSS enquanto a StickyPriceBar está visível
 * (globals.css, `html[data-cz-sticky]`). Nas páginas sem a barra o atributo
 * nunca aparece e o botão fica sempre na tela.
 */
export default function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      className="cz-whatsapp-float fixed right-6 z-50 bg-[#25D366] text-white rounded-full p-3.5 shadow-xl shadow-black/30 hover:scale-110 active:scale-95 transition-all duration-300"
      style={{ bottom: "20vh" }}
    >
      <WhatsAppIcon className="w-6 h-6" />
    </a>
  );
}
