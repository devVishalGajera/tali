import Image                   from "next/image";
import type { FoodPairingData }  from "@/lib/api/product-detail";
import { proxyImageUrl }        from "@/lib/utils/image";

interface Props {
  foodPairing: FoodPairingData;
}

export default function ProductDetailFoodPairing({ foodPairing }: Props) {
  const { foodpairing_description, foodpairing_image, foodpairing_product } = foodPairing;

  if (!foodpairing_image && !foodpairing_product.length) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 md:px-8 md:py-10">
      <h3 className="text-lg sm:text-xl font-semibold text-[#1D1D1D] mb-2">Food Pairing:</h3>
      {foodpairing_description && (
        <p className="text-sm sm:text-base text-[#1D1D1D80] mb-6">{foodpairing_description}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main image */}
        {foodpairing_image && (
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src={proxyImageUrl(foodpairing_image)}
              alt="Food Pairing"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        )}

        {/* Food items grid */}
        {foodpairing_product.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 place-items-center">
            {foodpairing_product.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center w-full max-w-[140px] sm:max-w-[160px] md:max-w-[190px]"
              >
                <p className="text-xs sm:text-sm text-[#1D1D1D] text-center mb-2 min-h-[32px] sm:min-h-[40px] line-clamp-2">
                  {item.product_name}
                </p>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden">
                  <Image
                    src={proxyImageUrl(item.product_image)}
                    alt={item.product_name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
