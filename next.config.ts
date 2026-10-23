import type { NextConfig } from "next";

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
  async redirects() {
    return [
      { source: "/admin", destination: "/studio", permanent: false },
      { source: "/admin/:path*", destination: "/studio/:path*", permanent: false },
      { source: "/drinks", destination: "/menu#drinks", permanent: true },
      { source: "/drinks/:path*", destination: "/menu#drinks", permanent: true },
    ];
  },
};

export default nextConfig;
