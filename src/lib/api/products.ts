/**
 * Products API — POST /product/viewAllNew
 *
 * The endpoint expects multipart/form-data.
 * We deliberately skip Next.js fetch-level caching here because:
 *  - POST requests with FormData can't be reliably keyed by Next.js cache
 *  - The Server Component re-renders on every URL change, giving us the
 *    correct freshness model automatically
 *  - Per-user data (is_wishlist) must never be shared across users
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://3.7.224.122/dev/talli/api";

/* ── Types ──────────────────────────────────────────────────── */

export interface ProductListItem {
  id: number;
  name: string;
  brand_id: number;
  image_path: string;
  image_full_path: string;
  price: string;
  volume: string;
  volume_id: number | string;
  store_product_volume_id: number;
  available_quantity: number | string;
  order_count: number | string;
  average_rating: number;
  best_dealer: number | string;
  is_wishlist: boolean;
}

export interface ProductsResponse {
  code: number;
  message: string;
  page_no: number;
  total_records: number;
  record_per_page: string;
  total_pages: number;
  data: ProductListItem[];
}

export interface GetProductsParams {
  page_no?: number;
  category_id?: number | string;
  sub_category_id?: number | string;
  brand_id?: number | string;
  term?: string;
  min_price?: number | string;
  max_price?: number | string;
  store_id?: number | string;
  city?: string;
  /** Pass when user is logged in — personalises is_wishlist */
  token?: string;
}

/* ── Fetcher ─────────────────────────────────────────────────── */

export async function getProducts(params: GetProductsParams = {}): Promise<ProductsResponse> {
  const { token, ...p } = params;

  const form = new FormData();
  form.append("page_no", String(p.page_no ?? 1));

  if (p.category_id) form.append("category_id", String(p.category_id));
  if (p.sub_category_id) form.append("sub_category_id", String(p.sub_category_id));
  if (p.brand_id) form.append("brand_id", String(p.brand_id));
  if (p.term) form.append("term", p.term);
  if (p.store_id) form.append("store_id", String(p.store_id));
  if (p.city) form.append("city", p.city);
  if (p.min_price !== undefined) form.append("min_price", String(p.min_price));
  if (p.max_price !== undefined) form.append("max_price", String(p.max_price));

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/product/viewAllNew`, {
    method: "POST",
    headers,
    body: form,
    cache: "no-store",
  });
  console.log("res", res);

  if (!res.ok) {
    throw new Error(`Products API ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as ProductsResponse;

  if (json.code !== 1) {
    throw new Error(`Products API error: ${json.message}`);
  }

  return json;
}

/* ── Helper — map API product to card / cart shape ───────────── */

export function toProductCardItem(p: ProductListItem) {
  const priceValue = parseFloat(p.price) || 0;
  return {
    id: p.id,
    name: p.name,
    price: `₹${priceValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
    priceValue,
    image: p.image_full_path || "/assets/images/bottles/single-bottle.png",
    size: p.volume || undefined,
    rating: p.average_rating,
    ratingCount: typeof p.order_count === "number"
      ? p.order_count
      : parseInt(String(p.order_count)) || 0,
    isWishlist: p.is_wishlist,
  };
}
