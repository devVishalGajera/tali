import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Next.js 16 requires explicit localPatterns for any non-static local
     * path used as a next/image src.
     *
     * /api/img   — our image proxy for API images (http://3.7.224.122/...)
     * /assets/** — static assets bundled in /public
     */
    localPatterns: [
      { pathname: "/api/img", search: "**" },
      { pathname: "/assets/**" },
    ],
    remotePatterns: [],
  },
};

export default nextConfig;
