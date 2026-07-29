/** Ícones SVG reutilizáveis — substituem emojis para render consistente e premium. */

export function TruckIcon({ className = "w-4 h-4" }: { className?: string }) {
  // Mesmo desenho do FreteBadge (Lucide-style) para consistência visual no site.
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

export function FireIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 1.6c.4 3-1.1 4.6-2.6 6.1C9.3 9.3 7.8 10.9 7.8 13.4a5.2 5.2 0 0010.4.3c0-2-.9-3.6-1.9-4.9-.4.9-1 1.5-1.9 1.8.8-2.6.2-5.6-.9-9zm-1.7 12.1c.8-.8 1-1.9.9-2.8.9.6 1.5 1.6 1.5 2.9a2.35 2.35 0 01-4.7.1c0-.9.4-1.6 1-2.2.1.8.5 1.5 1.3 2z" />
    </svg>
  );
}
