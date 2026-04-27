"use client";

import Link from "next/link";
import StarRating from "@/components/shared/StarRating";

export interface ShopItem {
  id: number;
  name: string;
  address: string;
  rating: number;
  image: string;
  logo: string;
}


const StoresShopCard = ({
  shop,
  actionType,
}: {
  shop: ShopItem;
  actionType: "map" | "whatsapp";
}) => (
  <Link href={`/stores/${shop.id}`} className="block">
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="w-full h-[160px] overflow-hidden">
        <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <img src={shop.logo} alt={shop.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#1D1D1D] leading-tight">{shop.name}</p>
            <p className="text-[11px] text-[#1D1D1D80]">{shop.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <StarRating score={shop.rating} />
          <span className="ml-1 text-xs font-medium text-[#1D1D1D]">{shop.rating}</span>
        </div>
        <button
          onClick={(e) => e.preventDefault()}
          className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[#E0E0E0] text-xs font-medium text-[#1D1D1D] hover:bg-gray-50 transition-colors"
        >
          {actionType === "map" ? (
            <>
              <svg className="w-3.5 h-3.5 text-[#FF5C00]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              View Map
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.522 5.855L.054 23.454a.5.5 0 00.492.546h.053l5.7-1.494A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.659-.525-5.17-1.435l-.37-.22-3.384.887.901-3.292-.242-.381A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              WhastApp
            </>
          )}
        </button>
      </div>
    </div>
  </Link>
);

export default StoresShopCard;
