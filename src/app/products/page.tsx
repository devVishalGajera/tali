import type { Metadata }           from "next";
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

/* ── Metadata ────────────────────────────────────────────────── */

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

/* ── Types ───────────────────────────────────────────────────── */

export interface ProductsSearchParams {
  categories?: string;   // category id e.g. "23"
  subcats?:    string;   // subcategory id e.g. "17"
  brands?:     string;   // brand id e.g. "46"
  price?:      string;   // price range label e.g. "₹500 - ₹1000"
  q?:          string;   // free-text search term
  page?:       string;   // page number
}

interface PageProps {
  searchParams: Promise<ProductsSearchParams>;
}

/* ── Helpers ─────────────────────────────────────────────────── */

function resolvePriceRange(label: string | undefined, ranges: PriceRange[]) {
  if (!label || label === "All") return {};
  const match = ranges.find((r) => r.title === label);
  if (!match) return {};
  return {
    min_price: match.min_price ?? undefined,
    max_price: match.max_price ?? undefined,
  };
}

function deriveCategoryId(
  selectedCategoryId: string | undefined,
  subcatId:           string | undefined,
  subcategoryArray:   { id: number; category_id: number }[] | undefined,
) {
  if (selectedCategoryId) return selectedCategoryId;
  if (!subcatId || !subcategoryArray) return undefined;
  return subcategoryArray.find((s) => s.id === Number(subcatId))?.category_id;
}

/* ── Page ────────────────────────────────────────────────────── */

export default async function ProductsPage({ searchParams: searchParamsPromise }: PageProps) {
  const searchParams = await searchParamsPromise;
  const page = Math.max(1, parseInt(searchParams.page ?? "1") || 1);

  const [filterOptions, categoriesData] = await Promise.all([
    getFilterOptions().catch(() => null),
    getCategories().catch(() => null),
  ]);

  const category_id = deriveCategoryId(
    searchParams.categories,
    searchParams.subcats,
    filterOptions?.subcategoryArray,
  );

  const productsData = await getProducts({
    page_no:         page,
    category_id,
    sub_category_id: searchParams.subcats  || undefined,
    brand_id:        searchParams.brands   || undefined,
    term:            searchParams.q        || undefined,
    ...resolvePriceRange(searchParams.price, filterOptions?.priceRangeArray ?? []),
  }).catch(() => null);

  console.log("productsData",productsData);
  return (
    <main className="w-full m-0 p-0">
      <ProductListingBanner />

      <div className="w-full bg-white py-6 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

          <CategoryTabs categories={categoriesData?.Category ?? []} />

          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <ProductFiltersSidebar
              filterOptions={filterOptions}
              searchParams={searchParams}
            />
            <ProductGrid
              products={productsData?.data      ?? []}
              currentPage={page}
              totalPages={productsData?.total_pages    ?? 1}
              totalRecords={productsData?.total_records  ?? 0}
            />
          </div>

          <ProductListingSaleBanner />
          <ProductSlider />
        </div>
      </div>
    </main>
  );
}
