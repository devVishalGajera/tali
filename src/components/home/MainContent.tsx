import PopularCategoriesSection from "./PopularCategoriesSection";
import TopBrandsSection from "./TopBrandsSection";
import SubCategoryProductSections from "./SubCategoryProductSections";
import PromotionalCardsSection from "./PromotionalCardsSection";
import BannerSection from "./BannerSection";
import WhyTalliDrinks from "./WhyTalliDrinks";
import TrustedSection from "./TrustedSection";
import FAQSection from "./FAQSection";
import VideoSection from "./VideoSection";
import type { CategoriesData } from "@/lib/api/categories";
import ProductsSection from "./ProductsSection";
import BestsellerSection from "./BestsellerSection";

interface Props {
  categoriesData: CategoriesData | null;
}

const MainContent = ({ categoriesData }: Props) => {
  return (
    <>
      <div className="w-full bg-white py-6 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <PopularCategoriesSection categories={categoriesData?.Category ?? []} />
          <TopBrandsSection brands={categoriesData?.popular_brands ?? []} />
          <SubCategoryProductSections subCategories={categoriesData?.SubCategory ?? []} />
          <ProductsSection />
          <PromotionalCardsSection />
        </div>
      </div>
      <BannerSection />
      <div className="w-full bg-white py-6 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <WhyTalliDrinks />
          <BestsellerSection />
          <TrustedSection />
          <FAQSection />
          <VideoSection />
        </div>
      </div>
    </>
  );
};

export default MainContent;
