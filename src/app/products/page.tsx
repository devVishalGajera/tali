import type { Metadata }          from "next";
import ProductListingBanner        from "@/components/products/ProductListingBanner";
import CategoryTabs                from "@/components/products/CategoryTabs";
import ProductFiltersSidebar       from "@/components/products/ProductFiltersSidebar";
import ProductGrid                 from "@/components/products/ProductGrid";
import ProductListingSaleBanner    from "@/components/products/ProductListingSaleBanner";
import ProductSlider               from "@/components/products/ProductSlider";
import { getFilterOptions }        from "@/lib/api/filters";
import { getCategories }           from "@/lib/api/categories";
import { getProducts }             from "@/lib/api/products";
import type { PriceRange }         from "@/lib/api/filters";

/* ── SEO metadata ─────────────────────────────────────────────── */
export const metadata: Metadata = {
  title:       "Shop All Products | Talli — Wine, Spirits & Beer Online",
  description: "Browse our full range of wines, spirits, beer and more. Filter by category, brand and price. Fast delivery across India.",
  openGraph: {
    title:       "Shop All Products | Talli",
    description: "Browse our full range of wines, spirits, beer and more.",
    url:         "/products",
    type:        "website",
  },
  alternates: { canonical: "/products" },
};

/* ── URL search-param keys ────────────────────────────────────── */
export interface ProductsSearchParams {
  categories?: string;   // single category id e.g. "23"
  subcats?:    string;   // comma-separated subcategory ids
  brands?:     string;   // comma-separated brand ids
  price?:      string;   // price range title e.g. "₹500 - ₹1000"
  q?:          string;   // free-text search
  page?:       string;   // page number
}

interface PageProps {
  searchParams: ProductsSearchParams;
}

/* ── Helpers ──────────────────────────────────────────────────── */
function resolvePriceRange(priceTitle: string | undefined, priceRanges: PriceRange[]) {
  if (!priceTitle || priceTitle === "All") return {};
  const range = priceRanges.find((r) => r.title === priceTitle);
  if (!range) return {};
  return {
    min_price: range.min_price ?? undefined,
    max_price: range.max_price ?? undefined,
  };
}

/* ── Page ─────────────────────────────────────────────────────── */
export default async function ProductsPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page ?? "1") || 1;

  /* filterOptions needed first to resolve price range params */
  const [filterOptions, categoriesData] = await Promise.all([
    getFilterOptions().catch(() => null),
    getCategories().catch(() => null),
  ]);

  const productsData = await getProducts({
    page_no:         page,
    category_id:     searchParams.categories || undefined,
    sub_category_id: searchParams.subcats?.split(",")[0] || undefined,
    brand_id:        searchParams.brands?.split(",")[0]  || undefined,
    term:            searchParams.q || undefined,
    ...resolvePriceRange(searchParams.price, filterOptions?.priceRangeArray ?? []),
  }).catch(() => null);

  return (
    <main className="w-full m-0 p-0">
      <ProductListingBanner />

      <div className="w-full bg-white py-6 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

          <CategoryTabs
            categories={categoriesData?.Category ?? []}
            activeCategoryId={
              searchParams.categories ? Number(searchParams.categories) : undefined
            }
          />

          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <ProductFiltersSidebar
              filterOptions={filterOptions}
              searchParams={searchParams}
            />

            <ProductGrid
              products={productsData?.data ?? []}
              currentPage={page}
              totalPages={productsData?.total_pages ?? 1}
              totalRecords={productsData?.total_records ?? 0}
            />
          </div>

          <ProductListingSaleBanner />
          <ProductSlider />
        </div>
      </div>
    </main>
  );
}
