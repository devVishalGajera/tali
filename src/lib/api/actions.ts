"use server";

/**
 * Server Actions for on-demand cache revalidation.
 *
 * Call these from any Server Action or Route Handler after a mutation
 * to instantly clear the relevant cached data.
 *
 * Example — after an admin updates a product:
 *   import { revalidateProduct } from "@/lib/api/actions";
 *   await revalidateProduct(42);
 */

import { revalidateTag } from "next/cache";
import { TAGS } from "./cache-tags";

export async function revalidateCategories() {
  revalidateTag(TAGS.categories);
}

export async function revalidateFilterOptions() {
  revalidateTag(TAGS.filterOptions);
}

export async function revalidateProducts() {
  revalidateTag(TAGS.products);
}

export async function revalidateProduct(id: number | string) {
  revalidateTag(TAGS.product(id));
}

export async function revalidateStores() {
  revalidateTag(TAGS.stores);
}

export async function revalidateStore(id: number | string) {
  revalidateTag(TAGS.store(id));
}

export async function revalidatePopularStores() {
  revalidateTag(TAGS.popularStores);
}
