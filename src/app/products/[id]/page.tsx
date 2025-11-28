import ProductDetail from "@/components/products/ProductDetail";

interface PageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  return <ProductDetail productId={params.id} />;
}

