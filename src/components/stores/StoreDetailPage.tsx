import { mockStore } from "./detail/storeDetailMock";
import StoreDetailHero        from "./detail/StoreDetailHero";
import StoreDetailRatings     from "./detail/StoreDetailRatings";
import StoreDetailContact     from "./detail/StoreDetailContact";
import StoreDetailHours       from "./detail/StoreDetailHours";
import StoreDetailCategories  from "./detail/StoreDetailCategories";
import StoreDetailPayments    from "./detail/StoreDetailPayments";
import StoreDetailLocation    from "./detail/StoreDetailLocation";
import StoreDetailSocialLinks from "./detail/StoreDetailSocialLinks";
import StoreDetailPhotos      from "./detail/StoreDetailPhotos";
import StoreDetailMenu        from "./detail/StoreDetailMenu";
import StoreDetailReviews     from "./detail/StoreDetailReviews";
import StoreDetailSignInCTA   from "./detail/StoreDetailSignInCTA";

/* Replace mockStore with an API call using storeId when ready */
const StoreDetailPage = ({ storeId: _storeId }: { storeId: string }) => {
  const store = mockStore;

  return (
    <main className="w-full bg-white">
      <StoreDetailHero
        name={store.name}
        description={store.description}
        heroImage={store.heroImage}
        isVerified={store.isVerified}
        isPremium={store.isPremium}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <StoreDetailRatings    ratings={store.ratings} />
        <StoreDetailContact    contact={store.contact} />
        <StoreDetailHours      hours={store.hours} />
        <StoreDetailCategories categories={store.categories} />
        <StoreDetailPayments   payments={store.payments} />
        <StoreDetailLocation   address={store.address} />
        <StoreDetailSocialLinks social={store.social} />
        <StoreDetailPhotos     photos={store.photos} />
        <StoreDetailMenu       menuTabs={store.menuTabs} menuItems={store.menuItems} />
        <StoreDetailReviews    reviews={store.reviews} />
        <StoreDetailSignInCTA isLoggedIn={false} />
      </div>
    </main>
  );
};

export default StoreDetailPage;
