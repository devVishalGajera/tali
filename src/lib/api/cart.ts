/**
 * Cart API
 *  POST /product/add-update-cartNew   — add / update a cart item
 *  POST /product/delete-cart          — remove a cart item
 *  GET  /product/cart-getNew          — fetch current cart
 *
 * All endpoints require a Bearer token (logged-in users only).
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://3.7.224.122/dev/talli/api";

/* ── Types ──────────────────────────────────────────────────── */

export interface CartApiItem {
  id:                       number;   // cart-row id (used for delete)
  product_id:               number;
  product_name:             string;
  store_product_volume_id:  number;
  volume:                   string;
  price:                    string;
  quantity:                 number;
  image_full_path:          string;
  short_description?:       string;
}

export interface CartApiResponse {
  code:    number;
  message: string;
  data:    CartApiItem[];
}

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
  request_type?:           string;
  token:                   string;
}): Promise<{ code: number; message: string }> {
  const form = new FormData();
  form.append("store_product_volume_id", String(params.store_product_volume_id));
  form.append("quantity",                String(params.quantity));
  form.append("request_type",            params.request_type ?? "people_also_added");

  const res = await fetch(`${BASE_URL}/product/add-update-cartNew`, {
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

  const res = await fetch(`${BASE_URL}/product/delete-cart`, {
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

  const res = await fetch(`${BASE_URL}/product/cart-getNew?${qs.toString()}`, {
    headers: authHeaders(params.token),
    cache:   "no-store",
  });

  if (!res.ok) throw new Error(`getCart ${res.status}`);
  return res.json() as Promise<CartApiResponse>;
}
