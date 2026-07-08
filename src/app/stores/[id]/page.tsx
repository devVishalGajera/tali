import { redirect } from "next/navigation";
import StoreDetailPage from "@/components/stores/StoreDetailPage";
import { TALLI_STORE_SLUG, talliStorePath } from "@/lib/store/talli-store";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StoreDetailRoute({ params }: PageProps) {
  const { id } = await params;

  if (id !== TALLI_STORE_SLUG) {
    redirect(talliStorePath());
  }

  return <StoreDetailPage storeSlug={id} />;
}
