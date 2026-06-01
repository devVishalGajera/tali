export interface PincodeResult {
  city: string;
  state: string;
}

export async function getCityFromPincode(pincode: string): Promise<PincodeResult | null> {
  const normalized = pincode.replace(/\D/g, "");
  if (normalized.length !== 6) return null;

  try {
    const response = await fetch(`/api/pincode/${normalized}`, { cache: "no-store" });
    if (response.status === 404) return null;
    if (!response.ok) return null;

    const data = (await response.json()) as PincodeResult | null;
    if (data?.city) return data;
    return null;
  } catch {
    return null;
  }
}
