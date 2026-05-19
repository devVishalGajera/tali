import { cookies } from "next/headers";
import HeroSection from "@/components/home/HeroSection";
import MainContent from "@/components/home/MainContent";
import { getCategories } from "@/lib/api/categories";

export default async function Home() {
  const cookieStore = await cookies();
  const storeId = cookieStore.get("talli_store_id")?.value || undefined;
  const city = cookieStore.get("talli_city")?.value || undefined;

  const categoriesData = await getCategories({ store_id: storeId, city }).catch(() => null);

  return (
    <main className="w-full m-0 p-0">
      <HeroSection />
      <MainContent categoriesData={categoriesData} />
    </main>
  );
}
