import StoresHero from "./StoresHero";
import StoresSaleBanner from "./StoresSaleBanner";
import StoresHowItWorks from "./StoresHowItWorks";
import StoresTopCities from "./StoresTopCities";
import StoresTopShops from "./StoresTopShops";
import StoresMoreShops from "./StoresMoreShops";
import StoresListingSection from "./StoresListingSection";
import FAQSection from "@/components/home/FAQSection";

/** Replace these values with API response data when the backend is ready */
const bannerImages = {
  topBanner:   "/assets/images/banner/shops-banner.png",
  midBanner:   "/assets/images/content/shops-dscount.png",
  shelfBanner: "/assets/images/shops/wine-sale.png",
};

const StoresListingPage = () => (
  <main className="w-full bg-white">
    <StoresHero />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <StoresSaleBanner variant="dark" image={bannerImages.topBanner} />
    </div>

    <StoresHowItWorks />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <StoresSaleBanner variant="blue" image={bannerImages.midBanner} removeOverlay={true} />
    </div>

    <StoresTopCities />
    <StoresTopShops />
    <StoresMoreShops />
    <StoresListingSection />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <StoresSaleBanner variant="shelf" image={bannerImages.shelfBanner} />
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <FAQSection />
    </div>
  </main>
);

export default StoresListingPage;
