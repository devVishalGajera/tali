"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import SearchWithDropdown from "@/components/shared/SearchWithDropdown";

const HeroSection = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    const calculateHeaderHeight = () => {
      const header = document.getElementById("main-header");
      if (header) setHeaderHeight(header.offsetHeight);
    };
    const handleResize = () => { checkDesktop(); calculateHeaderHeight(); };

    checkDesktop();
    calculateHeaderHeight();

    const header = document.getElementById("main-header");
    let resizeObserver: ResizeObserver | null = null;
    if (header) {
      resizeObserver = new ResizeObserver(calculateHeaderHeight);
      resizeObserver.observe(header);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
    };
  }, []);

  // Dynamic height calculation
  const heroHeight = isDesktop && headerHeight > 0 ? `calc(100vh - ${headerHeight}px)` : "75vh";

  return (
    <section
      className="relative w-full bg-[#FAF4F2] flex flex-col justify-center min-h-0"
      style={{ height: heroHeight }}
    >
      {/* Clipped background layer — overflow-hidden lives here only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Bottles Background */}
      <div className="absolute inset-0 w-full h-full animate-continuousFloat -top-[10px]">
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
      </div>{/* end clipped background layer */}
      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col justify-center flex-1">
        {/* Heading and Subheading */}
        <div className="text-center mb-6 md:mb-8 lg:mb-12 animate-fadeInUp">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1D1D1D] mb-4">
            Find the best price for wines, beers and spirits.
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#1D1D1D]">
            Search thousands of online stores
          </p>
        </div>

        <div
          className="w-full max-w-[680px] mx-auto animate-fadeIn relative z-20"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          <SearchWithDropdown variant="hero" />
        </div>
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
