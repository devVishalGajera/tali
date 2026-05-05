/**
 * Wishlist API
 *  GET  /product/wishlist-getNew         — fetch wishlist
 *  POST /product/Addwishlist             — add / toggle a wishlist item
 *  POST /product/add-cart-wishlist-all   — bulk move wishlist → cart
 *
 * All endpoints require a Bearer token.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://3.7.224.122/dev/talli/api";

/* ── Types ──────────────────────────────────────────────────── */

export interface WishlistApiItem {
  product_id:               number;
  name:                     string;
  volume:                   string;
  price:                    string;
  store_product_volume_id:  string | number;
  volume_id:                string | number;
  image_path:               string;
  image_full_path:          string;
  available_quantity:       number;
  is_available:             string;
  enablePurchase:           boolean;
  cart:                     number;
}

export interface WishlistApiResponse {
  code:            number;
  message:         string;
  page_no?:        number;
  total_records?:  number;
  record_per_page?: string | number;
  total_pages?:    number;
  data:            WishlistApiItem[];
}

export interface AddWishlistApiResponse {
  code:    number;
  message: string;
  data?: {
    id:                       number;
    user_id:                  number;
    product_id:               string | number;
    store_product_volume_id:  string | number;
    created_at:               string;
    updated_at:               string;
  };
}

/* ── Helpers ─────────────────────────────────────────────────── */

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept:        "application/json",
  };
}

/* ── Fetchers ────────────────────────────────────────────────── */

/** Fetch the current wishlist for the logged-in user. */
export async function getWishlistApi(params: {
  store_id?: number | string;
  token:     string;
}): Promise<WishlistApiResponse> {
  const qs = new URLSearchParams();
  if (params.store_id) qs.set("store_id", String(params.store_id));

  const res = await fetch(`${BASE_URL}/product/wishlist-getNew?${qs.toString()}`, {
    headers: authHeaders(params.token),
    cache:   "no-store",
  });

  if (!res.ok) throw new Error(`getWishlist ${res.status}`);
  return res.json() as Promise<WishlistApiResponse>;
}

/** Add a product to the wishlist (or remove if already present — toggle). */
export async function addToWishlistApi(params: {
  product_id:               number;
  store_product_volume_id:  number;
  token:                    string;
}): Promise<AddWishlistApiResponse> {
  const body = new URLSearchParams();
  body.append("product_id",              String(params.product_id));
  body.append("store_product_volume_id", String(params.store_product_volume_id));

  const res = await fetch(`${BASE_URL}/product/Addwishlist`, {
    method:  "POST",
    headers: {
      ...authHeaders(params.token),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body:  body.toString(),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`addToWishlist ${res.status}`);
  return res.json() as Promise<AddWishlistApiResponse>;
}

/** Move all wishlist items to cart in a single request. */
export async function addCartWishlistAllApi(params: {
  cart_items:     { store_product_volume_id: number; quantity: number }[];
  wishlist_items: unknown[];
  token:          string;
}): Promise<{ code: number; message: string }> {
  const form = new FormData();
  form.append("cart_items",     JSON.stringify(params.cart_items));
  form.append("wishlist_items", JSON.stringify(params.wishlist_items));

  const res = await fetch(`${BASE_URL}/product/add-cart-wishlist-all`, {
    method:  "POST",
    headers: authHeaders(params.token),
    body:    form,
    cache:   "no-store",
  });

  if (!res.ok) throw new Error(`addCartWishlistAll ${res.status}`);
  return res.json() as Promise<{ code: number; message: string }>;
}
