/**
 * Store API helpers.
 *
 * Safe to call from Server Components with built-in Next.js caching.
 *
 * Usage in a Server Component:
 *   import { getStores } from "@/lib/api/stores";
 *   const { data } = await getStores();
 *
 * On-demand revalidation:
 *   import { revalidateTag } from "next/cache";
 *   import { TAGS } from "@/lib/api/cache-tags";
 *   revalidateTag(TAGS.stores);
 */

import { apiFetch } from "./client";
import { TAGS } from "./cache-tags";

export interface StoreListItem {
  id: number;
  name: string;
  location: string;
  image: string;
  amenities: string[];
  description: string;
  storeRating: number;
  deliveryRating: number;
  deliveryAvailable: boolean;
  isPremium?: boolean;
}

export interface StoreDetail extends StoreListItem {
  heroImage: string;
  isVerified: boolean;
  phone: string;
  whatsapp: string;
  website: string;
  address: string;
  hours: { day: string; time: string }[];
  categories: { name: string; icon: string }[];
  payments: { name: string; icon: string }[];
  photos: string[];
  social: { platform: string; url: string; icon: string }[];
}

export interface StoresResponse {
  data: StoreListItem[];
  total: number;
  page: number;
  perPage: number;
}

/** Fetch paginated store list — cached for 5 minutes */
export async function getStores(params?: {
  page?: number;
  perPage?: number;
  city?: string;
  sort?: string;
}): Promise<StoresResponse> {
  const qs = new URLSearchParams();
  if (params?.page)    qs.set("page",    String(params.page));
  if (params?.perPage) qs.set("perPage", String(params.perPage));
  if (params?.city)    qs.set("city",    params.city);
  if (params?.sort)    qs.set("sort",    params.sort);

  return apiFetch<StoresResponse>(`/stores?${qs}`, {
    tags:       [TAGS.stores],
    revalidate: 300,
  });
}

/** Fetch popular stores — cached for 10 minutes */
export async function getPopularStores(): Promise<StoreListItem[]> {
  return apiFetch<StoreListItem[]>("/stores/popular", {
    tags:       [TAGS.popularStores, TAGS.stores],
    revalidate: 600,
  });
}

/** Fetch a single store detail page — cached individually */
export async function getStore(id: number | string): Promise<StoreDetail> {
  return apiFetch<StoreDetail>(`/stores/${id}`, {
    tags:       [TAGS.stores, TAGS.store(id)],
    revalidate: 300,
  });
}
