"use server";

/**
 * Server Actions for on-demand cache revalidation.
 *
 * Call these from any Server Action or Route Handler after a mutation
 * to instantly clear the relevant cached data.
 *
 * Next.js 16: revalidateTag requires a second `profile` argument.
 * Passing `{}` (empty CacheLifeConfig) purges the tag immediately.
 */

import { revalidateTag } from "next/cache";
import { TAGS } from "./cache-tags";

const PURGE = {} as const;

export async function revalidateCategories() {
  revalidateTag(TAGS.categories, PURGE);
}

export async function revalidateFilterOptions() {
  revalidateTag(TAGS.filterOptions, PURGE);
}

export async function revalidateProducts() {
  revalidateTag(TAGS.products, PURGE);
}

export async function revalidateProduct(id: number | string) {
  revalidateTag(TAGS.product(id), PURGE);
}

export async function revalidateStores() {
  revalidateTag(TAGS.stores, PURGE);
}

export async function revalidateStore(id: number | string) {
  revalidateTag(TAGS.store(id), PURGE);
}

export async function revalidatePopularStores() {
  revalidateTag(TAGS.popularStores, PURGE);
}
