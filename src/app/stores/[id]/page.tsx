import StoreDetailPage from "@/components/stores/StoreDetailPage";

interface PageProps {
  params: { id: string };
}

export default function StoreDetailRoute({ params }: PageProps) {
  return <StoreDetailPage storeId={params.id} />;
}
