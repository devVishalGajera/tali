"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useLocation } from "@/components/modals/LocationProvider";
import { useCart } from "@/components/modals/CartProvider";
import { useWishlist } from "@/components/modals/WishlistProvider";

/** Routes where prices/catalog do not depend on delivery location — skip full RSC refresh. */
function pathNeedsLocationRefresh(pathname: string): boolean {
  const skipPrefixes = [
    "/stores",
    "/about",
    "/support",
    "/terms",
    "/privacy",
    "/faq",
    "/track-order",
    "/login",
    "/signup",
    "/forgot-password",
  ];
  if (skipPrefixes.some((p) => pathname.startsWith(p))) return false;
  return true;
}

/**
 * When delivery location changes, re-run server components (prices depend on store/city)
 * and refresh client cart + wishlist.
 */
export default function LocationChangeRefresher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const { storeId, city, flag } = useLocation();
  const { refreshCart } = useCart();
  const { refreshWishlist } = useWishlist();
  const prevKey = useRef<string | null>(null);
  const refreshCartRef = useRef(refreshCart);
  const refreshWishlistRef = useRef(refreshWishlist);

  refreshCartRef.current = refreshCart;
  refreshWishlistRef.current = refreshWishlist;

  useEffect(() => {
    const key = `${flag ?? ""}:${storeId ?? ""}:${city ?? ""}`;

    if (prevKey.current === null) {
      prevKey.current = key;
      return;
    }

    if (prevKey.current === key) return;
    prevKey.current = key;

    refreshCartRef.current();
    refreshWishlistRef.current();

    if (!pathNeedsLocationRefresh(pathname)) return;

    if (pathname.startsWith("/products") && searchParams.has("page")) {
      const next = new URLSearchParams(search);
      next.delete("page");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
      return;
    }

    router.refresh();
  }, [storeId, city, flag, pathname, search, router, searchParams]);

  return null;
}
