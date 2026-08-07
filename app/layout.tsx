import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import FunnelTracker from "@/components/lovable/FunnelTracker";
import MetaPixel from "@/components/lovable/MetaPixel";
import Utmify from "@/components/lovable/Utmify";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_URL = "https://www.carboze.com.br";
const DESCRIPTION =
  "Kit com 10 sachês de 10ml por R$ 59,90. Elimina umidade, melhora a combustão e limpa o motor a cada abastecimento.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CarboZé — Vacine seu combustível",
    template: "%s | CarboZé",
  },
  description: DESCRIPTION,
  applicationName: "CarboZé",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "CarboZé — Vacine seu combustível",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "CarboZé",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "CarboZé" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CarboZé — Vacine seu combustível",
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#093a30",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CarboZé",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-header.png`,
  sameAs: [
    "https://instagram.com/ocarboze",
    "https://youtube.com/@carboze",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${archivo.variable}`}>
      <head>
        {/* Preload das fontes usadas acima da dobra */}
        <link
          rel="preload"
          href="/fonts/BasementGrotesque-Black.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/BasementGrotesque-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
        {/* Anota sachê vs pack no clique de compra e dispara InitiateCheckout */}
        <FunnelTracker />
        {/* Meta Pixel — direto no código. O GTM saiu: ele só carregava este
            Pixel (sem GA4, sem outras tags), então era ~100KB de intermediário. */}
        <MetaPixel />
        {/* UTMify — atribuição de campanha ao longo do funil */}
        <Utmify />
      </body>
    </html>
  );
}
