import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["png.pngtree.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "png.pngtree.com",
      },
      {
        protocol: "https",
        hostname: "png.pngtree.com",
      },
    ],
  },
};

export default nextConfig;
