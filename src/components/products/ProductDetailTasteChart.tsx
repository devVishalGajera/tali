import type { TasteCharacteristic } from "@/lib/api/product-detail";
import { tasteValueToPercent }       from "@/lib/api/product-detail";

interface Props {
  characteristics: TasteCharacteristic[];
  tasteNotes?:     string;
}

export default function ProductDetailTasteChart({ characteristics, tasteNotes }: Props) {
  if (!characteristics.length && !tasteNotes) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Taste notes */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-[#1D1D1D] mb-3">Taste Notes:</h3>
        <p className="text-sm sm:text-base text-[#1D1D1D80] leading-relaxed">
          {tasteNotes || "—"}
        </p>
      </div>

      {/* Sliders */}
      <div className="space-y-8">
        {characteristics.map((item) => {
          const percent  = tasteValueToPercent(item.right_value);
          const isRight  = percent >= 50;
          const distance = Math.abs(percent - 50);

          return (
            <div key={item.id} className="grid grid-cols-[100px_1fr_120px] items-center gap-4">
              <span className="text-sm text-[#1D1D1D] truncate">{item.left}</span>

              <div className="relative h-[6px] bg-[#E5E5E5] rounded-full overflow-visible">
                {/* Centre marker */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="w-[6px] h-6 bg-[#1D1D1D] rounded-full" />
                </div>
                {/* Directional fill */}
                {isRight ? (
                  <div
                    className="absolute top-0 h-full bg-[#1D1D1D] rounded-full"
                    style={{ left: "50%", width: `${distance}%` }}
                  />
                ) : (
                  <div
                    className="absolute top-0 h-full bg-[#1D1D1D] rounded-full"
                    style={{ right: "50%", width: `${distance}%` }}
                  />
                )}
              </div>

              <span className="text-sm text-[#1D1D1D] text-right truncate">{item.right}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
