import HeroSection from "@/components/home/HeroSection";
import MainContent  from "@/components/home/MainContent";
import { getCategories } from "@/lib/api/categories";

export default async function Home() {
  /* Fetch on the server — result is cached 10 min (guest, no token) */
  const categoriesData = await getCategories().catch(() => null);

  return (
    <main className="w-full m-0 p-0">
      <HeroSection />
      <MainContent categoriesData={categoriesData} />
    </main>
  );
}
