import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [
      // Aliases com acento e variantes curtas → páginas reais
      { source: "/sachê", destination: "/sache",   permanent: true },
      { source: "/moto",       destination: "/sache",   permanent: true },
      { source: "/carro",      destination: "/pack100", permanent: true },
    ];
  },
};

export default nextConfig;
