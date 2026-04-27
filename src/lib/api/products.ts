/**
 * Products API — POST /product/viewAllNew
 *
 * Uses multipart/form-data (not JSON) as required by the endpoint.
 * Safe to call from Server Components; results are cached per unique
 * param combination using the "products" tag.
 *
 * Usage:
 *   import { getProducts } from "@/lib/api/products";
 *   const result = await getProducts({ page_no: 1, category_id: 23 });
 */

import { TAGS } from "./cache-tags";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://3.7.224.122/dev/talli/api";

/* ── Types ──────────────────────────────────────────────────── */

export interface ProductListItem {
  id:                      number;
  name:                    string;
  brand_id:                number;
  image_path:              string;
  image_full_path:         string;
  price:                   string;
  volume:                  string;
  volume_id:               number | string;
  store_product_volume_id: number;
  available_quantity:      number | string;
  order_count:             number | string;
  average_rating:          number;
  best_dealer:             number | string;
  is_wishlist:             boolean;
}

export interface ProductsResponse {
  code:            number;
  message:         string;
  page_no:         number;
  total_records:   number;
  record_per_page: string;
  total_pages:     number;
  data:            ProductListItem[];
}

export interface GetProductsParams {
  page_no?:        number;
  category_id?:    number | string;
  sub_category_id?: number | string;
  brand_id?:       number | string;
  term?:           string;
  min_price?:      number | string;
  max_price?:      number | string;
  store_id?:       number | string;
  city?:           string;
  /** Bearer token — pass when user is logged in for personalised is_wishlist */
  token?:          string;
}

/* ── Fetcher ─────────────────────────────────────────────────── */

export async function getProducts(params: GetProductsParams = {}): Promise<ProductsResponse> {
  const { token, ...formParams } = params;

  const form = new FormData();
  form.append("page_no", String(formParams.page_no ?? 1));

  if (formParams.category_id)    form.append("category_id",    String(formParams.category_id));
  if (formParams.sub_category_id) form.append("sub_category_id", String(formParams.sub_category_id));
  if (formParams.brand_id)       form.append("brand_id",       String(formParams.brand_id));
  if (formParams.term)           form.append("term",           formParams.term);
  if (formParams.store_id)       form.append("store_id",       String(formParams.store_id));
  if (formParams.city)           form.append("city",           formParams.city);
  if (formParams.min_price !== undefined && formParams.min_price !== null)
    form.append("min_price", String(formParams.min_price));
  if (formParams.max_price !== undefined && formParams.max_price !== null)
    form.append("max_price", String(formParams.max_price));

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/product/viewAllNew`, {
    method:  "POST",
    headers,
    body:    form,
    next: {
      tags:       [TAGS.products],
      revalidate: 300, // 5 minutes
    },
  });

  if (!res.ok) {
    throw new Error(`Products API ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as ProductsResponse;

  if (json.code !== 1) {
    throw new Error(`Products API error: ${json.message}`);
  }

  return json;
}

/** Helper — map API product to the shape ProductCard / cart expects */
export function toProductCardItem(p: ProductListItem) {
  const priceValue = parseFloat(p.price) || 0;
  return {
    id:         p.id,
    name:       p.name,
    price:      `₹${priceValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
    priceValue,
    image:      p.image_full_path || "/assets/images/bottles/single-bottle.png",
    size:       p.volume || undefined,
    rating:     p.average_rating,
    ratingCount: typeof p.order_count === "number" ? p.order_count : parseInt(String(p.order_count)) || 0,
    isWishlist: p.is_wishlist,
  };
}
