import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CarboZé — Vacine seu combustível",
  description:
    "Pack com 10 sachês de 10ml. Elimina umidade, melhora a combustão e limpa o motor a cada abastecimento. R$ 5,99 por tanque.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "CarboZé — Vacine seu combustível",
    description:
      "Pack com 10 sachês de 10ml. Elimina umidade, melhora a combustão e limpa o motor a cada abastecimento.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${archivo.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
