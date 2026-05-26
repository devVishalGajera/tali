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
  const allSubCategories = (categoriesData?.SubCategory ?? []).filter(
    (sc) => sc.data?.length > 0,
  );
  const firstRow = allSubCategories.slice(0, 1);
  const secondRow = allSubCategories.slice(1, 2);
  const restRows = allSubCategories.slice(2);

  return (
    <>
      <div className="w-full bg-white py-6 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <PopularCategoriesSection categories={categoriesData?.Category ?? []} />
          <TopBrandsSection brands={categoriesData?.popular_brands ?? []} />
          {/* <ProductsSection /> */}
          <SubCategoryProductSections subCategories={firstRow} />
          {firstRow.length > 0 && (
            <div className="mb-6 md:mb-10">
              <PromotionalCardsSection />
            </div>
          )}
          <SubCategoryProductSections subCategories={secondRow} />
        </div>
      </div>
      {secondRow.length > 0 && <BannerSection />}
      <div className="w-full bg-white py-6 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <SubCategoryProductSections subCategories={restRows} />
          <WhyTalliDrinks />
          {/* <BestsellerSection /> */}
          <TrustedSection />
          <FAQSection />
          <VideoSection />
        </div>
      </div>
    </>
  );
};

export default MainContent;
