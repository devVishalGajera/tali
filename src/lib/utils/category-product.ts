import type { CategoryProduct } from "@/lib/api/categories";
import type { ProductCardItem } from "@/components/shared/ProductCard";

export function mapCategoryProductToCard(
  product: CategoryProduct,
  options?: { isNewArrival?: boolean }
): ProductCardItem {
  const priceNum = parseFloat(product.price) || 0;
  return {
    id: product.id,
    name: product.name,
    price: `₹${priceNum.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    priceValue: priceNum,
    size: product.volume,
    rating: product.average_rating ?? 0,
    ratingCount: typeof product.order_count === "number" ? product.order_count : Number(product.order_count) || 0,
    image: product.image_full_path,
    store_product_volume_id: product.store_product_volume_id,
    isWishlist: product.is_wishlist,
    isNewArrival: options?.isNewArrival,
  };
}
