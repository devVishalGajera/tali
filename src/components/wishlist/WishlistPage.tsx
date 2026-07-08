"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/components/modals/WishlistProvider";
import { useCart } from "@/components/modals/CartProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLocation } from "@/components/modals/LocationProvider";
import { addToWishlistApi, addCartWishlistAllApi } from "@/lib/api/wishlist";
import { proxyImageUrl } from "@/lib/utils/image";
import { productPath } from "@/lib/utils/product-slug";

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const CartPlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    <line x1="12" y1="10" x2="12" y2="16" /><line x1="9" y1="13" x2="15" y2="13" />
  </svg>
);

export default function WishlistPage() {
  const { items, removeItem, refreshWishlist, isLoading } = useWishlist();
  const { refreshCart, openDrawer: openCartDrawer } = useCart();
  const { isAuthenticated, token } = useAuth();
  const { purchaseAllow } = useLocation();

  const [movingId, setMovingId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [movingAll, setMovingAll] = useState(false);

  const moveableItems = items.filter((i) => Boolean(Number(i.storeProductVolumeId)));

  useEffect(() => {
    if (isAuthenticated) refreshWishlist();
  }, [isAuthenticated, refreshWishlist]);

  const handleRemove = async (item: (typeof items)[number]) => {
    setRemovingId(item.productId);
    removeItem(item.productId);

    if (!isAuthenticated || !token) {
      setRemovingId(null);
      return;
    }

    const spvId = Number(item.storeProductVolumeId);
    if (!spvId) {
      setRemovingId(null);
      return;
    }

    try {
      await addToWishlistApi({ product_id: item.productId, store_product_volume_id: spvId, token });
    } catch {
      refreshWishlist();
    } finally {
      setRemovingId(null);
    }
  };

  const handleMoveToCart = async (item: (typeof items)[number]) => {
    if (!isAuthenticated || !token) return;

    const spvId = Number(item.storeProductVolumeId);
    if (!spvId) return;

    setMovingId(item.productId);

    try {
      const res = await addCartWishlistAllApi({
        cart_items: [{ store_product_volume_id: spvId, quantity: 1 }],
        wishlist_items: [],
        token,
      });

      if (res.code === 1) {
        removeItem(item.productId);
        await addToWishlistApi({ product_id: item.productId, store_product_volume_id: spvId, token }).catch(() => {});
        refreshCart();
        openCartDrawer();
      }
    } catch {
      /* silent */
    } finally {
      setMovingId(null);
    }
  };

  const handleMoveAllToCart = async () => {
    if (!isAuthenticated || !token || moveableItems.length === 0) return;

    setMovingAll(true);

    try {
      const cartItems = moveableItems.map((i) => ({
        store_product_volume_id: Number(i.storeProductVolumeId),
        quantity: 1,
      }));

      const res = await addCartWishlistAllApi({
        cart_items: cartItems,
        wishlist_items: [],
        token,
      });

      if (res.code === 1) {
        await Promise.allSettled(
          moveableItems.map((i) =>
            addToWishlistApi({
              product_id: i.productId,
              store_product_volume_id: Number(i.storeProductVolumeId),
              token,
            })
          )
        );
        moveableItems.forEach((i) => removeItem(i.productId));
        refreshCart();
        openCartDrawer();
      }
    } catch {
      /* silent */
    } finally {
      setMovingAll(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6 md:px-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-[#1D1D1D]">
            My wishlist{items.length > 0 ? ` (${items.length})` : ""}
          </h1>
          <Link href="/products" className="text-sm text-[#006B4D] hover:underline">
            Browse products
          </Link>
        </div>

        {!isAuthenticated && items.length > 0 && (
          <p className="text-sm text-[#1D1D1D80] bg-white border border-[#E8E8E8] rounded-xl px-4 py-3 mb-4">
            <Link href="/login?redirect=/wishlist" className="text-[#006B4D] font-semibold hover:underline">
              Sign in
            </Link>
            {" "}to sync your wishlist across devices.
          </p>
        )}

        {isLoading && items.length === 0 && (
          <p className="text-sm text-[#1D1D1D80] text-center py-12">Loading wishlist…</p>
        )}

        {!isLoading && items.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#E8E8E8] px-6 py-16 text-center">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <p className="text-sm text-[#1D1D1D80] mb-4">Your wishlist is empty.</p>
            <Link
              href="/products"
              className="inline-flex px-5 py-2.5 bg-[#00845F] text-white text-sm font-semibold rounded-full hover:bg-[#006e4f] transition-colors"
            >
              Browse products
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <ul className="space-y-3">
            {items.map((item) => {
              const isMoving = movingId === item.productId;
              const isRemoving = removingId === item.productId;
              const hasVolume = Boolean(Number(item.storeProductVolumeId));
              const imageSrc = proxyImageUrl(item.image);

              return (
                <li
                  key={item.productId}
                  className={`bg-white rounded-2xl border border-[#E8E8E8] px-5 py-4 ${
                    isMoving || isRemoving || movingAll ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="flex gap-4">
                    <Link
                      href={productPath(item.name, item.volume)}
                      className="w-[80px] h-[100px] shrink-0 bg-[#F5F5F5] rounded-xl overflow-hidden flex items-center justify-center"
                    >
                      <img src={imageSrc} alt={item.name} className="h-full w-full object-contain p-2" />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={productPath(item.name, item.volume)}
                            className="text-sm font-bold text-[#1D1D1D] leading-snug hover:text-[#00845F] transition-colors"
                          >
                            {item.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleRemove(item)}
                            className="shrink-0 text-[#1D1D1D80] hover:text-[#F02A0B] transition-colors"
                            aria-label="Remove from wishlist"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                        {item.volume && <p className="text-xs text-[#1D1D1D80] mt-0.5">{item.volume}</p>}
                        {item.price && <p className="text-base font-bold text-[#1D1D1D] mt-1">{item.price}</p>}
                      </div>

                      {hasVolume && purchaseAllow && isAuthenticated && (
                        <button
                          type="button"
                          onClick={() => handleMoveToCart(item)}
                          disabled={isMoving}
                          className="mt-2 self-start flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#00845F] text-[#00845F] text-xs font-semibold hover:bg-[#00845F] hover:text-white transition-all disabled:opacity-50"
                        >
                          <CartPlusIcon />
                          {isMoving ? "Moving…" : "Move to cart"}
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {items.length > 0 && purchaseAllow && isAuthenticated && moveableItems.length > 1 && (
          <button
            type="button"
            onClick={handleMoveAllToCart}
            disabled={movingAll}
            className="mt-4 w-full py-3.5 flex items-center justify-center gap-2 bg-[#00845F] hover:bg-[#006e4f] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            <CartPlusIcon />
            {movingAll ? "Moving all…" : `Move all to cart (${moveableItems.length})`}
          </button>
        )}
      </div>
    </main>
  );
}
