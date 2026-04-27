/**
 * ProductGrid — Server Component.
 * Receives pre-fetched product data from the page and renders the grid.
 * Interactive leaf nodes (cart, wishlist, pagination) are Client Components.
 */

import Link                  from "next/link";
import StarRating            from "@/components/shared/StarRating";
import ProductCardActions    from "./ProductCardActions";
import ProductGridPagination from "./ProductGridPagination";
import type { ProductListItem } from "@/lib/api/products";
import { toProductCardItem }   from "@/lib/api/products";

interface Props {
  products:     ProductListItem[];
  currentPage:  number;
  totalPages:   number;
  totalRecords: number;
}

export default function ProductGrid({ products, currentPage, totalPages, totalRecords }: Props) {
  return (
    <div className="flex-1 min-w-0">
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-semibold text-[#1D1D1D] mb-2">No products found</p>
          <p className="text-sm text-[#1D1D1D80]">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12 mb-6">

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

            {/* Product cards */}
            {products.map((product) => {
              const card = toProductCardItem(product);
              return (
                <div
                  key={product.id}
                  className="bg-white overflow-visible rounded-[17.1px] border border-[#F0F0F0] shadow-[0px_8.55px_8.55px_0px_#EAE0DA4D,0px_0px_0px_1.07px_#5757571A] hover:shadow-lg transition-shadow"
                >
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="relative p-3 w-full h-[240px] flex items-end justify-between overflow-visible cursor-pointer">
                      {/* Product image */}
                      <div className="h-full -top-12 relative flex-1">
                        <img
                          src={card.image}
                          alt={card.name}
                          className="max-w-[104px] h-full object-contain"
                          loading="lazy"
                        />
                      </div>

                      {/* Right column: wishlist + rating + price */}
                      <div className="flex flex-col items-end gap-3 z-10">
                        {/* Wishlist (client) */}
                        <ProductCardActions product={card} initialWishlist={product.is_wishlist} />

                        <div className="flex flex-col items-center gap-[15px]">
                          <span className="font-graphik font-medium text-[26px] leading-[39.49px] text-[#1E1E1E]">
                            {card.rating > 0 ? card.rating.toFixed(1) : "—"}
                          </span>
                          <StarRating score={card.rating} />
                          <span className="font-graphik font-normal text-[13px] text-center text-[#1E1E1E] whitespace-nowrap">
                            {card.ratingCount > 0 ? `${card.ratingCount} orders` : "New"}
                          </span>
                          <span className="bg-[#00845F] text-white font-graphik font-semibold py-2 px-4 rounded-full text-base whitespace-nowrap">
                            {card.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Name + Add to cart */}
                    <div className="px-4 pb-4 pt-2 flex flex-col items-center gap-2 mt-4">
                      <h3 className="font-graphik font-normal text-[14px] text-[#1D1D1D] w-full text-left">
                        {card.name}
                      </h3>
                      {/* Add to cart rendered inside ProductCardActions */}
                    </div>
                  </Link>

                  {/* Add-to-cart sits outside Link to avoid nested interactivity */}
                  <div className="px-4 pb-4 flex justify-center">
                    <ProductCardActions product={card} initialWishlist={product.is_wishlist} cartOnly />
                  </div>
                </div>
              );
            })}
          </div>

          <ProductGridPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
          />
        </>
      )}
    </div>
  );
}
