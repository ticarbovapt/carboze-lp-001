import type { MetadataRoute } from "next";

const SITE_URL = "https://www.carboze.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/oferta", "/loja", "/dionisio", "/jean", "/carpower"];
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
