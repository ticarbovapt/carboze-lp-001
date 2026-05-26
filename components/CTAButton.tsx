import { CHECKOUT_URL } from "@/lib/constants";

interface CTAButtonProps {
  label?: string;
  href?: string;
  className?: string;
  size?: "default" | "large";
}

export default function CTAButton({
  label = "QUERO MEU PACK",
  href = CHECKOUT_URL,
  className = "",
  size = "default",
}: CTAButtonProps) {
  const base =
    "inline-block font-[family-name:var(--font-basement)] font-bold uppercase tracking-wide rounded-full bg-limao text-verde-escuro transition-all hover:bg-verde-medio active:scale-95 focus:outline-none focus:ring-2 focus:ring-limao focus:ring-offset-2";
  const sizes =
    size === "large"
      ? "px-10 py-5 text-xl"
      : "px-8 py-4 text-base md:text-lg";

  return (
    <a href={href} className={`${base} ${sizes} ${className}`}>
      {label}
    </a>
  );
}
