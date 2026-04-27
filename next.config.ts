import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * All API images from 3.7.224.122 are routed through /api/img proxy,
     * so no remote pattern for that host is needed here.
     * Add patterns below only for any additional external image CDNs.
     */
    remotePatterns: [],
  },
};

export default nextConfig;
