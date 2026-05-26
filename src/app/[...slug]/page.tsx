import { notFound } from "next/navigation";

/**
 * Top-level catch-all that converts unmatched URLs into a matched route
 * which then calls notFound(). This works around a Next.js bug where
 * router.refresh() called from inside the global not-found tree
 * (unmatched URLs) loops infinitely re-fetching the RSC for a route
 * that does not exist.
 *
 * See: https://github.com/vercel/next.js/issues/86197
 */
export default function CatchAllNotFound() {
  notFound();
}
