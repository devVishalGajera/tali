import StoreDetailPage from "@/components/stores/StoreDetailPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StoreDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <StoreDetailPage storeId={id} />;
}
