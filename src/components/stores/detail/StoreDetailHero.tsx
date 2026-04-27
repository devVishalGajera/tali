import type { StoreDetail } from "./storeDetailTypes";

interface Props {
  name: StoreDetail["name"];
  description: StoreDetail["description"];
  heroImage: StoreDetail["heroImage"];
  isVerified: StoreDetail["isVerified"];
  isPremium: StoreDetail["isPremium"];
}

const StoreDetailHero = ({ name, description, heroImage, isVerified, isPremium }: Props) => (
  <section
    className="relative w-full h-[320px] sm:h-[420px] bg-cover bg-center overflow-hidden"
    style={{ backgroundImage: `url(${heroImage})` }}
  >
    {/* Very light full-image vignette so edges stay visible */}
    <div className="absolute inset-0 bg-black/25" />

    {/* Circular radial blur — only blurs the centre behind the text */}
    <div
      className="absolute inset-0"
      style={{
        backdropFilter: "blur(61px)",
        WebkitBackdropFilter: "blur(61px)",
        maskImage:
          "radial-gradient(ellipse 55% 75% at 50% 50%, black 3%, transparent 70%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 55% 75% at 50% 50%, black 3%, transparent 70%)",
      }}
    />

    {/* Content */}
    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
        {name}
      </h1>
      <p className="text-sm sm:text-base text-white/85 max-w-xl mb-6 leading-relaxed drop-shadow">
        {description}
      </p>

      <div className="flex gap-3 flex-wrap justify-center">
        {isVerified && (
          <span className="flex items-center gap-1.5 bg-[#DBEAFE] text-[#1E40AF] text-xs font-semibold px-5 py-2 rounded-full">
            <img src="/assets/icons/verified.svg" alt="Verified" className="w-4 h-4 shrink-0" />
            Verified Listing
          </span>
        )}
        {isPremium && (
          <span className="bg-[#FEF9C3] text-[#894D0E] text-xs font-semibold px-5 py-2 rounded-full">
            Premium Store
          </span>
        )}
      </div>
    </div>
  </section>
);

export default StoreDetailHero;
