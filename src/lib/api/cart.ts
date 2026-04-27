/**
 * Cart API helpers — always fetched fresh (no caching).
 * Cart is user-specific so caching would leak data between users.
 *
 * These are called from Client Components / Server Actions only,
 * not from plain Server Components (cart state is personalised).
 */

import { apiFetch } from "./client";

export interface CartItemPayload {
  productId: number;
  quantity: number;
  size?: string;
}

export interface CartResponse {
  id: string;
  items: {
    productId: number;
    name: string;
    price: string;
    priceValue: number;
    image: string;
    size?: string;
    quantity: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
}

/** Fetch the current user's cart (no cache) */
export async function getCart(sessionToken: string): Promise<CartResponse> {
  return apiFetch<CartResponse>("/cart", {
    revalidate: 0, // no-store
    headers: { Authorization: `Bearer ${sessionToken}` },
  });
}

/** Add or update an item in the cart */
export async function addCartItem(
  sessionToken: string,
  payload: CartItemPayload
): Promise<CartResponse> {
  return apiFetch<CartResponse>("/cart/items", {
    method:     "POST",
    revalidate: 0,
    headers:    { Authorization: `Bearer ${sessionToken}` },
    body:       JSON.stringify(payload),
  });
}

/** Remove an item from the cart */
export async function removeCartItem(
  sessionToken: string,
  productId: number
): Promise<CartResponse> {
  return apiFetch<CartResponse>(`/cart/items/${productId}`, {
    method:     "DELETE",
    revalidate: 0,
    headers:    { Authorization: `Bearer ${sessionToken}` },
  });
}
