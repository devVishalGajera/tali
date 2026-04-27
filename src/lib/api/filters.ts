/**
 * Filter Options API — GET /guest/filterOptions
 *
 * Returns price ranges, subcategories, and brands used to populate
 * the left-hand filter sidebar on the /products page.
 *
 * Server Component usage:
 *   import { getFilterOptions } from "@/lib/api/filters";
 *   const filters = await getFilterOptions();
 */

import { apiFetch } from "./client";
import { TAGS }     from "./cache-tags";

/* ── Types ──────────────────────────────────────────────────── */

export interface PriceRange {
  title:     string;
  min_price: number | null;
  max_price: number | null;
}

export interface FilterSubCategory {
  id:              number;
  name:            string;
  category_id:     number;
  image_path:      string;
  image_full_path: string;
}

export interface FilterBrand {
  id:              number;
  name:            string;
  image_full_path: string;
}

export interface FilterOptions {
  priceRangeArray:  PriceRange[];
  subcategoryArray: FilterSubCategory[];
  brandArray:       FilterBrand[];
}

/* ── Fetcher ─────────────────────────────────────────────────── */

/**
 * Fetch filter options — cached for 10 minutes.
 * These rarely change so a longer cache is appropriate.
 */
export async function getFilterOptions(): Promise<FilterOptions> {
  return apiFetch<FilterOptions>("/guest/filterOptions", {
    tags:       [TAGS.filterOptions],
    revalidate: 600,
  });
}
