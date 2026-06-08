import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compress: true,
  async redirects() {
    return [
      // Aliases com acento e variantes curtas → páginas reais
      { source: "/sachê", destination: "/sache",   permanent: true },
      { source: "/moto",       destination: "/sache",   permanent: true },
      { source: "/carro",      destination: "/pack100", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:all*(png|jpg|jpeg|webp|avif|svg|gif|mp4|ico)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
