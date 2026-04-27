import StarRating from "@/components/shared/StarRating";
import type { StoreRating } from "./storeDetailTypes";

const StoreDetailRatings = ({ ratings }: { ratings: StoreRating[] }) => (
  <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-8">
    {ratings.map((r) => (
      <div key={r.label} className="bg-[#F5F5F5] rounded-2xl p-5 relative">
        <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <img src={r.icon} alt={r.label} className="w-6 h-6 object-contain" />
        </div>
        <p className="text-sm font-semibold text-[#1D1D1D] mb-2 mt-1">{r.label}</p>
        <div className="flex items-center gap-2 mb-1">
          <StarRating score={r.score} />
          <span className="text-xs font-semibold text-[#1D1D1D] bg-white px-2 py-0.5 rounded-full border border-[#E0E0E0]">
            {r.score}
          </span>
        </div>
        <p className="text-xs text-[#1D1D1D80]">{r.desc}</p>
      </div>
    ))}
  </section>
);

export default StoreDetailRatings;
