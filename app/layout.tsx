import type { Metadata } from "next";
import { Barlow, Archivo } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CarboZé Moto — Combustível protegido, motor saudável",
  description:
    "Pack com 10 sachês de 10ml. Elimina umidade, melhora a combustão e limpa o motor a cada abastecimento. R$ 5,99 por tanque.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "CarboZé Moto — Combustível protegido, motor saudável",
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
    <html lang="pt-BR" className={`${barlow.variable} ${archivo.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
