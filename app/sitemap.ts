import type { MetadataRoute } from "next";

const SITE_URL = "https://www.carboze.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  // /cupom fica de fora de propósito: é noindex (campanha), não deve ser
  // anunciada no sitemap. A slug antiga /oferta só redireciona para ela.
  const routes = ["", "/loja", "/dionisio", "/jean", "/carpower"];
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
