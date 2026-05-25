import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [
      // Aliases curtos → páginas de checkout reais
      { source: "/sache",   destination: "/checkoutsache",   permanent: true },
      { source: "/sachê",   destination: "/checkoutsache",   permanent: true },
      { source: "/moto",    destination: "/checkoutsache",   permanent: true },
      { source: "/pack100", destination: "/checkoutpack100", permanent: true },
      { source: "/carro",   destination: "/checkoutpack100", permanent: true },
    ];
  },
};

export default nextConfig;
