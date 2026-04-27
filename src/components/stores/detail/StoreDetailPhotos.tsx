import type { StorePhoto } from "./storeDetailTypes";

const StoreDetailPhotos = ({ photos }: { photos: StorePhoto[] }) => (
  <section className="py-6 border-t border-[#F0F0F0]">
    <h2 className="text-xl font-bold text-[#1D1D1D] mb-6">Store Photos</h2>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {photos.map((photo) => (
        <div
          key={photo.label}
          className="relative rounded-xl overflow-hidden h-[120px] sm:h-[140px]"
        >
          <img
            src={photo.image}
            alt={photo.label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-end p-2">
            <span className="text-white text-xs font-medium">{photo.label}</span>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default StoreDetailPhotos;
