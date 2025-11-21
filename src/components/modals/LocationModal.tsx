"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (city: string, pincode?: string) => void;
  currentCity?: string;
}

const LocationModal = ({ isOpen, onClose, onApply, currentCity }: LocationModalProps) => {
  const [selectedCity, setSelectedCity] = useState(currentCity || "");
  const [pincode, setPincode] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [usePincode, setUsePincode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    };

    if (isCityDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCityDropdownOpen]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedCity(currentCity || "");
      setPincode("");
      setUsePincode(false);
    }
  }, [isOpen, currentCity]);

  if (!isOpen) return null;

  // Major Indian cities
  const cities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Surat",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Indore",
    "Thane",
    "Bhopal",
    "Visakhapatnam",
    "Patna",
    "Vadodara",
    "Ghaziabad",
  ];

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsCityDropdownOpen(false);
    setUsePincode(false);
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPincode(value);
    if (value.length === 6) {
      setUsePincode(true);
      setSelectedCity("");
    } else if (value.length === 0) {
      setUsePincode(false);
    }
  };

  const handleApply = () => {
    if (usePincode && pincode.length === 6) {
      onApply("", pincode);
    } else if (selectedCity) {
      onApply(selectedCity);
    }
  };

  const canApply = usePincode ? pincode.length === 6 : selectedCity.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={onClose} />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className="relative w-full max-w-[500px] md:max-w-[600px] bg-white rounded-lg md:rounded-xl shadow-2xl animate-slideIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black">
            Choose your location
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors p-1"
            aria-label="Close"
          >
            <Image
              src="/assets/header/icons/closeIcon.svg"
              alt="Close"
              width={24}
              height={24}
              className="w-5 h-5 md:w-6 md:h-6"
            />
          </button>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8">
          {/* Instructions */}
          <p className="text-sm sm:text-base text-gray-600 mb-6 text-center">
            Select a delivery location to see product availability and delivery options.
          </p>

          {/* City Dropdown */}
          <div className="mb-4">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsCityDropdownOpen(!isCityDropdownOpen);
                  setUsePincode(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
              >
                <span className={selectedCity ? "text-black" : "text-gray-500"}>
                  {selectedCity || "Select City"}
                </span>
                <Image
                  src="/assets/header/icons/arrowDownIcon.svg"
                  alt="Arrow Down"
                  width={16}
                  height={16}
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isCityDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isCityDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {cities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleCitySelect(city)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Divider with "or" text */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-500">or enter an Indian Pincode</span>
            </div>
          </div>

          {/* Pincode Input */}
          <div className="mb-6">
            <input
              type="text"
              value={pincode}
              onChange={handlePincodeChange}
              placeholder="Enter Pincode"
              maxLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400"
            />
          </div>

          {/* Apply Button */}
          <div className="flex justify-end">
            <button
              onClick={handleApply}
              disabled={!canApply}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                canApply
                  ? "bg-green-600 hover:bg-green-700 text-white hover:scale-105 active:scale-95"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;

