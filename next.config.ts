import type { NextConfig } from "next";

const API_HOST = "3.7.224.122";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      /* ── API server images (http + https, all paths under /dev/talli/) ── */
      {
        protocol: "http",
        hostname: API_HOST,
        pathname: "/dev/talli/**",
      },
      {
        protocol: "https",
        hostname: API_HOST,
        pathname: "/dev/talli/**",
      },
    ],
  },
};

export default nextConfig;
