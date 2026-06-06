import { CHECKOUT_MOTOS } from "@/lib/constants";

interface QuantityPickerProps {
  variant?: "light" | "dark";
}

export default function QuantityPicker({ variant = "dark" }: QuantityPickerProps) {
  const borderClass = variant === "dark" ? "border-limao" : "border-verde-escuro";
  const textMain    = variant === "dark" ? "text-white" : "text-verde-escuro";
  const textMuted   = variant === "dark" ? "text-white/60" : "text-verde-escuro/60";

  return (
    <div className="w-full">
      <a
        href={CHECKOUT_MOTOS}
        className={`relative border-2 ${borderClass} rounded-2xl p-6 flex flex-col items-center gap-3 transition-all hover:scale-[1.02] hover:brightness-105 group bg-limao/10`}
      >
        <p className={`font-[family-name:var(--font-basement)] font-extrabold text-xl uppercase ${textMain}`}>
          Kit 10 Sachês CarboZé Moto
        </p>
        <p className={`text-sm ${textMuted}`}>
          10 sachês &nbsp;·&nbsp; 10 tanques protegidos
        </p>
        <p className={`font-[family-name:var(--font-basement)] font-extrabold text-4xl ${textMain} mt-1`}>
          R$ 59,90
        </p>
        <p className={`text-xs ${textMuted}`}>à vista · R$ 5,99/tanque</p>
        <span className="mt-3 w-full block text-center font-[family-name:var(--font-basement)] font-bold uppercase text-sm py-3 rounded-full bg-limao text-verde-escuro transition-all group-hover:bg-verde-medio group-hover:text-white">
          COMPRAR AGORA
        </span>
      </a>
    </div>
  );
}
