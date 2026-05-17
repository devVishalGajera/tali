"use client";

import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import type { CustomerReviewData } from "@/lib/api/product-detail";
import StarRating, { StarIcon } from "@/components/shared/StarRating";

interface Props {
  reviewData: CustomerReviewData;
}

const EMPTY_DATA: CustomerReviewData = {
  summary: {
    average_rating: 0,
    total_reviews: 0,
    rating_breakdown: { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 },
  },
  reviews: [],
};

export default function ProductDetailReviews({ reviewData }: Props) {
  const { summary, reviews } = reviewData ?? EMPTY_DATA;
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h2 className="mb-5 text-xl font-semibold text-[#1D1D1D]">Customer Reviews</h2>

        {/* Equal-width two columns, vertical on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">

          {/* ── LEFT: Rating summary ─────────────────────────────── */}
          <div className="rounded-2xl px-6 py-6 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)] flex flex-col">
            {/* Header */}
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1D1D1D60] mb-4">
              Overall Rating
            </p>

            {/* Score row */}
            <div className="flex items-center gap-5 mb-5">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-black text-[#1D1D1D] leading-none">
                  {summary.average_rating > 0 ? summary.average_rating.toFixed(1) : "—"}
                </span>
                <StarRating score={summary.average_rating} size="md" />
                <span className="text-[11px] text-[#1D1D1D60] mt-1">
                  {summary.total_reviews} review{summary.total_reviews !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Divider */}
              <div className="w-px self-stretch bg-gray-100" />

              {/* Bar chart */}
              <div className="flex-1 space-y-2">
                {(["5", "4", "3", "2", "1"] as const).map((star) => {
                  const count = summary.rating_breakdown[star] ?? 0;
                  const pct = summary.total_reviews > 0
                    ? (count / summary.total_reviews) * 100
                    : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-[#1D1D1D80] w-2 text-right leading-none">
                        {star}
                      </span>
                      <div className="flex-1 h-[6px] bg-[#F0F0F0] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#FBBC05] transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-[#1D1D1D40] w-6 text-right leading-none">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Auto-scrolling single-card slider ─────────── */}
          <div className="flex items-center">
            {reviews.length === 0 ? (
              <div className="w-full flex items-center justify-center min-h-[160px] rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
                <p className="text-xs text-[#1D1D1D60]">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            ) : (
              <div className="relative w-full">
                {/* Prev arrow */}
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.12)] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                  aria-label="Previous"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1D1D1D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                {/* Next arrow */}
                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.12)] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                  aria-label="Next"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1D1D1D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>

                <Swiper
                  onSwiper={(s) => { swiperRef.current = s; }}
                  modules={[Autoplay]}
                  slidesPerView={1}
                  spaceBetween={0}
                  loop={reviews.length > 1}
                  autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                  className="w-full"
                >
                  {reviews.map((review, i) => (
                    <SwiperSlide key={i} className="!h-auto py-1 px-1">
                      <div className="rounded-2xl p-5 bg-white border border-gray-200 h-full">

                        {/* Avatar + name + stars */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {review.user_image ? (
                              <img
                                src={review.user_image}
                                alt={review.user_name}
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-100"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#006B4D] to-[#00c47a] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                                {review.user_name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold text-[#1D1D1D] leading-tight">
                                {review.user_name}
                              </p>
                              <p className="text-[11px] text-[#1D1D1D50] leading-tight mt-0.5">
                                {review.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-0.5 flex-shrink-0">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <StarIcon key={s} filled={s <= review.rating} size="sm" />
                            ))}
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-100 mb-3" />

                        {/* Comment */}
                        <p className="text-sm text-[#444] leading-relaxed min-h-[36px]">
                          {review.comment
                            ? review.comment
                            : <span className="italic text-[#1D1D1D30]">No comment left.</span>
                          }
                        </p>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Dot indicators */}
                {reviews.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-3">
                    {reviews.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => swiperRef.current?.slideToLoop(i)}
                        className="w-1.5 h-1.5 rounded-full bg-gray-200 hover:bg-[#006B4D] transition-colors"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
