import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "pre-storage.weightlossmdcherrycreek.com",
      },
    ],
  },
};

export default nextConfig;
