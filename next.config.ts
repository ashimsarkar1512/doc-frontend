import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        // hostname: "i.pinimg.com",
        hostname: "**",
      },
      {
        protocol: "https",
        // hostname: "pre-storage.weightlossmdcherrycreek.com",
        hostname: "**",
      },
    ],
  },
  experimental: {
    buildStartTimeout: 600000,
  },
};

export default nextConfig;
