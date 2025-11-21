"use client";

import PopularCategoriesSection from "./PopularCategoriesSection";
import TopBrandsSection from "./TopBrandsSection";
import ProductsSection from "./ProductsSection";
import PromotionalCardsSection from "./PromotionalCardsSection";
import BannerSection from "./BannerSection";
import WhyTalliDrinks from "./WhyTalliDrinks";
import BestsellerSection from "./BestsellerSection";
import TrustedSection from "./TrustedSection";
import FAQSection from "./FAQSection";
import VideoSection from "./VideoSection";

const MainContent = () => {
  return (
    <>
      <div className="w-full bg-white py-6 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <PopularCategoriesSection />
          <TopBrandsSection />
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
