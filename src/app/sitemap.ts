import type { MetadataRoute } from "next";
import { getCategories }      from "@/lib/api/categories";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://talli.com";
const now  = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* Static routes */
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                   lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/products`,     lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/stores`,       lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/popular-stores`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  /* Dynamic category routes */
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const data = await getCategories();
    categoryRoutes = data.Category.map((c) => ({
      url:             `${BASE}/products?categories=${c.id}`,
      lastModified:    now,
      changeFrequency: "weekly" as const,
      priority:        0.8,
    }));
  } catch {
    /* If API is down, skip dynamic routes — static routes still work */
  }

  return [...staticRoutes, ...categoryRoutes];
}
