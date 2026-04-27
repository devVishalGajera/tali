import type { StoreHours } from "./storeDetailTypes";

const StoreDetailHours = ({ hours }: { hours: StoreHours[] }) => (
  <section className="py-6 border-t border-[#F0F0F0]">
    <h2 className="text-xl font-bold text-[#1D1D1D] mb-6">Opening Hours</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {hours.map((h) => (
        <div key={h.days} className="flex items-center gap-3">
          <svg
            className="w-8 h-8 text-[#1D1D1D80] shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="9" strokeWidth="1.5" strokeDasharray="3 2" />
            <path strokeLinecap="round" strokeWidth="1.5" d="M12 7v5l3 3" />
          </svg>
          <div>
            <p className="text-xs text-[#1D1D1D80]">{h.days}:</p>
            <p className="text-sm font-bold text-[#1D1D1D]">{h.time}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default StoreDetailHours;
