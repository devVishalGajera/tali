import type { StoreCategory } from "./storeDetailTypes";

const StoreDetailCategories = ({ categories }: { categories: StoreCategory[] }) => (
  <section className="py-6 border-t border-[#F0F0F0]">
    <h2 className="text-xl font-bold text-[#1D1D1D] mb-6">Categories</h2>
    <div className="flex flex-wrap gap-8">
      {categories.map((cat) => (
        <div key={cat.name} className="flex flex-col items-center gap-2">
          <img
            src={cat.image}
            alt={cat.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <span className="text-sm text-[#1D1D1D]">{cat.name}</span>
        </div>
      ))}
    </div>
  </section>
);

export default StoreDetailCategories;
