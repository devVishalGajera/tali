"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  startTransition,
  ReactNode,
} from "react";
import LocationModal from "./LocationModal";
import type { CitiesApiData } from "@/lib/api/cities";
import type { NearestStoreResult } from "@/app/api/nearest-store/route";

/* ── Types ───────────────────────────────────────────────────── */

export interface LocationState {
  city: string;
  storeId: number | null;
  lat: string | null;
  long: string | null;
  flag: 1 | 2 | 3 | null;
  purchaseAllow: boolean;
}

interface LocationContextType extends LocationState {
  isModalOpen: boolean;
  showModal: () => void;
  hideModal: () => void;
  updateLocation: (state: LocationState) => void;
}

/* ── Context ─────────────────────────────────────────────────── */

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within LocationProvider");
  return ctx;
};

/* ── Storage + cookie helpers ────────────────────────────────── */

const STORAGE_KEY = "talli_location";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function loadFromStorage(): LocationState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LocationState>;
    return {
      city: parsed.city ?? "",
      storeId: parsed.storeId ?? null,
      lat: parsed.lat ?? null,
      long: parsed.long ?? null,
      flag: parsed.flag ?? null,
      purchaseAllow: parsed.purchaseAllow ?? false,
    };
  } catch {
    return null;
  }
}

function syncCookies(state: LocationState) {
  if (typeof document === "undefined") return;
  const opts = `; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.cookie = `talli_store_id=${encodeURIComponent(state.storeId ?? "")}${opts}`;
  document.cookie = `talli_city=${encodeURIComponent(state.city ?? "")}${opts}`;
}

function saveToStorage(state: LocationState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  syncCookies(state);
}

function clearStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  syncCookies({ city: "", storeId: null, lat: null, long: null, flag: null, purchaseAllow: false });
}

/* ── Provider ────────────────────────────────────────────────── */

export const LocationProvider = ({
  children,
  citiesData,
}: {
  children: ReactNode;
  citiesData: CitiesApiData | null;
}) => {
  const [state, setState] = useState<LocationState>({
    city: "", storeId: null, lat: null, long: null, flag: null, purchaseAllow: false,
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
      const saved = loadFromStorage();
      if (saved?.city || saved?.storeId) {
        setState(saved);
        syncCookies(saved);
      } else {
        if (typeof navigator !== "undefined" && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const lat = String(pos.coords.latitude);
              const long = String(pos.coords.longitude);
              try {
                const res = await fetch("/api/nearest-store", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ lat, long }),
                });
                const data = await res.json() as NearestStoreResult;

                let city = data.cityName ?? "";
                if (data.flag === 1 && !city) {
                  try {
                    const geo = await fetch(
                      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&addressdetails=1`,
                      { headers: { "User-Agent": "TalliDrinks/1.0" } },
                    );
                    const geoData = await geo.json();
                    const addr = geoData?.address ?? {};
                    city = addr.city || addr.town || addr.village || addr.county || addr.state_district || "";
                  } catch { /* ignore */ }
                }

                const next: LocationState = {
                  city,
                  storeId: data.storeId,
                  lat,
                  long,
                  flag: data.flag,
                  purchaseAllow: data.purchaseAllow,
                };

                if (data.flag === 3) {
                  clearStorage();
                  setState({ ...next, storeId: null, city: "" });
                } else {
                  saveToStorage(next);
                  setState(next);
                }
              } catch {
                setModalOpen(true);
              }
            },
            () => setModalOpen(true),
            { timeout: 8000 },
          );
        } else {
          setModalOpen(true);
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen]);

  const updateLocation = (next: LocationState) => {
    if (next.flag === 3) {
      clearStorage();
      setState({ city: "", storeId: null, lat: next.lat, long: next.long, flag: 3, purchaseAllow: false });
    } else {
      saveToStorage(next);
      setState(next);
    }
    setModalOpen(false);
  };

  return (
    <LocationContext.Provider
      value={{
        ...state,
        isModalOpen,
        showModal: () => setModalOpen(true),
        hideModal: () => setModalOpen(false),
        updateLocation,
      }}
    >
      {children}
      {isMounted && (
        <LocationModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onApply={updateLocation}
          currentCity={state.city}
          citiesData={citiesData}
        />
      )}
    </LocationContext.Provider>
  );
};
