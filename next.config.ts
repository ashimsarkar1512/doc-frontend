import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
