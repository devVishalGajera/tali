import Link                       from "next/link";
import Image                      from "next/image";
import ProductCarouselSection     from "@/components/shared/ProductCarouselSection";
import ProductDetailGallery       from "./ProductDetailGallery";
import ProductDetailInfo          from "./ProductDetailInfo";
import ProductDetailTasteChart    from "./ProductDetailTasteChart";
import ProductDetailFoodPairing   from "./ProductDetailFoodPairing";
import ProductDetailReviews       from "./ProductDetailReviews";
import ProductDetailTabs          from "./ProductDetailTabs";
import type { ProductDetailData } from "@/lib/api/product-detail";
import { deduplicateVolumes }     from "@/lib/api/product-detail";

interface Props {
  data: ProductDetailData;
}

export default function ProductDetail({ data }: Props) {
  const { ProductDetail: pd, ProductVolumes, FoodPairing, TasteCharacteristics, CustomerReview } = data;

  const images  = pd.image_full_path
    ? [pd.image_full_path]
    : ["/assets/images/bottles/single-bottle.png"];

  const volumes = deduplicateVolumes(ProductVolumes);

  const description = pd.short_description || pd.description || "";

  return (
    <main className="w-full m-0 p-0 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 md:px-8 md:py-6 lg:py-12">
        {/* Breadcrumbs */}
        <nav className="mb-4 sm:mb-6 md:mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900 text-[#1D1D1D80]">Home</Link>
            </li>
            <li>
              <Image src="/assets/icons/arrow.svg" alt="" width={20} height={20} className="h-5 w-5" />
            </li>
            <li>
              <Link href="/products" className="hover:text-gray-900 text-[#1D1D1D80]">Products</Link>
            </li>
            <li>
              <Image src="/assets/icons/arrow.svg" alt="" width={20} height={20} className="h-5 w-5" />
            </li>
            <li className="text-gray-900 font-medium line-clamp-1">{pd.name}</li>
          </ol>
        </nav>

        {/* Hero — gallery + info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ProductDetailGallery images={images} name={pd.name} abv={pd.alcohol_percentage} />
          <ProductDetailInfo
            productId={pd.id}
            name={pd.name}
            description={description}
            abv={pd.alcohol_percentage}
            country={pd.country_type}
            volumes={volumes}
          />
        </div>
      </div>

      {/* Delivery / Taste Notes / Taste Chart */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 md:px-8 md:py-10">
        {/* Delivery + Sold By */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-[#1D1D1D] mb-3">Delivery Time</h3>
            <div className="flex items-center gap-2 text-sm sm:text-base text-[#1D1D1D80]">
              <Image src="/assets/icons/location-pin.svg" alt="Location" width={16} height={16} className="w-4 h-4" />
              <span>Delivering to your location</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-[#1D1D1D] mb-3">Sold By</h3>
            <div className="flex items-center gap-2 text-sm sm:text-base text-[#1D1D1D]">
              <Image src="/assets/icons/briefcase.svg" alt="Store" width={18} height={18} className="w-[18px] h-[18px]" />
              <span>Available at multiple stores</span>
            </div>
          </div>
        </div>

        {/* Taste chart */}
        {TasteCharacteristics.length > 0 && (
          <div className="mt-8">
            <ProductDetailTasteChart
              characteristics={TasteCharacteristics}
              tasteNotes={pd.short_description || undefined}
            />
          </div>
        )}
      </div>

      {/* Food Pairing */}
      {FoodPairing.foodpairing_product.length > 0 && (
        <ProductDetailFoodPairing foodPairing={FoodPairing} />
      )}

      {/* Prices / Additional / Description tabs */}
      <ProductDetailTabs
        productName={pd.name}
        description={pd.description || description}
        country={pd.country_type}
        alcoholPercent={pd.alcohol_percentage}
      />

      {/* Reviews */}
      <ProductDetailReviews reviewData={CustomerReview} />

      {/* Related / Similar Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10">
        <ProductCarouselSection
          title="Related products"
          products={[]}
          linkProducts
          centerTitle
        />
        <ProductCarouselSection
          title="Similar products"
          products={[]}
          linkProducts
          centerTitle
        />
      </div>
    </main>
  );
}
