import Link from "next/link";
import { mockStore } from "./detail/storeDetailMock";
import StoreDetailHero from "./detail/StoreDetailHero";
import StoreDetailRatings from "./detail/StoreDetailRatings";
import StoreDetailContact from "./detail/StoreDetailContact";
import StoreDetailHours from "./detail/StoreDetailHours";
import StoreDetailCategories from "./detail/StoreDetailCategories";
import StoreDetailPayments from "./detail/StoreDetailPayments";
import StoreDetailLocation from "./detail/StoreDetailLocation";
import StoreDetailSocialLinks from "./detail/StoreDetailSocialLinks";
import StoreDetailPhotos from "./detail/StoreDetailPhotos";
import StoreDetailMenu from "./detail/StoreDetailMenu";
import StoreDetailReviews from "./detail/StoreDetailReviews";
import StoreDetailSignInCTA from "./detail/StoreDetailSignInCTA";

const StoreDetailPage = ({ storeId }: { storeId: string }) => {
  const store = mockStore;

  return (
    <main className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4 sm:pt-6">
        <nav className="text-xs text-[#1D1D1D80] mb-2">
          <Link href="/" className="hover:text-[#006B4D]">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/stores" className="hover:text-[#006B4D]">Stores</Link>
          <span className="mx-2">›</span>
          <span className="text-[#1D1D1D] font-medium truncate">{store.name}</span>
        </nav>
      </div>

      <StoreDetailHero
        name={store.name}
        description={store.description}
        heroImage={store.heroImage}
        isVerified={store.isVerified}
        isPremium={store.isPremium}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-10">
        <StoreDetailRatings ratings={store.ratings} />
        <StoreDetailContact contact={store.contact} />
        <StoreDetailHours hours={store.hours} />
        <StoreDetailCategories categories={store.categories} />
        <StoreDetailPayments payments={store.payments} />
        <StoreDetailLocation address={store.address} />
        <StoreDetailSocialLinks social={store.social} />
        <StoreDetailPhotos photos={store.photos} />
        <StoreDetailMenu menuTabs={store.menuTabs} menuItems={store.menuItems} />
        <StoreDetailReviews reviews={store.reviews} />
        <StoreDetailSignInCTA isLoggedIn={false} />
      </div>
    </main>
  );
};

export default StoreDetailPage;
