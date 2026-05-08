interface PriceBlockProps {
  variant?: "light" | "dark";
  showDescription?: boolean;
}

export default function PriceBlock({
  variant = "light",
  showDescription = false,
}: PriceBlockProps) {
  const borderColor =
    variant === "dark" ? "border-white/20" : "border-verde-escuro/20";
  const textMuted =
    variant === "dark" ? "text-white/70" : "text-verde-escuro/60";
  const textMain = variant === "dark" ? "text-white" : "text-verde-escuro";

  return (
    <div className={`border ${borderColor} rounded-2xl p-5 w-full`}>
      <p
        className={`text-xs uppercase tracking-widest font-[family-name:var(--font-barlow)] font-bold ${textMuted} mb-1`}
      >
        Pack com 10 sachês de 10ml
      </p>
      {showDescription && (
        <p className={`text-sm ${textMuted} mb-3`}>
          10 tanques completos de abastecimento protegidos
        </p>
      )}
      <div className="flex items-baseline gap-3 mb-3">
        <span
          className={`text-4xl font-[family-name:var(--font-barlow)] font-extrabold ${textMain}`}
        >
          R$ 59,90
        </span>
        <span className={`text-sm ${textMuted}`}>à vista</span>
      </div>
      <p className={`text-xs ${textMuted}`}>
        R$ 5,99 por sachê &nbsp;·&nbsp; Um sachê por tanque cheio
      </p>
      <div
        className={`mt-3 pt-3 border-t ${borderColor} flex flex-wrap gap-3 text-xs ${textMuted}`}
      >
        <span>10 sachês</span>
        <span>·</span>
        <span>10 tanques protegidos</span>
      </div>
    </div>
  );
}
