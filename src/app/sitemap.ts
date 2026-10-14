import type { MetadataRoute } from "next";
import { restaurant } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/menu", "/visit", "/story"];
  return routes.map((route) => ({
    url: `${restaurant.url}${route}`,
    lastModified: new Date("2026-09-25"),
  }));
}
