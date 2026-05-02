import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * All API images from 3.7.224.122 are served via the /api/img proxy
     * using plain <img> tags, so no remote or local patterns are needed.
     */
    remotePatterns: [],
  },
};

export default nextConfig;
