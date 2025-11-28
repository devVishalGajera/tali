import ProductListingBanner from "@/components/products/ProductListingBanner";
import CategoryTabs from "@/components/products/CategoryTabs";
import ProductFiltersSidebar from "@/components/products/ProductFiltersSidebar";
import ProductGrid from "@/components/products/ProductGrid";
import ProductListingSaleBanner from "@/components/products/ProductListingSaleBanner";
import ProductSlider from "@/components/products/ProductSlider";

export default function ProductsPage() {
  return (
    <main className="w-full m-0 p-0">
      {/* Banner Section */}
      <ProductListingBanner />

      {/* Product Listing Content */}
      <div className="w-full bg-white py-6 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Category Tabs */}
          <CategoryTabs />

          {/* Main Content: Filters + Product Grid */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Filters Sidebar */}
            <ProductFiltersSidebar />

            {/* Product Grid */}
            <ProductGrid />
          </div>
          <ProductListingSaleBanner />
          <ProductSlider />
        </div>
      </div>

    </main>
  );
}

