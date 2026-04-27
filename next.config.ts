import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "3.7.224.122",
        pathname: "/dev/talli/uploads/**",
      },
    ],
  },
};

export default nextConfig;
