import { WhatsAppIcon } from "@/components/lovable/Icons";
import { WHATSAPP_URL } from "@/lib/constants";

export default function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      className="fixed right-6 z-50 bg-[#25D366] text-white rounded-full p-3.5 shadow-xl shadow-black/30 hover:scale-110 active:scale-95 transition-all duration-200"
      style={{ bottom: "20vh" }}
    >
      <WhatsAppIcon className="w-6 h-6" />
    </a>
  );
}
