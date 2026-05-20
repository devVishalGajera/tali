"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { addToCartApi, removeFromCartApi, getCartApi } from "@/lib/api/cart";
import type { CartApiItem } from "@/lib/api/cart";
import { useLocation } from "@/components/modals/LocationProvider";

/* ── Types ──────────────────────────────────────────────────── */

export interface CartProduct {
  id:                       number;   // product id
  cartItemId?:              number;   // API cart-row id (used for delete)
  store_product_volume_id?: number;   // used for add-to-cart API call
  name:                     string;
  price:                    string;
  priceValue:               number;
  image:                    string;
  size?:                    string;
  quantity:                 number;
  requestType?:             string;
}

interface CartItem extends CartProduct {}

interface CartContextType {
  items:          CartItem[];
  lastAdded:      CartProduct | null;
  isModalOpen:    boolean;
  isDrawerOpen:   boolean;
  isLoading:      boolean;
  addToCart:      (product: CartProduct) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  closeModal:     () => void;
  openDrawer:     () => void;
  closeDrawer:    () => void;
  refreshCart:    () => void;
  clearCart:      () => void;
}

/* ── Context ─────────────────────────────────────────────────── */

const CartContext = createContext<CartContextType | null>(null);

/* ── Token helper ────────────────────────────────────────────── */

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("talli_auth_token");
}

/* ── Map API cart item → CartItem ────────────────────────────── */

function fromApiItem(item: CartApiItem): CartItem {
  const priceValue = parseFloat(item.price) || 0;
  return {
    id:                      item.product_id,
    cartItemId:              item.id,
    store_product_volume_id: item.store_product_volume_id,
    name:                    item.product_name,
    price:                   `₹${priceValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
    priceValue,
    image:                   item.image_full_path || "/assets/images/bottles/single-bottle.png",
    size:                    item.volume || undefined,
    quantity:                item.quantity,
  };
}

/* ── Provider ────────────────────────────────────────────────── */

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { storeId, city, flag } = useLocation();
  const [items,        setItems]        = useState<CartItem[]>([]);
  const [lastAdded,    setLastAdded]    = useState<CartProduct | null>(null);
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);

  /* Fetch cart once we have a valid location */
  useEffect(() => {
    if (flag === null || flag === 3) {
      setItems([]);
      return;
    }
    if (flag === 1 && !storeId) return;
    if (flag === 2 && !city) return;
    const token = getAuthToken();
    if (!token) {
      setItems([]);
      return;
    }

    const params = flag === 2
      ? { token, city: city ?? undefined }
      : { token, store_id: String(storeId), city: city ?? undefined };

    setIsLoading(true);
    getCartApi(params)
      .then((res) => {
        if (res.code === 1 && Array.isArray(res.data)) setItems(res.data.map(fromApiItem));
      })
      .catch(() => { /* silent */ })
      .finally(() => setIsLoading(false));
  }, [storeId, city, flag]);

  const addToCart = useCallback((product: CartProduct) => {
    const addQty = product.quantity || 1;
    let apiQuantity = addQty;

    /* Optimistically update local state first for instant UI feedback */
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.id === product.id ||
          (product.store_product_volume_id &&
            i.store_product_volume_id === product.store_product_volume_id),
      );
      apiQuantity = existing ? existing.quantity + addQty : addQty;
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ||
          (product.store_product_volume_id &&
            i.store_product_volume_id === product.store_product_volume_id)
            ? { ...i, ...product, quantity: apiQuantity }
            : i,
        );
      }
      return [...prev, { ...product, quantity: addQty }];
    });
    setLastAdded({ ...product, quantity: addQty });
    setIsModalOpen(true);

    /* Sync with API if logged in */
    const token = getAuthToken();
    if (!token || !product.store_product_volume_id) return;

    addToCartApi({
      store_product_volume_id: product.store_product_volume_id,
      quantity:                apiQuantity,
      store_id:                storeId ?? undefined,
      request_type:            product.requestType ?? "add_to_cart",
      token,
    })
      .then((res) => {
        if (res.code !== 1) return;
        const cartParams = flag === 2
          ? { token, city: city ?? undefined }
          : { token, store_id: storeId ?? undefined, city: city ?? undefined };
        return getCartApi(cartParams);
      })
      .then((cart) => {
        if (cart?.code === 1 && Array.isArray(cart.data)) {
          setItems(cart.data.map(fromApiItem));
        }
      })
      .catch(() => { /* keep optimistic state on error */ });
  }, [storeId, city, flag]);

  const refreshCart = useCallback(() => {
    const token = getAuthToken();
    if (!token || flag === null || flag === 3) return;
    if (flag === 1 && !storeId) return;
    if (flag === 2 && !city) return;

    const params = flag === 2
      ? { token, city: city ?? undefined }
      : { token, store_id: storeId ?? undefined, city: city ?? undefined };

    getCartApi(params)
      .then((res) => {
        if (res.code === 1 && Array.isArray(res.data)) setItems(res.data.map(fromApiItem));
      })
      .catch(() => {});
  }, [storeId, city, flag]);

  const removeFromCart = useCallback((productId: number) => {
    /* Optimistically remove */
    const target = items.find((i) => i.id === productId);
    setItems((prev) => prev.filter((i) => i.id !== productId));

    /* Sync with API if logged in and we have the cart-row id */
    const token = getAuthToken();
    if (!token || !target?.cartItemId) return;

    removeFromCartApi({ cartItemId: target.cartItemId, token }).catch(() => {
      /* Rollback on error */
      setItems((prev) => [...prev, target]);
    });
  }, [items]);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity < 1) return;

    const target = items.find((i) => i.id === productId);
    setItems((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, quantity } : i)),
    );

    const token = getAuthToken();
    if (!token || !target?.store_product_volume_id) return;

    const cartParams = flag === 2
      ? { token, city: city ?? undefined }
      : { token, store_id: storeId ?? undefined, city: city ?? undefined };

    addToCartApi({
      store_product_volume_id: target.store_product_volume_id,
      quantity,
      store_id: storeId ?? undefined,
      request_type: "add_to_cart",
      token,
    })
      .then((res) => {
        if (res.code !== 1) return;
        return getCartApi(cartParams);
      })
      .then((cart) => {
        if (cart?.code === 1 && Array.isArray(cart.data)) {
          setItems(cart.data.map(fromApiItem));
        }
      })
      .catch(() => { /* keep optimistic state on error */ });
  }, [items, storeId, city, flag]);

  const clearCart = useCallback(() => {
    setItems([]);
    setLastAdded(null);
  }, []);

  const closeModal  = useCallback(() => setIsModalOpen(false),  []);
  const openDrawer  = useCallback(() => setIsDrawerOpen(true),  []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        items,
        lastAdded,
        isModalOpen,
        isDrawerOpen,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        closeModal,
        openDrawer,
        closeDrawer,
        refreshCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};
