/**
 * Categories API — GET /guest/new/categoriesNew
 *
 * Works for both guest and logged-in users.
 * Pass `token` when the user is authenticated so the API can personalise
 * fields like `is_wishlist`.
 *
 * Server Component usage (guest):
 *   import { getCategories } from "@/lib/api/categories";
 *   const data = await getCategories();
 *
 * Server Component usage (logged-in, token from session/cookie):
 *   const data = await getCategories({ token: session.accessToken });
 *
 * Client Component usage:
 *   Call via a Route Handler or Server Action that forwards the token.
 */

import { apiFetch } from "./client";
import { TAGS }     from "./cache-tags";

/* ── Types ──────────────────────────────────────────────────── */

export interface PopularBrand {
  id:              number;
  name:            string;
  image_path:      string;
  image_full_path: string;
  order_count:     string;
}

export interface Category {
  id:              number;
  name:            string;
  image_path:      string;
  image_name:      string;
  image_full_path: string;
}

export interface CategoryProduct {
  id:                      number;
  name:                    string;
  sub_category_id:         number;
  store_product_volume_id: number;
  image_path:              string;
  image_full_path:         string;
  price:                   string;
  volume:                  string;
  volume_id:               number;
  available_quantity:      string;
  order_count:             number;
  average_rating:          number;
  is_wishlist:             boolean;  // true only when token is provided
  best_dealer:             string;
}

export interface SubCategory {
  id:            number;
  name:          string;
  category_id:   number;
  category_name: string;
  data:          CategoryProduct[];
}

export interface CategoriesData {
  popular_brands: PopularBrand[];
  Category:       Category[];
  SubCategory:    SubCategory[];
}

/* ── Fetcher ─────────────────────────────────────────────────── */

export interface GetCategoriesOptions {
  /** Pass the user's Bearer token to get personalised data (e.g. is_wishlist) */
  token?: string;
}

/**
 * Fetch all categories, subcategories and popular brands.
 *
 * Cached for 10 minutes by the "categories" tag.
 * NOTE: When a token is provided the response is user-specific,
 * so we skip the shared cache to avoid data leaking between users.
 */
export async function getCategories(
  { token }: GetCategoriesOptions = {}
): Promise<CategoriesData> {
  return apiFetch<CategoriesData>("/guest/new/categoriesNew", {
    token,
    tags:       token ? undefined : [TAGS.categories],  // no shared cache for auth'd responses
    revalidate: token ? 0         : 600,                 // guest: 10 min  |  user: no-store
  });
}
