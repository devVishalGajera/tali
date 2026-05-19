"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useLocation } from "@/components/modals/LocationProvider";
import { useCart } from "@/components/modals/CartProvider";
import { useWishlist } from "@/components/modals/WishlistProvider";

/**
 * When delivery location changes, re-run server components (prices depend on store/city)
 * and refresh client cart + wishlist.
 */
export default function LocationChangeRefresher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { storeId, city, flag } = useLocation();
  const { refreshCart } = useCart();
  const { refreshWishlist } = useWishlist();
  const prevKey = useRef<string | null>(null);

  useEffect(() => {
    const key = `${flag ?? ""}:${storeId ?? ""}:${city ?? ""}`;

    if (prevKey.current === null) {
      prevKey.current = key;
      return;
    }

    if (prevKey.current === key) return;
    prevKey.current = key;

    refreshCart();
    refreshWishlist();

    if (pathname.startsWith("/products") && searchParams.has("page")) {
      const next = new URLSearchParams(searchParams.toString());
      next.delete("page");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
      return;
    }

    router.refresh();
  }, [storeId, city, flag, pathname, searchParams, router, refreshCart, refreshWishlist]);

  return null;
}
