import OrderDetailPage from "@/components/orders/OrderDetailPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return { title: `Order #${id} | Talli` };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <OrderDetailPage orderId={id} />;
}
