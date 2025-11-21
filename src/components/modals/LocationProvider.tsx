"use client";

import { createContext, useContext, useState, useEffect, startTransition, ReactNode } from "react";
import LocationModal from "./LocationModal";

interface LocationContextType {
  location: string;
  showModal: () => void;
  hideModal: () => void;
  isModalOpen: boolean;
  updateLocation: (city: string, pincode?: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within LocationProvider");
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [location, setLocation] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  // Reverse geocode coordinates to get city name
  const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
    try {
      // Using OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
        {
          headers: {
            "User-Agent": "TalliDrinks/1.0", // Required by Nominatim
          },
        }
      );

      if (!response.ok) {
        throw new Error("Reverse geocoding failed");
      }

      const data = await response.json();
      
      // Try to get city from address components
      const address = data.address;
      if (address) {
        // For Indian addresses, try different fields
        return (
          address.city ||
          address.town ||
          address.village ||
          address.county ||
          address.state_district ||
          address.state ||
          null
        );
      }

      return null;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return null;
    }
  };

  // Auto-detect location using browser geolocation
  const detectLocation = async () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser");
      return false;
    }

    setIsDetecting(true);

    return new Promise<boolean>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const city = await reverseGeocode(position.coords.latitude, position.coords.longitude);
            
            if (city) {
              setLocation(city);
              if (typeof window !== "undefined") {
                localStorage.setItem("userLocation", city);
                localStorage.setItem("locationMethod", "auto");
              }
              setIsDetecting(false);
              resolve(true);
            } else {
              setIsDetecting(false);
              resolve(false);
            }
          } catch (error) {
            console.error("Location detection error:", error);
            setIsDetecting(false);
            resolve(false);
          }
        },
        (error) => {
          console.log("Geolocation error:", error.message);
          setIsDetecting(false);
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  // Check localStorage and auto-detect on mount
  useEffect(() => {
    startTransition(() => {
      setIsMounted(true);

      if (typeof window !== "undefined") {
        const savedLocation = localStorage.getItem("userLocation");
        
        if (savedLocation) {
          setLocation(savedLocation);
          // Don't show modal if location is already saved
          setIsModalOpen(false);
        } else {
          // Try to auto-detect location
          detectLocation().then((success) => {
            if (!success) {
              // If detection fails, show modal
              setIsModalOpen(true);
            }
          });
        }
      }
    });
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

  const updateLocation = (city: string, pincode?: string) => {
    const locationValue = city || (pincode ? `Pincode: ${pincode}` : "");
    setLocation(locationValue);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("userLocation", locationValue);
      if (city) {
        localStorage.setItem("locationMethod", "manual_city");
      } else if (pincode) {
        localStorage.setItem("locationMethod", "manual_pincode");
        localStorage.setItem("userPincode", pincode);
      }
    }
    
    hideModal();
  };

  return (
    <LocationContext.Provider
      value={{
        location: location || "Select Location",
        showModal,
        hideModal,
        isModalOpen,
        updateLocation,
      }}
    >
      {children}
      {/* Only render modal after client-side hydration */}
      {isMounted && (
        <LocationModal
          isOpen={isModalOpen}
          onClose={hideModal}
          onApply={updateLocation}
          currentCity={location && !location.startsWith("Pincode:") ? location : undefined}
        />
      )}
    </LocationContext.Provider>
  );
};

