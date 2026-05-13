import type { TasteCharacteristic } from "@/lib/api/product-detail";

interface Props {
  characteristics: TasteCharacteristic[];
  tasteNotes?: string;
}

/** Each value is 0–10; map to 0–50% of the track (half width from centre). */
function halfPercent(value: number): number {
  return Math.min(50, Math.max(0, (value / 10) * 50));
}

export default function ProductDetailTasteChart({ characteristics, tasteNotes }: Props) {
  if (!characteristics.length && !tasteNotes) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Taste notes */}
      {tasteNotes && (
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-[#1D1D1D] mb-3">Taste Notes:</h3>
          <p className="text-sm sm:text-base text-[#1D1D1D80] leading-relaxed">{tasteNotes}</p>
        </div>
      )}

      {/* Sliders */}
      {characteristics.length > 0 && (
        <div className="space-y-6">
          {characteristics.map((item) => {
            const leftPct = halfPercent(item.left_value);
            const rightPct = halfPercent(item.right_value);

            return (
              <div key={item.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-medium truncate text-[#1D1D1D80]`}>
                    {item.left}
                  </span>
                  <span className={`text-xs font-medium text-right truncate text-[#1D1D1D80]`}>
                    {item.right}
                  </span>
                </div>

                <div className="relative h-[6px] bg-[#E5E5E5] rounded-full overflow-visible">
                  {/* Left fill: grows from centre toward left */}
                  {leftPct > 0 && (
                    <div
                      className="absolute top-0 h-full bg-[#1D1D1D] rounded-full"
                      style={{ right: "50%", width: `${leftPct}%` }}
                    />
                  )}

                  {/* Right fill: grows from centre toward right */}
                  {rightPct > 0 && (
                    <div
                      className="absolute top-0 h-full bg-[#1D1D1D] rounded-full"
                      style={{ left: "50%", width: `${rightPct}%` }}
                    />
                  )}

                  {/* Centre marker */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="w-[4px] h-5 bg-[#1D1D1D] rounded-full" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
