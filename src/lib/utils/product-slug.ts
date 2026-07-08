/** URL slug helpers for product detail pages (/products/[slug]?size=750ml). */

export function productSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Best-effort name for Product_name API lookups from a URL slug. */
export function productNameFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function isNumericProductId(segment: string): boolean {
  return /^\d+$/.test(segment);
}

export function normalizeProductSize(size: string): string {
  return size.trim().toLowerCase().replace(/\s+/g, "");
}

export function productSizesMatch(a: string, b: string): boolean {
  return normalizeProductSize(a) === normalizeProductSize(b);
}

export function productPath(name: string, size?: string | null): string {
  const base = `/products/${productSlug(name)}`;
  if (!size?.trim()) return base;
  const params = new URLSearchParams();
  params.set("size", size.trim());
  return `${base}?${params.toString()}`;
}
