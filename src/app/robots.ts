import type { MetadataRoute } from "next";
import { restaurant } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/admin"],
    },
    sitemap: `${restaurant.url}/sitemap.xml`,
  };
}
