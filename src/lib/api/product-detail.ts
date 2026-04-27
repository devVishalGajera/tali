/**
 * Product Detail API — POST /guest/ProductDescriptionNew
 * Content-Type: application/x-www-form-urlencoded
 *
 * Cached per product ID at the Next.js fetch level (GET-equivalent semantics
 * since the ID is stable and the body is deterministic).
 */

import { TAGS } from "./cache-tags";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://3.7.224.122/dev/talli/api";

/* ── Types ──────────────────────────────────────────────────── */

export interface ProductVolume {
  volume_id:               number;
  volume:                  string;
  price:                   string | null;
  quantity:                string | null;
  store_product_volume_id: number | null;
  store_id:                number | null;
}

export interface FoodPairingProduct {
  id:            number;
  product_name:  string;
  product_image: string;
}

export interface FoodPairingData {
  foodpairing_description: string;
  foodpairing_image:       string;
  foodpairing_product:     FoodPairingProduct[];
}

export interface TasteCharacteristic {
  id:          number;
  left:        string;
  left_value:  number;
  right:       string;
  right_value: number;
}

export interface ReviewSummary {
  average_rating:   number;
  total_reviews:    number;
  rating_breakdown: Record<"1" | "2" | "3" | "4" | "5", number>;
}

export interface CustomerReview {
  user_name:  string;
  avatar?:    string;
  rating:     number;
  comment:    string;
  created_at: string;
}

export interface CustomerReviewData {
  summary: ReviewSummary;
  reviews: CustomerReview[];
}

export interface ProductDetailRecord {
  id:                       number;
  name:                     string;
  description:              string;
  short_description:        string;
  sub_category_id:          number;
  category_id:              number;
  alcohol_percentage:       string;
  country_type:             string;
  store_product_id:         number;
  foodpairing_description:  string;
  foodpairing_image:        string;
  foodpairing_product:      string;
  taste_values:             string;
  image_path:               string;
  image_full_path:          string;
  price:                    string;
  quantity:                 string;
  volume:                   string;
  store_product_volume_id:  number;
}

export interface ProductDetailData {
  ProductDetail:       ProductDetailRecord;
  ProductVolumes:      ProductVolume[];
  FoodPairing:         FoodPairingData;
  TasteCharacteristics: TasteCharacteristic[];
  CustomerReview:      CustomerReviewData;
  EnablePurchase:      boolean;
  Universal:           unknown[];
}

export interface ProductDetailApiResponse {
  code:    number;
  message: string;
  data:    ProductDetailData;
}

/* ── Params ─────────────────────────────────────────────────── */

export interface GetProductDetailParams {
  Product_id: number | string;
  lat?:       string;
  long?:      string;
  city?:      string;
  store_id?:  number | string;
  token?:     string;
}

/* ── Fetcher ─────────────────────────────────────────────────── */

export async function getProductDetail(
  params: GetProductDetailParams,
): Promise<ProductDetailData> {
  const { token, ...p } = params;

  const body = new URLSearchParams();
  body.append("Product_id", String(p.Product_id));
  if (p.lat)      body.append("lat",      p.lat);
  if (p.long)     body.append("long",     p.long);
  if (p.city)     body.append("city",     p.city);
  if (p.store_id) body.append("store_id", String(p.store_id));

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/guest/ProductDescriptionNew`, {
    method:  "POST",
    headers,
    body:    body.toString(),
    next:    { tags: [TAGS.product(p.Product_id)], revalidate: 600 },
  });

  if (!res.ok) {
    throw new Error(`ProductDetail API ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as ProductDetailApiResponse;

  if (json.code !== 1) {
    throw new Error(`ProductDetail API error: ${json.message}`);
  }

  return json.data;
}

/* ── Helpers ─────────────────────────────────────────────────── */

/**
 * Deduplicate volumes by volume_id, preferring entries that have a price
 * (meaning they are stocked in at least one nearby store).
 */
export function deduplicateVolumes(volumes: ProductVolume[]): ProductVolume[] {
  const map = new Map<number, ProductVolume>();
  for (const v of volumes) {
    const existing = map.get(v.volume_id);
    if (!existing || (!existing.price && v.price)) {
      map.set(v.volume_id, v);
    }
  }
  return Array.from(map.values());
}

/**
 * Convert TasteCharacteristic right_value (0–2 scale, 1 = centre) to a
 * 0–100 percentage used by the slider track.
 * 0 = far left, 50 = centre, 100 = far right
 */
export function tasteValueToPercent(rightValue: number): number {
  return Math.min(100, Math.max(0, (rightValue / 2) * 100));
}
