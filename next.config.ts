import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    qualities: [25, 50, 75, 100],
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
};

export default nextConfig;
