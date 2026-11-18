import type { NextConfig } from "next";
import { restaurant } from "./src/content/site";

const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "gdzx3zp3";
const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: `/images/${sanityProjectId}/${sanityDataset}/**`,
      },
    ],
  },
  serverExternalPackages: ["sanity", "next-sanity"],
  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    return [
      { source: "/:path*", headers: security },
      { source: "/studio/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
  async redirects() {
    return [
      { source: "/admin", destination: "/studio", permanent: false },
      { source: "/admin/:path*", destination: "/studio/:path*", permanent: false },
      // Short links for menus, Instagram bio, and print. Temporary so the Toast URL can change.
      { source: "/reservations", destination: restaurant.reserve, permanent: false },
      { source: "/reserve", destination: restaurant.reserve, permanent: false },
      { source: "/drinks", destination: "/menu#drinks", permanent: true },
      { source: "/drinks/:path*", destination: "/menu#drinks", permanent: true },
    ];
  },
};

export default nextConfig;
