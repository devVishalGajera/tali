"use client";

const BannerSection = () => {
  return (
    <section
      className="w-full h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('/assets/images/banner/home.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative h-full flex items-start justify-center max-w-7xl mx-auto mt-20 px-4 sm:px-6 md:px-8">
        {/* Text Content */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1D1D1D] mb-4 md:mb-6">
            Lorem ipsum dolor sit amet Consectetur.
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#1D1D1D] max-w-3xl mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Netus gravida urna nunc imperdiet volutpat
            porttitor. Turpis est porttitor morbi velit cursus sed suspendisse tortor. Nulla enim
            consequat congue quam vel purus orci.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
