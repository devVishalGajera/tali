"use client";

import { createContext, useContext, useState, useEffect, startTransition, ReactNode } from "react";
import AgeVerificationModal from "./AgeVerificationModal";

interface AgeVerificationContextType {
  showModal: () => void;
  hideModal: () => void;
  isModalOpen: boolean;
}

const AgeVerificationContext = createContext<AgeVerificationContextType | undefined>(undefined);

export const useAgeVerification = () => {
  const context = useContext(AgeVerificationContext);
  if (!context) {
    throw new Error("useAgeVerification must be used within AgeVerificationProvider");
  }
  return context;
};

interface AgeVerificationProviderProps {
  children: ReactNode;
}

export const AgeVerificationProvider = ({ children }: AgeVerificationProviderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Check localStorage on mount and set states (client-side only)
  useEffect(() => {
    // Use startTransition to batch state updates
    startTransition(() => {
      setIsMounted(true);

      if (typeof window !== "undefined") {
        const verified = localStorage.getItem("ageVerified") === "true";
        setIsVerified(verified);
        setIsModalOpen(!verified);
      }
    });
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen && !isVerified) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, isVerified]);

  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

  const handleAgree = () => {
    // Store agreement in localStorage (client-side only)
    if (typeof window !== "undefined") {
      localStorage.setItem("ageVerified", "true");
    }
    setIsVerified(true);
    hideModal();
  };

  const handleDecline = () => {
    // Handle decline - could redirect or show message
    hideModal();
    // Optionally redirect or show a message
  };

  return (
    <AgeVerificationContext.Provider value={{ showModal, hideModal, isModalOpen }}>
      {children}
      {/* Only render modal after client-side hydration */}
      {isMounted && (
        <AgeVerificationModal
          isOpen={isModalOpen && !isVerified}
          onAgree={handleAgree}
          onDecline={handleDecline}
        />
      )}
    </AgeVerificationContext.Provider>
  );
};
