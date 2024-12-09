import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storagemedia.corporategear.com",
      },
      {
        protocol: "https",
        hostname: "corporategear.com",
      },
    ],
  },
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
