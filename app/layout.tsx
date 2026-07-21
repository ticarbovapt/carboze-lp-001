import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import Script from "next/script";
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
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NDN2MQLN"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
        {/* Google Tag Manager — carregado após interativo p/ não bloquear render */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NDN2MQLN');`}
        </Script>
      </body>
    </html>
  );
}
