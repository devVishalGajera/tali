import type { CustomerReviewData } from "@/lib/api/product-detail";
import StarRating, { StarIcon }    from "@/components/shared/StarRating";

interface Props {
  reviewData: CustomerReviewData;
}

export default function ProductDetailReviews({ reviewData }: Props) {
  const { summary, reviews } = reviewData;

  return (
    <section className="mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h2 className="mb-6 text-[32px] font-semibold leading-none tracking-normal text-[#1D1D1D]">
          Customer Reviews
        </h2>

        {/* Rating summary card */}
        <div className="mb-6 max-w-[817px] mx-auto rounded-[14.52px] px-[38px] py-[28px] bg-white shadow-[-8px_-4px_29px_0px_rgba(0,0,0,0.08)]">
          <h3 className="text-base font-semibold text-[#1D1D1D] mb-4">Customer Reviews</h3>
          <div className="flex items-center gap-8 mt-[30px]">
            {/* Bar chart */}
            <div className="flex-1 space-y-[30px]">
              {(["5", "4", "3", "2", "1"] as const).map((star) => {
                const count = summary.rating_breakdown[star] ?? 0;
                const pct   = summary.total_reviews > 0
                  ? (count / summary.total_reviews) * 100
                  : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-[#1D1D1D80] w-2">{star}</span>
                    <div className="flex-1 h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#FBBC05]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-1 min-w-[90px]">
              <span className="text-6xl font-black text-[#1D1D1D] leading-none">
                {summary.average_rating > 0
                  ? summary.average_rating.toFixed(1)
                  : "—"}
              </span>
              <StarRating score={summary.average_rating} size="md" />
              <span className="text-xs text-[#1D1D1D80]">
                {summary.total_reviews} review{summary.total_reviews !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Individual review cards */}
        {reviews.length > 0 ? (
          <div className="space-y-[30px] max-w-[1000px] mx-auto">
            {reviews.map((review, i) => (
              <div
                key={i}
                className="rounded-[30px] p-[30px] bg-white shadow-[0px_20px_40px_0px_rgba(0,0,0,0.10)]"
              >
                <div className="flex items-center justify-between mb-[10px]">
                  <div className="flex items-center gap-3">
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        alt={review.user_name}
                        className="w-[40px] h-[40px] rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-[40px] h-[40px] rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-sm">
                        {review.user_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-semibold text-sm text-[#1D1D1D]">
                      {review.user_name}
                    </span>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarIcon key={s} filled={s <= review.rating} size="sm" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-[#1D1D1D] leading-relaxed mb-3">
                  {review.comment}
                </p>
                <span className="text-xs text-[#1D1D1D80]">{review.created_at}</span>
              </div>
            ))}

            <div className="flex justify-center mt-6 mb-4">
              <button className="flex items-center gap-2 text-sm text-[#1D1D1D] cursor-pointer font-medium">
                <img src="/assets/icons/arrow_drop_down.svg" alt="dropdown" className="w-4 h-2" />
                <span>View More Reviews</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-[#1D1D1D80] py-8">
            No reviews yet. Be the first to review this product!
          </p>
        )}
      </div>
    </section>
  );
}
