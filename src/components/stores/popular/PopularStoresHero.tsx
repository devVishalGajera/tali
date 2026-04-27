"use client";

const HERO_IMAGE = "/assets/images/banner/popular-store-banner.jpg";

interface Props {
  search: string;
  onSearch: (value: string) => void;
}

const PopularStoresHero = ({ search, onSearch }: Props) => (
  <section
    className="relative w-full h-[280px] sm:h-[360px] bg-cover bg-center overflow-hidden"
    style={{ backgroundImage: `url(${HERO_IMAGE})` }}
  >
    {/* Light vignette */}
    <div className="absolute inset-0 bg-black/30" />

    {/* Radial blur behind text */}
    <div
      className="absolute inset-0"
      style={{
        backdropFilter: "blur(50px)",
        WebkitBackdropFilter: "blur(50px)",
        maskImage: "radial-gradient(ellipse 60% 80% at 50% 50%, black 30%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse 60% 80% at 50% 50%, black 30%, transparent 70%)",
      }}
    />

    {/* Content */}
    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
        Discover Our Wine &amp; Liquor Stores
      </h1>
      <p className="text-sm sm:text-base text-white/80 max-w-xl mb-7 drop-shadow">
        Find the perfect store for your favorite alcoholic beverages. Explore ratings, delivery options, and more!
      </p>

      {/* Search bar */}
      <div className="flex items-center w-full max-w-xl bg-white rounded-full shadow-lg px-4 py-2">
        <svg className="w-5 h-5 text-[#F02A0B] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Mumbai"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="flex-1 px-3 py-1 text-sm text-[#1D1D1D] placeholder:text-[#1D1D1D80] focus:outline-none bg-transparent"
        />
        <button className="bg-[#F02A0B] hover:bg-[#d42509] text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors shrink-0">
          Search
        </button>
      </div>
    </div>
  </section>
);

export default PopularStoresHero;
