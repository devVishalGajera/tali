"use client";

import { useEffect, useState } from "react";
import { useLocation } from "@/components/modals/LocationProvider";

/** Avoid hydration mismatch: server and first client paint always show the same label. */
export default function LocationCityLabel() {
  const { city } = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>Select</>;
  }

  return <>{city || "Select"}</>;
}
