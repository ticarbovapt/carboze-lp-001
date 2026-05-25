interface NumberBadgeProps {
  number: string;
  variant?: "limao" | "dark";
}

export default function NumberBadge({
  number,
  variant = "limao",
}: NumberBadgeProps) {
  const styles =
    variant === "limao"
      ? "bg-limao text-verde-escuro"
      : "bg-verde-escuro text-limao";

  return (
    <span
      className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-[family-name:var(--font-barlow)] font-extrabold text-lg shrink-0 ${styles}`}
    >
      {number}
    </span>
  );
}
