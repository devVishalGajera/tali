import type { Metadata }   from "next";
import { notFound }        from "next/navigation";
import ProductDetail       from "@/components/products/ProductDetail";
import { getProductDetail } from "@/lib/api/product-detail";

/* ── Types ───────────────────────────────────────────────────── */

interface PageProps {
  params: Promise<{ id: string }>;
}

/* ── Metadata ─────────────────────────────────────────────────── */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  const data = await getProductDetail({ Product_id: id }).catch(() => null);
  const detail = data?.ProductDetail;

  if (!detail) {
    return { title: "Product Not Found | Talli" };
  }

  return {
    title:       `${detail.name} | Talli`,
    description: detail.short_description || detail.description || undefined,
    openGraph: {
      title:  detail.name,
      images: detail.image_full_path ? [detail.image_full_path] : [],
      url:    `/products/${id}`,
      type:   "website",
    },
    alternates: { canonical: `/products/${id}` },
  };
}

/* ── Page ─────────────────────────────────────────────────────── */

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  const data = await getProductDetail({ Product_id: id }).catch(() => null);

  if (!data) notFound();

  return <ProductDetail data={data} />;
}
