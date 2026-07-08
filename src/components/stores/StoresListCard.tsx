import Link from "next/link";
import StarRating from "@/components/shared/StarRating";
import { talliStorePath } from "@/lib/store/talli-store";

export interface StoreListItem {
  id: number;
  name: string;
  location: string;
  image: string;
  amenities: string[];
  description: string;
  storeRating: number;
  deliveryRating: number;
  deliveryAvailable: boolean;
  isPremium?: boolean;
}

const StoresListCard = ({ store }: { store: StoreListItem }) => (
  <div className="flex flex-col sm:flex-row border border-[#E8E8E8] rounded-2xl bg-white hover:shadow-md transition-shadow overflow-hidden">

    <Link
      href={talliStorePath()}
      className="w-full sm:w-[180px] md:w-[210px] shrink-0 p-3 sm:p-3 block"
    >
      <img
        src={store.image}
        alt={store.name}
        loading="lazy"
        className="w-full h-[160px] sm:h-[174px] object-cover rounded-xl hover:opacity-95 transition-opacity"
      />
    </Link>

    <div className="flex-1 min-w-0 px-4 sm:px-6 py-4 sm:py-5 flex flex-col">
      <div className="flex-1">
        <h3 className="text-lg sm:text-xl font-bold text-[#1D1D1D] mb-1.5 leading-snug">
          {store.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          <svg className="w-4 h-4 text-[#1D1D1D] shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span className="text-sm font-bold text-[#1D1D1D]">{store.location}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {store.amenities.map((tag) => (
            <span
              key={tag}
              className="text-xs text-[#1D1D1D80] border border-[#D9D9D9] rounded-md px-2.5 py-1"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-sm text-[#1D1D1D80] leading-relaxed line-clamp-2">
          {store.description}
        </p>
      </div>

      <div className="mt-4 space-y-2.5 sm:hidden border-t border-[#F0F0F0] pt-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#1D1D1D80] w-16 shrink-0">Store:</span>
          <StarRating score={store.storeRating} size="sm" />
          <span className="text-[#1D1D1D]">({store.storeRating})</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#1D1D1D80] w-16 shrink-0">Delivery:</span>
          <StarRating score={store.deliveryRating} size="sm" />
          <span className="text-[#1D1D1D]">({store.deliveryRating})</span>
        </div>
        <p className="text-sm">
          <span className="text-[#1D1D1D80]">Delivery: </span>
          <span className={store.deliveryAvailable ? "text-[#00845F] font-semibold" : "text-[#F02A0B] font-semibold"}>
            {store.deliveryAvailable ? "Available" : "Not Available"}
          </span>
        </p>
      </div>

      <Link
        href={talliStorePath()}
        className="sm:hidden mt-4 block w-full text-center py-3 bg-[#00845F] hover:bg-[#006e4f] text-white text-sm font-semibold rounded-xl transition-colors"
      >
        View Details
      </Link>

      <Link
        href={talliStorePath()}
        className="hidden sm:flex items-center gap-0.5 mt-3 text-sm text-[#1D1D1D80] hover:text-[#1D1D1D] transition-colors w-fit"
      >
        Show more
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </Link>
    </div>

    <div className="hidden sm:flex shrink-0 w-[220px] md:w-[260px] border-t sm:border-t-0 sm:border-l border-[#E8E8E8] px-5 md:px-6 py-5 flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#1D1D1D80] w-[68px] shrink-0">Store:</span>
          <StarRating score={store.storeRating} size="sm" />
          <span className="text-sm text-[#1D1D1D] whitespace-nowrap">({store.storeRating})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#1D1D1D80] w-[68px] shrink-0">Delivery:</span>
          <StarRating score={store.deliveryRating} size="sm" />
          <span className="text-sm text-[#1D1D1D] whitespace-nowrap">({store.deliveryRating})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#1D1D1D80] w-[68px] shrink-0">Delivery:</span>
          <span
            className={`text-sm font-semibold ${
              store.deliveryAvailable ? "text-[#00845F]" : "text-[#F02A0B]"
            }`}
          >
            {store.deliveryAvailable ? "Available" : "Not Available"}
          </span>
        </div>
      </div>

      <Link
        href={talliStorePath()}
        className="mt-6 block w-full text-center py-3.5 bg-[#00845F] hover:bg-[#006e4f] text-white text-sm font-semibold rounded-xl transition-colors"
      >
        View Details
      </Link>
    </div>
  </div>
);

export default StoresListCard;
