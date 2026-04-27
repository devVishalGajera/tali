const API_HOST = "3.7.224.122";

/**
 * Returns the URL to use when rendering an API image via next/image.
 *
 * On the live site (Vercel), the API server is HTTP-only and can't always be
 * reached directly by Vercel's image optimiser.  Routing the request through
 * our own /api/img proxy solves both mixed-content and reachability issues.
 *
 * Local images (starting with "/") are returned unchanged.
 */
export function proxyImageUrl(src: string | null | undefined): string {
  if (!src) return "/assets/images/bottles/single-bottle.png";
  if (src.startsWith("/")) return src;

  try {
    const url = new URL(src);
    if (url.hostname === API_HOST) {
      return `/api/img?url=${encodeURIComponent(src)}`;
    }
  } catch {
    // not a valid absolute URL — return as-is
  }

  return src;
}
