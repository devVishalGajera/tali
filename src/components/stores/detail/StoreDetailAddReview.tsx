"use client";

import { useState } from "react";

const StoreDetailAddReview = () => {
  const [name, setName]         = useState("");
  const [comment, setComment]   = useState("");
  const [rating, setRating]     = useState(1);
  const [hovered, setHovered]   = useState(0);
  const [, setPhoto]            = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="border border-[#E0E0E0] rounded-2xl py-10 px-6 text-center bg-[#F9FFF9]">
        <svg className="w-12 h-12 text-[#00845F] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-base font-semibold text-[#1D1D1D] mb-1">Review submitted!</p>
        <p className="text-sm text-[#1D1D1D80]">Thank you for sharing your experience.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[#E0E0E0] rounded-2xl p-6 bg-[#F9F9F9]"
    >
      <h3 className="text-lg font-bold text-[#1D1D1D] mb-5">Add Your Review</h3>

      <div className="flex flex-col sm:flex-row gap-6 mb-4">
        {/* Name */}
        <div className="flex-1">
          <label className="block text-sm font-semibold text-[#1D1D1D] mb-1.5">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-lg text-sm text-[#1D1D1D] placeholder:text-[#1D1D1D80] bg-white focus:outline-none focus:border-[#1D1D1D] transition-colors"
          />
        </div>

        {/* Star rating */}
        <div>
          <label className="block text-sm font-semibold text-[#1D1D1D] mb-1.5">
            Your Rating
          </label>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill={(hovered || rating) >= star ? "#FBBC05" : "#D9D9D9"}
                  className="transition-colors duration-100"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#1D1D1D] mb-1.5">
          Your Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          required
          rows={4}
          className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg text-sm text-[#1D1D1D] placeholder:text-[#1D1D1D80] bg-white focus:outline-none focus:border-[#1D1D1D] transition-colors resize-none"
        />
      </div>

      {/* Photo upload */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#1D1D1D] mb-1.5">
          Upload Photo <span className="font-normal text-[#1D1D1D80]">(Optional)</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          className="text-sm text-[#1D1D1D80] file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border file:border-[#E0E0E0] file:text-sm file:font-medium file:text-[#1D1D1D] file:bg-white file:cursor-pointer hover:file:bg-gray-50"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="px-8 py-3 bg-[#00845F] hover:bg-[#006e4f] text-white text-sm font-semibold rounded-lg transition-colors"
      >
        Submit Review
      </button>
    </form>
  );
};

export default StoreDetailAddReview;
