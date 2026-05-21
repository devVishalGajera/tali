/**
 * Cart API
 *  POST /product/add-update-cartNew   — add / update a cart item
 *  POST /product/delete-cart          — remove a cart item
 *  GET  /product/cart-getNew          — fetch current cart
 *
 * All endpoints require a Bearer token (logged-in users only).
 */

import { API_BASE_URL } from "./base-url";

/* ── Types ──────────────────────────────────────────────────── */

export interface CartApiItem {
  id:                       number;   // cart-row id (used for delete)
  product_id:               number;
  name?:                    string;
  product_name?:            string;
  store_product_volume_id:  number | string;
  volume:                   string;
  price:                    string;
  quantity:                 number;
  image_full_path:          string;
  image_path?:              string;
  short_description?:       string;
}

/** Product title from cart-getNew (API uses `name`, not `product_name`). */
export function getCartItemName(item: CartApiItem): string {
  const n = (item.name ?? item.product_name ?? "").trim();
  return n || item.short_description?.trim() || "";
}

export interface CartApiAddress {
  id?: number;
  address?: string;
  house_no?: string;
  landmark?: string;
  save_as?: string;
  longitude?: string;
  latitude?: string;
  city?: string;
}

export interface CartApiResponse {
  code:             number;
  message:          string;
  data:             CartApiItem[];
  address?:         CartApiAddress;
  order_total?:     string;
  shipping_charge?: string;
  total?:           string;
  store_name?:      string;
  store_address?:   string;
  close?:           string;
}

export interface CartSummary {
  orderTotal:     number;
  shippingCharge: number;
  total:          number;
  storeName?:     string;
  storeAddress?:  string;
}

export const PERMIT_FEE_WITHOUT_NUMBER = 5;

export function parseMoney(value: string | number | undefined | null): number {
  if (value == null || value === "") return 0;
  const n = typeof value === "number" ? value : parseFloat(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Permit fee: ₹0 if number provided, else ₹5. */
export function getPermitFee(permitNumber: string): number {
  return permitNumber.trim() ? 0 : PERMIT_FEE_WITHOUT_NUMBER;
}

export function buildCartSummaryFromResponse(
  res: CartApiResponse,
  items: { priceValue: number; quantity: number }[],
): CartSummary {
  const computedSubtotal = items.reduce((s, i) => s + i.priceValue * i.quantity, 0);
  const orderTotal = parseMoney(res.order_total) || computedSubtotal;
  // Flat per-order fee from API — never multiplied by item quantity
  const shippingCharge = parseMoney(res.shipping_charge);
  const apiTotal = parseMoney(res.total);
  const total = apiTotal > 0 ? apiTotal : orderTotal + shippingCharge;

  return {
    orderTotal,
    shippingCharge,
    total,
    storeName: res.store_name,
    storeAddress: res.store_address,
  };
}

export function getGrandTotal(summary: CartSummary, permitFee = 0): number {
  return summary.total + permitFee;
}

export const emptyCartSummary = (): CartSummary => ({
  orderTotal: 0,
  shippingCharge: 0,
  total: 0,
});

/* ── Helpers ─────────────────────────────────────────────────── */

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept:        "application/json",
  };
}

/* ── Fetchers ────────────────────────────────────────────────── */

/** Add or update a line item in the user's cart. */
export async function addToCartApi(params: {
  store_product_volume_id: number;
  quantity:                number;
  store_id?:               number | string;
  request_type?:           string;
  token:                   string;
}): Promise<{ code: number; message: string }> {
  const form = new FormData();
  form.append("store_product_volume_id", String(params.store_product_volume_id));
  form.append("quantity",                String(params.quantity));
  if (params.store_id != null && params.store_id !== "") {
    form.append("store_id", String(params.store_id));
  }
  form.append("request_type",            params.request_type ?? "add_to_cart");

  const res = await fetch(`${API_BASE_URL}/product/add-update-cartNew`, {
    method:  "POST",
    headers: authHeaders(params.token),
    body:    form,
    cache:   "no-store",
  });

  if (!res.ok) throw new Error(`addToCart ${res.status}`);
  return res.json() as Promise<{ code: number; message: string }>;
}

/** Remove a line item from the user's cart by its cart-row id. */
export async function removeFromCartApi(params: {
  cartItemId: number;
  token:      string;
}): Promise<{ code: number; message: string }> {
  const form = new FormData();
  form.append("id", String(params.cartItemId));

  const res = await fetch(`${API_BASE_URL}/product/delete-cart`, {
    method:  "POST",
    headers: authHeaders(params.token),
    body:    form,
    cache:   "no-store",
  });

  if (!res.ok) throw new Error(`removeFromCart ${res.status}`);
  return res.json() as Promise<{ code: number; message: string }>;
}

/** Fetch the current cart for the logged-in user. */
export async function getCartApi(params: {
  store_id?: number | string;
  city?:     string;
  token:     string;
}): Promise<CartApiResponse> {
  const qs = new URLSearchParams();
  if (params.store_id) qs.set("store_id", String(params.store_id));
  if (params.city)     qs.set("city",     params.city);

  const res = await fetch(`${API_BASE_URL}/product/cart-getNew?${qs.toString()}`, {
    headers: authHeaders(params.token),
    cache:   "no-store",
  });

  if (!res.ok) throw new Error(`getCart ${res.status}`);
  return res.json() as Promise<CartApiResponse>;
}
