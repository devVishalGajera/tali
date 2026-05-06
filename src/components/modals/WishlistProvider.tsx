"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { getWishlistApi } from "@/lib/api/wishlist";
import type { WishlistApiItem } from "@/lib/api/wishlist";
import { useLocation } from "@/components/modals/LocationProvider";

/* ── Types ──────────────────────────────────────────────────── */

export interface WishlistItem {
  productId: number;
  storeProductVolumeId: number | string;
  name: string;
  price: string;
  priceValue: number;
  image: string;
  volume: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  count: number;
  isDrawerOpen: boolean;
  isLoading: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  refreshWishlist: () => void;
}

/* ── Context ─────────────────────────────────────────────────── */

const WishlistContext = createContext<WishlistContextType | null>(null);

/* ── Helper ──────────────────────────────────────────────────── */

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("talli_auth_token");
}

function fromApiItem(item: WishlistApiItem): WishlistItem {
  const priceValue = parseFloat(item.price) || 0;
  return {
    productId: Number(item.product_id),
    storeProductVolumeId: item.store_product_volume_id,
    name: item.name,
    price: priceValue > 0
      ? `₹${priceValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
      : "",
    priceValue,
    image: item.image_full_path || "",
    volume: item.volume,
  };
}

/* ── Provider ────────────────────────────────────────────────── */

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { storeId, city, flag } = useLocation();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = useCallback((sid?: string | number | null, cityName?: string | null, currentFlag?: number | null) => {
    const token = getAuthToken();
    if (!token) return;
    if (currentFlag === 3 || currentFlag === null) return;

    const params = currentFlag === 2
      ? { token, city: cityName ?? undefined }
      : { token, store_id: sid ?? undefined };

    getWishlistApi(params)
      .then((res) => {
        if (res.code === 1 && Array.isArray(res.data)) {
          setItems(res.data.map(fromApiItem));
          setIsLoading(false);
        }
      })
      .catch(() => { setIsLoading(false); });
  }, []);

  useEffect(() => {
    if (flag === null || flag === 3) return;
    if (flag === 1 && !storeId) return;
    if (flag === 2 && !city) return;

    const token = getAuthToken();
    if (!token) return;

    const params = flag === 2
      ? { token, city: city ?? undefined }
      : { token, store_id: storeId ?? undefined };

    getWishlistApi(params)
      .then((res) => {
        if (res.code === 1 && Array.isArray(res.data)) {
          setItems(res.data.map(fromApiItem));
        }
      })
      .catch(() => {});
  }, [storeId, city, flag]);

  const addItem = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.productId === item.productId);
      if (exists) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const isWishlisted = useCallback(
    (productId: number) => items.some((i) => i.productId === productId),
    [items],
  );

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const refreshWishlist = useCallback(() => fetchWishlist(storeId, city, flag), [fetchWishlist, storeId, city, flag]);
  return (
    <WishlistContext.Provider
      value={{
        items,
        count: items.length,
        isDrawerOpen,
        isLoading,
        openDrawer,
        closeDrawer,
        addItem,
        removeItem,
        isWishlisted,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be inside WishlistProvider");
  return ctx;
};
