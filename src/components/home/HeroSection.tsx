"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if we're on desktop
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    const calculateHeaderHeight = () => {
      const header = document.getElementById("main-header");
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };

    // Combined handler for resize
    const handleResize = () => {
      checkDesktop();
      calculateHeaderHeight();
    };

    // Initial calculations
    checkDesktop();
    calculateHeaderHeight();

    // Use ResizeObserver for header height changes
    const header = document.getElementById("main-header");
    let resizeObserver: ResizeObserver | null = null;

    if (header) {
      resizeObserver = new ResizeObserver(() => {
        calculateHeaderHeight();
      });
      resizeObserver.observe(header);
    }

    // Listen for window resize
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality will be implemented later
    console.log("Searching for:", searchQuery);
  };

  // Dynamic height calculation
  const heroHeight = isDesktop && headerHeight > 0 ? `calc(100vh - ${headerHeight}px)` : "75vh";

  return (
    <section
      className="relative w-full bg-[#FAF4F2] overflow-hidden flex flex-col justify-center min-h-0"
      style={{
        height: heroHeight,
      }}
    >
      {/* Animated Bottles Background */}
      <div className="absolute inset-0 w-full h-full animate-continuousFloat pointer-events-none -top-[10px]">
        <Image
          src="/assets/header/icons/bottles.svg"
          alt="Bottles"
          fill
          className="object-contain object-bottom md:object-cover md:object-center"
          priority
        />
      </div>
      <div
        className="w-full absolute bottom-0 left-0 right-0 animate-fadeIn pointer-events-none -mt-[30px] sm:-mt-[40px] md:-mt-[50px] lg:-mt-[60px] xl:-mt-[70px]"
        style={{
          animationDelay: "0.4s",
          animationFillMode: "both",
        }}
      >
        <div
          className="w-full relative overflow-hidden"
          style={{ height: "clamp(50px, 8vw, 120px)" }}
        >
          <div className="absolute bottom-0 left-0 right-0 w-full">
            <Image
              src="/assets/images/WAVE.png"
              alt="Wave"
              width={1570}
              height={339}
              className="w-full h-auto"
              priority
              unoptimized
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                maxHeight: "clamp(50px, 8vw, 120px)",
              }}
            />
          </div>
        </div>
      </div>
      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col justify-center flex-1">
        {/* Heading and Subheading */}
        <div className="text-center mb-6 md:mb-8 lg:mb-12 animate-fadeInUp">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1D1D1D] mb-4">
            Find the best price for wines, beers and spirits.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[#1D1D1D]">
            Search thousands of online stores
          </p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto animate-fadeIn"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          <div
            className={`relative flex items-center shadow-[0px_0px_32px_0px_#00000029] bg-white rounded-full transition-all duration-300 ${
              isFocused ? "shadow-lg scale-[1.02]" : ""
            }`}
          >
            {/* Search Icon */}
            <div className="pl-4 md:pl-6 flex-shrink-0 transition-transform duration-300 hover:scale-110">
              <Image
                src="/assets/header/icons/searchIcon.svg"
                alt="Search"
                width={20}
                height={20}
                className="w-5 h-5 md:w-6 md:h-6"
              />
            </div>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Shop And Product name"
              className="flex-1 px-3 md:px-4 py-4 md:py-4 text-sm md:text-base text-[#1D1D1D] placeholder:text-[#A1A1A1] focus:outline-none bg-transparent transition-all duration-300"
            />

            {/* Search Button with spacing */}
            <div className="pr-2 md:pr-3 flex-shrink-0">
              <button
                type="submit"
                className="bg-[#006B4D] text-white font-semibold px-4 md:px-8 lg:px-5 py-2 md:py-2 text-sm md:text-base rounded-full hover:bg-[#005a40] transition-all duration-300 whitespace-nowrap hover:scale-105 active:scale-95 transform"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Wavy Shape at Bottom */}
      {/* <div
        className="absolute bottom-0 left-0 right-0 w-full animate-fadeIn pointer-events-none"
        style={{ animationDelay: "0.4s", animationFillMode: "both" }}
      >
        <Image
          src="/assets/header/icons/wave-shape.svg"
          alt="Wave"
          width={1920}
          height={200}
          className="w-full h-auto"
        />
      </div> */}
    </section>
  );
};

export default HeroSection;
