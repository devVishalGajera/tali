/**
 * ProductGrid — Server Component.
 * Receives pre-fetched product data from the page and renders the grid.
 * Uses the same ProductCard as the homepage carousels.
 */

import ProductCard from "@/components/shared/ProductCard";
import ProductGridPagination from "./ProductGridPagination";
import type { ProductListItem } from "@/lib/api/products";
import { toProductCardItem } from "@/lib/api/products";

interface Props {
  products: ProductListItem[];
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  showPagination?: boolean;
}

export default function ProductGrid({
  products,
  currentPage,
  totalPages,
  totalRecords,
  showPagination = false,
}: Props) {
  return (
    <div className="flex-1 min-w-0">
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-semibold text-[#1D1D1D] mb-2">No products found</p>
          <p className="text-sm text-[#1D1D1D80]">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">

            {/* Discover banner — first cell */}
            <div className="bg-white overflow-hidden rounded-[17.1px] border border-[#F0F0F0] shadow-[0px_8.55px_8.55px_0px_#EAE0DA4D,0px_0px_0px_1.07px_#5757571A]">
              <div
                className="relative w-full h-full min-h-[280px] flex flex-col justify-center items-start px-6 md:px-8 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/assets/images/product/discover-product.png')" }}
              >
                <div className="relative z-10 flex flex-col justify-center items-start h-full">
                  <p className="text-sm md:text-base font-medium text-white mb-4">$30-$50 DISCOUNT</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
                    Discover the <br /> 2025 collection
                  </h3>
                  <button className="bg-white text-black hover:bg-gray-100 px-6 py-2.5 rounded border border-black transition-colors font-semibold uppercase text-sm">
                    SHOP NOW
                  </button>
                </div>
              </div>
            </div>

            {products.map((product) => {
              const card = toProductCardItem(product);
              return (
                <ProductCard
                  key={product.id}
                  product={card}
                  linkTo={`/products/${product.id}`}
                  fullWidth
                />
              );
            })}
          </div>

          {showPagination && (
            <ProductGridPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={totalRecords}
            />
          )}
        </>
      )}
    </div>
  );
}
