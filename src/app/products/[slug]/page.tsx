import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import ProductDetail from "@/components/products/ProductDetail";
import { getProductDetail, getProductDetailBySlug } from "@/lib/api/product-detail";
import {
  isNumericProductId,
  productPath,
  productSlug,
} from "@/lib/utils/product-slug";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ size?: string }>;
}

async function loadProduct(slug: string, storeId?: string, city?: string) {
  if (isNumericProductId(slug)) {
    return getProductDetail({
      Product_id: slug,
      store_id: storeId,
      city,
    }).catch(() => null);
  }
  return getProductDetailBySlug(slug, { store_id: storeId, city }).catch(() => null);
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { size } = await searchParams;

  const data = await loadProduct(slug);
  const detail = data?.ProductDetail;

  if (!detail) {
    return { title: "Product Not Found | Talli" };
  }

  const canonical = productPath(detail.name, size);

  return {
    title: `${detail.name} | Talli`,
    description: detail.short_description || detail.description || undefined,
    openGraph: {
      title: detail.name,
      images: detail.image_full_path ? [detail.image_full_path] : [],
      url: canonical,
      type: "website",
    },
    alternates: { canonical },
  };
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { size } = await searchParams;

  const cookieStore = await cookies();
  const storeId = cookieStore.get("talli_store_id")?.value || undefined;
  const city = cookieStore.get("talli_city")?.value || undefined;

  const data = await loadProduct(slug, storeId, city);
  if (!data) notFound();

  const canonicalSlug = productSlug(data.ProductDetail.name);
  if (slug !== canonicalSlug || isNumericProductId(slug)) {
    redirect(productPath(data.ProductDetail.name, size));
  }

  return <ProductDetail data={data} city={city} initialSize={size} />;
}
