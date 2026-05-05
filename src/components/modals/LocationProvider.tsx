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

/* ── Types ───────────────────────────────────────────────────── */

export interface LocationState {
  city:    string;
  storeId: number | null;
  lat:     string | null;
  long:    string | null;
}

interface LocationContextType extends LocationState {
  isModalOpen:    boolean;
  showModal:      () => void;
  hideModal:      () => void;
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

const STORAGE_KEY   = "talli_location";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function loadFromStorage(): LocationState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocationState) : null;
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

/* ── Provider ────────────────────────────────────────────────── */

export const LocationProvider = ({
  children,
  citiesData,
}: {
  children:   ReactNode;
  citiesData: CitiesApiData | null;
}) => {
  const [state, setState]           = useState<LocationState>({ city: "", storeId: null, lat: null, long: null });
  const [isModalOpen, setModalOpen] = useState(false);
  const [isMounted, setMounted]     = useState(false);

  /* On mount — restore saved state or prompt user */
  useEffect(() => {
    startTransition(() => {
      setMounted(true);
      const saved = loadFromStorage();
      if (saved?.city || saved?.storeId) {
        setState(saved);
        syncCookies(saved); // keep cookies in sync on every mount
      } else {
        /* Try geolocation silently — if it fails or is denied, show modal */
        if (typeof navigator !== "undefined" && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const lat  = String(pos.coords.latitude);
              const long = String(pos.coords.longitude);
              try {
                const res  = await fetch("/api/nearest-store", {
                  method:  "POST",
                  headers: { "Content-Type": "application/json" },
                  body:    JSON.stringify({ lat, long }),
                });
                const data = await res.json() as { storeId: number | null };
                const next: LocationState = { city: "", storeId: data.storeId, lat, long };
                setState(next);
                saveToStorage(next);
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

  /* Lock body scroll when modal is open */
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen]);

  const updateLocation = (next: LocationState) => {
    setState(next);
    saveToStorage(next);
    setModalOpen(false);
  };

  return (
    <LocationContext.Provider
      value={{
        ...state,
        isModalOpen,
        showModal:  () => setModalOpen(true),
        hideModal:  () => setModalOpen(false),
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
