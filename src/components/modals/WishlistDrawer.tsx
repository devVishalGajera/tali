"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWishlist } from "./WishlistProvider";
import { useCart } from "./CartProvider";
import { useLocation } from "./LocationProvider";
import { addToWishlistApi, addCartWishlistAllApi } from "@/lib/api/wishlist";

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

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("talli_auth_token");
}

const WishlistDrawer = () => {
  const router = useRouter();
  const { isDrawerOpen, closeDrawer, items, removeItem, refreshWishlist } = useWishlist();
  const { refreshCart, openDrawer: openCartDrawer } = useCart();
  const { purchaseAllow } = useLocation();
  const [movingId, setMovingId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [movingAll, setMovingAll] = useState(false);

  const moveableItems = items.filter((i) => Boolean(Number(i.storeProductVolumeId)));

  const goToLogin = () => {
    closeDrawer();
    router.push("/login?redirect=/wishlist");
  };

  const handleRemove = async (item: (typeof items)[number]) => {
    setRemovingId(item.productId);
    removeItem(item.productId);

    const token = getAuthToken();
    if (!token) {
      setRemovingId(null);
      return;
    }

    try {
      const spvId = Number(item.storeProductVolumeId);
      if (spvId) {
        await addToWishlistApi({ product_id: item.productId, store_product_volume_id: spvId, token });
      }
    } catch {
      refreshWishlist();
    } finally {
      setRemovingId(null);
    }
  };

  const handleMoveToCart = async (item: (typeof items)[number]) => {
    const token = getAuthToken();
    if (!token) {
      goToLogin();
      return;
    }

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
        closeDrawer();
        openCartDrawer();
      }
    } catch {
      /* silent */
    } finally {
      setMovingId(null);
    }
  };

  const handleMoveAllToCart = async () => {
    if (moveableItems.length === 0) return;

    const token = getAuthToken();
    if (!token) {
      goToLogin();
      return;
    }

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
        /* Remove all moved items from wishlist state & toggle off on server */
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
        closeDrawer();
        openCartDrawer();
      }
    } catch {
      /* silent */
    } finally {
      setMovingAll(false);
    }
  };

  return (
    <>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={closeDrawer} />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[420px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
          <h2 className="text-base font-bold text-[#00845F]">
            My Wishlist ({items.length})
          </h2>
          <button
            onClick={closeDrawer}
            className="text-[#00845F] hover:text-[#006e4f] transition-colors text-lg font-bold leading-none"
            aria-label="Close wishlist"
          >
            ✕
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              <p className="text-sm text-[#1D1D1D80] text-center">Your wishlist is empty.</p>
              <Link
                href="/products"
                onClick={closeDrawer}
                className="px-5 py-2 bg-[#00845F] text-white text-sm font-semibold rounded-full hover:bg-[#006e4f] transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            items.map((item) => {
              const isMoving = movingId === item.productId;
              const isRemoving = removingId === item.productId;
              const hasVolume = Boolean(Number(item.storeProductVolumeId));

              return (
                <div
                  key={item.productId}
                  className={`flex gap-4 pb-4 border-b border-[#F0F0F0] last:border-0 transition-opacity ${
                    isMoving || isRemoving || movingAll ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {/* Image */}
                  <Link
                    href={`/products/${item.productId}`}
                    onClick={closeDrawer}
                    className="w-[80px] h-[100px] shrink-0 bg-[#F5F5F5] rounded-xl overflow-hidden flex items-center justify-center"
                  >
                    <img src={item.image} alt={item.name} className="h-full w-full object-contain p-2" />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.productId}`}
                          onClick={closeDrawer}
                          className="text-sm font-bold text-[#1D1D1D] leading-snug hover:text-[#00845F] transition-colors"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => handleRemove(item)}
                          className="shrink-0 text-[#1D1D1D80] hover:text-[#F02A0B] transition-colors mt-0.5"
                          aria-label="Remove from wishlist"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                      {item.volume && <p className="text-xs text-[#1D1D1D80] mt-0.5">{item.volume}</p>}
                      {item.price && <p className="text-base font-bold text-[#1D1D1D] mt-1">{item.price}</p>}
                    </div>

                    {hasVolume && (
                      <button
                        onClick={() => handleMoveToCart(item)}
                        disabled={isMoving || !purchaseAllow}
                        className="mt-2 self-start flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#00845F] text-[#00845F] text-xs font-semibold hover:bg-[#00845F] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title={!purchaseAllow ? "Purchases not available in your area" : undefined}
                      >
                        <CartPlusIcon />
                        {isMoving ? "Moving…" : "Move to Cart"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#F0F0F0] px-5 py-4 flex flex-col gap-3">
            {/* Move all — shown when more than one item is moveable; disabled if purchase not allowed */}
            {moveableItems.length > 1 && (
              <button
                onClick={handleMoveAllToCart}
                disabled={movingAll || !purchaseAllow}
                className="w-full py-3 flex items-center justify-center gap-2 bg-[#00845F] hover:bg-[#006e4f] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                title={!purchaseAllow ? "Purchases not available in your area" : undefined}
              >
                <CartPlusIcon />
                {movingAll ? "Moving All…" : `Move All to Cart (${moveableItems.length})`}
              </button>
            )}
            <Link
              href="/products"
              onClick={closeDrawer}
              className="block w-full py-3 border border-[#00845F] text-[#00845F] hover:bg-[#00845F] hover:text-white text-sm font-semibold rounded-xl transition-colors text-center"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistDrawer;
