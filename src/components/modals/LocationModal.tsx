"use client";

import { useState, useEffect } from "react";
import type { LocationState } from "./LocationProvider";
import type { CitiesApiData } from "@/lib/api/cities";
import type { NearestStoreResult } from "@/app/api/nearest-store/route";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (state: LocationState) => void;
  currentCity: string;
  citiesData: CitiesApiData | null;
}

async function fetchNearestStore(
  params: { lat?: string; long?: string; city?: string },
): Promise<NearestStoreResult> {
  const res = await fetch("/api/nearest-store", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return res.json() as Promise<NearestStoreResult>;
}

function buildLocationState(
  result: NearestStoreResult,
  displayCity: string,
  lat: string | null,
  long: string | null,
): LocationState {
  return {
    city: result.flag === 2 ? (result.cityName ?? displayCity) : displayCity,
    storeId: result.storeId,
    lat,
    long,
    flag: result.flag,
    purchaseAllow: result.purchaseAllow,
  };
}

const LocationModal = ({ isOpen, onClose, onApply, currentCity, citiesData }: Props) => {
  const [selectedCity, setSelectedCity] = useState(currentCity);
  const [pincode, setPincode] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLocating, setLocating] = useState(false);
  const [isApplying, setApplying] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [geoPermission, setGeoPermission] = useState<PermissionState | "unsupported">("prompt");

  useEffect(() => {
    if (isOpen) {
      setSelectedCity(currentCity);
      setPincode("");
      setDropdownOpen(false);
      setLocationError("");
    }
  }, [isOpen, currentCity]);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    if (!navigator.permissions) {
      setGeoPermission("unsupported");
      return;
    }
    navigator.permissions.query({ name: "geolocation" as PermissionName })
      .then((status) => {
        setGeoPermission(status.state);
        status.onchange = () => setGeoPermission(status.state);
      })
      .catch(() => setGeoPermission("unsupported"));
  }, []);

  if (!isOpen) return null;

  const triggerGeolocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setDropdownOpen(false);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = String(pos.coords.latitude);
        const long = String(pos.coords.longitude);
        try {
          const result = await fetchNearestStore({ lat, long });

          let city = result.cityName ?? "";
          if (result.flag === 1 && !city) {
            try {
              const geo = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&addressdetails=1`,
                { headers: { "User-Agent": "TalliDrinks/1.0" } },
              );
              const data = await geo.json();
              const addr = data?.address ?? {};
              city = addr.city || addr.town || addr.village || addr.county || addr.state_district || "";
            } catch { /* ignore */ }
          }

          setLocating(false);
          onApply(buildLocationState(result, city, lat, long));
        } catch {
          setLocating(false);
          setLocationError("Could not detect your location. Please try again.");
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) {
          setGeoPermission("denied");
          setLocationError("Location access denied. Please allow it in your browser settings.");
        } else {
          setLocationError("Could not detect your location. Please try again.");
        }
      },
      { timeout: 10000 },
    );
  };

  const handleUseMyLocation = () => {
    if (geoPermission === "denied") {
      setLocationError("Location access is blocked. Please enable it in your browser settings and reload.");
      return;
    }
    triggerGeolocation();
  };

  const handleApply = async () => {
    const city = selectedCity || pincode;
    if (!city) return;
    setApplying(true);
    setLocationError("");
    try {
      const result = await fetchNearestStore({ city: selectedCity || undefined });
      onApply(buildLocationState(result, selectedCity, null, null));
    } catch {
      setLocationError("Could not verify location. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const selectCity = (city: string) => {
    setSelectedCity(city);
    setDropdownOpen(false);
    setPincode("");
    setLocationError("");
  };

  const canApply = selectedCity.length > 0 || pincode.length === 6;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-[540px] bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-gray-200">
          <h2 className="text-[22px] font-bold text-black leading-tight">Choose your location</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 1L17 17M17 1L1 17" stroke="#1D1D1D" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-7 pt-6 pb-7 max-h-[80vh] overflow-y-auto">
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Select a delivery location to see product availability and delivery options
          </p>

          {/* Use Current Location — standalone button */}
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-4 rounded-xl border text-sm font-medium transition-colors ${
              geoPermission === "denied"
                ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                : "border-[#006B4D] text-[#006B4D] hover:bg-green-50 active:scale-[0.99]"
            }`}
          >
            {isLocating ? (
              <span className="w-4 h-4 border-2 border-[#006B4D] border-t-transparent rounded-full animate-spin flex-shrink-0" />
            ) : (
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
              </svg>
            )}
            {isLocating ? "Detecting your location…" : "Use Current Location"}
          </button>

          {/* City selector trigger */}
          <button
            type="button"
            onClick={() => { setDropdownOpen((o) => !o); setLocationError(""); }}
            className="w-full flex items-center justify-between px-4 py-3.5 border border-gray-300 rounded-xl text-left hover:border-gray-400 transition-colors focus:outline-none"
          >
            <span className={`text-[15px] ${selectedCity ? "text-black" : "text-gray-400"}`}>
              {selectedCity || "Select City"}
            </span>
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              className={`text-gray-500 transition-transform duration-200 flex-shrink-0 ${dropdownOpen ? "rotate-180" : ""}`}
            >
              <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Inline city list */}
          {dropdownOpen && (
            <div className="mt-1 border border-gray-200 rounded-xl overflow-y-auto max-h-52">
              {(citiesData?.popularCities ?? []).length > 0 && (
                <>
                  <div className="px-4 pt-3 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-widest bg-gray-50">
                    Popular
                  </div>
                  {citiesData!.popularCities.map((city) => (
                    <button
                      key={`pop-${city}`}
                      type="button"
                      onClick={() => selectCity(city)}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 border-b border-gray-100 ${
                        selectedCity === city ? "text-[#006B4D] font-medium bg-green-50" : "text-[#1D1D1D]"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </>
              )}

              {(citiesData?.states ?? []).map((state) => (
                <div key={state.title}>
                  <div className="px-4 pt-3 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-widest bg-gray-50">
                    {state.title}
                  </div>
                  {state.cities.map((city) => (
                    <button
                      key={`${state.title}-${city}`}
                      type="button"
                      onClick={() => selectCity(city)}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                        selectedCity === city ? "text-[#006B4D] font-medium bg-green-50" : "text-[#1D1D1D]"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              ))}

              {!citiesData && (
                <div className="px-4 py-4 text-sm text-gray-400 text-center">Loading cities…</div>
              )}
            </div>
          )}

          {/* Error */}
          {locationError && (
            <p className="mt-2 text-xs text-red-500">{locationError}</p>
          )}

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-sm text-gray-400">or enter an Indian Pincode</span>
            </div>
          </div>

          {/* Pincode + Apply */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="numeric"
              value={pincode}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                setPincode(v);
                if (v.length > 0) setSelectedCity("");
              }}
              placeholder="Enter Pincode"
              maxLength={6}
              className="flex-1 px-4 py-3.5 border border-gray-300 rounded-xl text-[#1D1D1D] placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors text-sm"
            />
            <button
              onClick={handleApply}
              disabled={!canApply || isApplying}
              className={`px-7 py-3.5 rounded-full font-semibold text-sm border-2 transition-all whitespace-nowrap ${
                canApply && !isApplying
                  ? "border-green-600 text-green-600 hover:bg-green-50 active:scale-95 cursor-pointer"
                  : "border-gray-300 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isApplying ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Applying
                </span>
              ) : "Apply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
