/**
 * Central registry of all Next.js cache tags.
 * Use these constants everywhere — in fetchers and in revalidateTag() calls —
 * so a typo never causes a silent cache miss.
 */

export const TAGS = {
  categories:    "categories",
  filterOptions: "filter-options",

  products:      "products",
  product:       (id: string | number) => `product-${id}`,

  stores:        "stores",
  store:         (id: string | number) => `store-${id}`,

  popularStores: "popular-stores",
} as const;
