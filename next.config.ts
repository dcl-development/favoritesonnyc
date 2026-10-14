import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
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
