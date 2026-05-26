import { CHECKOUT_MOTOS } from "@/lib/constants";

interface QuantityPickerProps {
  variant?: "light" | "dark";
}

export default function QuantityPicker({ variant = "dark" }: QuantityPickerProps) {
  const borderBase =
    variant === "dark" ? "border-white/20" : "border-verde-escuro/20";
  const textMain = variant === "dark" ? "text-white" : "text-verde-escuro";
  const textMuted = variant === "dark" ? "text-white/60" : "text-verde-escuro/60";

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {CHECKOUT_MOTOS.map((opt) => (
        <a
          key={opt.qty}
          href={opt.url}
          className={`relative border-2 ${
            opt.popular ? "border-limao" : borderBase
          } rounded-2xl p-5 flex flex-col gap-2 transition-all hover:scale-[1.02] hover:border-limao group`}
        >
          {opt.popular && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-limao text-verde-escuro text-xs font-bold uppercase px-3 py-1 rounded-full font-[family-name:var(--font-basement)] whitespace-nowrap">
              Mais popular
            </span>
          )}
          <p
            className={`font-[family-name:var(--font-basement)] font-extrabold text-lg uppercase ${textMain}`}
          >
            {opt.label}
          </p>
          <p className={`text-sm ${textMuted}`}>
            {opt.sachets} sachês &nbsp;·&nbsp; {opt.sachets} tanques
          </p>
          <p
            className={`font-[family-name:var(--font-basement)] font-extrabold text-3xl ${textMain} mt-1`}
          >
            {opt.price}
          </p>
          <p className={`text-xs ${textMuted}`}>à vista · R$ 5,99/tanque</p>
          <span className="mt-3 block text-center font-[family-name:var(--font-basement)] font-bold uppercase text-sm py-2.5 rounded-full bg-limao text-verde-escuro transition-all group-hover:bg-verde-medio group-hover:text-white">
            COMPRAR AGORA
          </span>
        </a>
      ))}
    </div>
  );
}
