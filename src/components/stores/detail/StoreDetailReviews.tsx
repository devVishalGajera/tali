import { StarIcon } from "@/components/shared/StarRating";
import type { StoreReview } from "./storeDetailTypes";

const StoreDetailReviews = ({ reviews }: { reviews: StoreReview[] }) => (
  <section className="py-6 border-t border-[#F0F0F0]">
    <h2 className="text-xl font-bold text-[#1D1D1D] mb-6">Customer Reviews</h2>

    <div className="space-y-4 max-w-[1000px] mx-auto">
      {reviews.map((review, idx) => (
        <div
          key={idx}
          className="rounded-[47.65px] p-[30px] bg-white shadow-[0px_20px_40px_0px_rgba(0,0,0,0.10)]"
        >
          <div className="flex items-center justify-between mb-[30px]">
            <div className="flex items-center gap-3">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-semibold text-sm text-[#1D1D1D]">{review.name}</span>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon key={s} filled={s <= review.rating} size="sm" />
              ))}
            </div>
          </div>
          <p className="text-sm text-[#1D1D1D] leading-relaxed mb-3">{review.text}</p>
          <span className="text-xs text-[#1D1D1D80]">{review.date}</span>
        </div>
      ))}
    </div>

    <div className="flex justify-center mt-6">
      <button className="flex items-center gap-2 text-sm text-[#1D1D1D] font-medium">
        <img src="/assets/icons/arrow_drop_down.svg" alt="more" className="w-4 h-2" />
        View More Shop
      </button>
    </div>
  </section>
);

export default StoreDetailReviews;
