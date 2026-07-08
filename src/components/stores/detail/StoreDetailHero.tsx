import Image from "next/image";
import type { StoreDetail } from "./storeDetailTypes";

interface Props {
  name: StoreDetail["name"];
  description: StoreDetail["description"];
  heroImage: StoreDetail["heroImage"];
  isVerified: StoreDetail["isVerified"];
  isPremium: StoreDetail["isPremium"];
}

const StoreDetailHero = ({ name, description, heroImage, isVerified, isPremium }: Props) => (
  <section className="relative w-full h-[240px] sm:h-[320px] md:h-[420px] overflow-hidden">
    <Image
      src={heroImage}
      alt={name}
      fill
      priority
      quality={90}
      sizes="100vw"
      className="object-cover object-center"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/55" />

    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 drop-shadow-md px-1">
        {name}
      </h1>
      <p className="text-sm sm:text-base text-white/90 max-w-xl mb-6 leading-relaxed drop-shadow">
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
