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
      // As LPs /sache e /pack100 foram descontinuadas: a home passou a vender
      // os dois produtos no seletor #escolha-produto. Redirecionamos as URLs
      // antigas (e os aliases que apontavam pra elas) para lá, em vez de 404 —
      // preserva link externo, tráfego de anúncio e o SEO acumulado.
      { source: "/sache",     destination: "/#escolha-produto", permanent: true },
      { source: "/sachê",     destination: "/#escolha-produto", permanent: true },
      { source: "/pack100",   destination: "/#escolha-produto", permanent: true },
      { source: "/moto",      destination: "/#escolha-produto", permanent: true },
      { source: "/carro",     destination: "/#escolha-produto", permanent: true },
      { source: "/choice",    destination: "/#escolha-produto", permanent: true },
      { source: "/countdown", destination: "/",                 permanent: true },
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
