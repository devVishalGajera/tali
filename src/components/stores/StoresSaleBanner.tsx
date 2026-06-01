const StoresSaleBanner = ({
  variant,
  image,
  removeOverlay,
}: {
  variant: "dark" | "blue" | "shelf";
  image: string;
  removeOverlay?: boolean;
}) => {
  const overlay = variant === "dark" ? "rgba(0,0,0,0.55)" : "rgba(13,27,42,0.70)";

  const overlayStyle = removeOverlay ? "none" : `linear-gradient(${overlay}, ${overlay})`;

  if (variant === "shelf") {
    return (
      <div className="relative w-full my-8 sm:my-10 flex flex-col sm:block sm:min-h-[300px] md:min-h-[360px]">
        <div className="relative sm:absolute sm:right-0 sm:top-0 sm:bottom-0 w-full sm:w-[80%] h-[200px] sm:h-auto rounded-xl overflow-hidden order-1 sm:order-none">
          <img src={image} alt="Wine Sale" loading="lazy" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 rounded-lg p-6 sm:p-8 md:p-10 w-full sm:max-w-[380px] mt-4 sm:mt-0 border border-[#E8E8E8] sm:border-transparent shadow-lg sm:shadow-[10px_10px_20px_0px_rgba(0,0,0,0.2)] bg-white sm:[background:linear-gradient(white,white)_padding-box,linear-gradient(90deg,#000000_0%,rgba(0,0,0,0)_100%)_border-box] order-2 sm:order-none">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1D1D1D] mb-3">
            Wine Sale - 15%<br />Off All Bottles
          </h2>
          <p className="text-sm text-[#1D1D1D80] mb-5 sm:mb-6 leading-relaxed">
            Sed ut perspiciatis unde omnis iste natus ut perspic iatis unde omnis iste.
          </p>
          <button type="button" className="bg-[#1D1D1D] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black transition-colors">
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full overflow-hidden rounded-xl my-8 bg-cover bg-center"
      style={{ backgroundImage: `${overlayStyle}, url(${image})` }}
    >
      <div className="px-5 sm:px-8 md:px-16 py-10 sm:py-14 md:py-18">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
          Wine Sale - 15%<br />Off All Bottles
        </h2>
        <p className="text-sm text-white/70 mb-6 leading-relaxed">
          Sed ut perspiciatis unde omnis iste natus ut perspic iatis unde omnis iste.
        </p>
        <button className="bg-white text-[#1D1D1D] px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default StoresSaleBanner;
