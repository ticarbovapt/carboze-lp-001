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
      // ─────────────────────────────────────────────────────────────
      // Rotas descontinuadas. Intenção de produto → seletor da home.
      // ─────────────────────────────────────────────────────────────
      { source: "/sache",   destination: "/#escolha-produto", statusCode: 301 },
      { source: "/pack100", destination: "/#escolha-produto", statusCode: 301 },
      { source: "/choice",  destination: "/#escolha-produto", statusCode: 301 },

      // Aliases antigos — apontavam para /sache e /pack100, que saíram
      // O navegador envia o acento percent-encoded; o Next casa o path cru,
      // então as duas formas precisam estar declaradas.
      { source: "/sachê",      destination: "/#escolha-produto", statusCode: 301 },
      { source: "/sach%C3%AA", destination: "/#escolha-produto", statusCode: 301 },
      { source: "/moto",  destination: "/#escolha-produto", statusCode: 301 },
      { source: "/carro", destination: "/#escolha-produto", statusCode: 301 },

      // Sem intenção de produto → home
      { source: "/countdown",  destination: "/", statusCode: 301 },
      { source: "/nenel",      destination: "/", statusCode: 301 },
      { source: "/tarjapreta", destination: "/", statusCode: 301 },

      // Intenção de compra → checkout genérico (não a home).
      // Quem clicou nesses links queria comprar; mandar para a home
      // adiciona um passo a mais e derruba conversão.
      { source: "/checkoutsache-nenel",         destination: "/checkoutsache",   statusCode: 301 },
      { source: "/checkoutsache-tarjapreta",    destination: "/checkoutsache",   statusCode: 301 },
      { source: "/checkoutsache-influencer",    destination: "/checkoutsache",   statusCode: 301 },
      { source: "/checkoutpack100-nenel",       destination: "/checkoutpack100", statusCode: 301 },
      { source: "/checkoutpack100-tarjapreta",  destination: "/checkoutpack100", statusCode: 301 },
      { source: "/checkoutpack100-influencer",  destination: "/checkoutpack100", statusCode: 301 },
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
