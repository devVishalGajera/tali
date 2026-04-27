"use client";

import { useState }  from "react";
import Image         from "next/image";
import StarRating    from "@/components/shared/StarRating";

type TabKey = "prices" | "additional" | "description";

interface Props {
  productName:    string;
  description:    string;
  country:        string;
  alcoholPercent: string;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "prices",      label: "Prices"                },
  { key: "additional",  label: "Additional information" },
  { key: "description", label: "Description"            },
];

/* Static shop data — will be replaced once a stores-by-product API is available */
const MOCK_SHOPS = [
  {
    id:       1,
    name:     "Delhi Duty Free (Departures Terminal 3, IGI Airport)",
    image:    "/assets/images/shops/delhi-duty-free.png",
    location: "New Delhi",
    country:  "India",
    flagIcon: "/assets/icons/indianFlag.svg",
    hours:    "Mon - Sat,  09:00am - 10:00pm",
    rating:   4,
    delivery: "Standard delivery 1-2 weeks",
    volume:   "750ml",
  },
];

export default function ProductDetailTabs({
  productName,
  description,
  country,
  alcoholPercent,
}: Props) {
  const [activeTab,        setActiveTab]        = useState<TabKey>("prices");
  const [selectedLocation, setSelectedLocation] = useState("India");

  return (
    <>
      {/* Tab bar */}
      <div className="w-full border-b border-[#1D1D1D33] pt-[30px]">
        <div className="flex items-center justify-center">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 py-3 text-center text-sm sm:text-base md:text-lg leading-snug transition-colors cursor-pointer ${
                activeTab === key
                  ? "text-[#1D1D1D] font-bold -mb-px"
                  : "text-[#3C3232] font-normal"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 md:px-8 md:py-6">
        {/* ── Prices ── */}
        {activeTab === "prices" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-[#FF5C00]">
                0{MOCK_SHOPS.length} Prices
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#1D1D1D]">Shop Location</span>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-[#1D1D1D] bg-white cursor-pointer focus:outline-none"
                >
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                  <option>UAE</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {MOCK_SHOPS.map((shop) => (
                <div
                  key={shop.id}
                  className="border border-[#E5E5E5] rounded-lg p-4 sm:p-5 flex flex-col lg:flex-row gap-4 lg:gap-5"
                >
                  <div className="relative w-[260px] h-[168px] rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={shop.image} alt={shop.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 gap-7.5 flex flex-col">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="text-base sm:text-lg font-medium text-[#1D1D1D] leading-tight">
                          {productName}
                        </h4>
                        <span className="flex-shrink-0 px-3 py-1 bg-[#FCCCC5] text-[#1D1D1D] text-xs font-medium rounded-full">
                          {shop.volume}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-2">
                        <Image src="/assets/icons/briefcase.svg" alt="Store" width={14} height={14} className="w-3.5 h-3.5 opacity-70" />
                        <span className="text-sm text-[#1D1D1D]">{shop.name}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRating score={shop.rating} />
                      </div>
                      <div className="flex flex-wrap items-start gap-x-5 gap-y-2 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Image src={shop.flagIcon} alt={shop.country} width={18} height={18} className="w-[18px] h-[18px]" />
                          <span className="text-[#00A624] font-medium">{shop.country}:</span>
                          <span className="text-[#00A624]">{shop.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#6B7280]">
                          <Image src="/assets/icons/time.svg" alt="Clock" width={18} height={18} className="w-[18px] h-[18px]" />
                          <span>{shop.hours}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <Image src="/assets/icons/truck_orange.svg" alt="Delivery" width={18} height={18} className="w-[18px] h-[18px]" />
                            <span className="text-[#FF9900]">{shop.delivery}</span>
                          </div>
                          <a href="#" className="text-sm text-[#1D1D1D] underline">
                            More shipping info
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col h-full justify-end items-end">
                    <button className="w-full lg:w-auto px-6 py-2.5 border border-[#FF5C00] text-[#FF5C00] rounded-lg text-sm font-medium hover:bg-[#FFF0E8] transition-colors cursor-pointer whitespace-nowrap mt-auto">
                      Go to Shop
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button className="flex items-center gap-2 text-sm text-[#1D1D1D] cursor-pointer">
                <img src="/assets/icons/arrow_drop_down.svg" alt="dropdown" className="w-4 h-2" />
                <span className="font-medium">View More Shop</span>
              </button>
            </div>
          </div>
        )}

        {/* ── Additional ── */}
        {activeTab === "additional" && (
          <div>
            <p className="px-8 text-xs sm:text-sm leading-relaxed text-center text-[#1D1D1D80]">
              Additional product information will be displayed here.
            </p>
            <div className="flex flex-col sm:flex-row items-center pt-[30px] gap-12">
              <div className="space-y-3 text-sm sm:text-base text-[#1D1D1D]">
                {country && (
                  <div className="flex gap-1">
                    <span className="font-semibold">Region:</span>
                    <span>{country}</span>
                  </div>
                )}
                {alcoholPercent && (
                  <div className="flex gap-1">
                    <span className="font-semibold">Alcohol ABV:</span>
                    <span>{alcoholPercent}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Description ── */}
        {activeTab === "description" && (
          <div className="py-8">
            <h3 className="text-lg font-semibold text-[#1D1D1D] mb-4">Product Description</h3>
            <p className="text-sm sm:text-base text-[#1D1D1D80] leading-relaxed">
              {description || "No description available."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
