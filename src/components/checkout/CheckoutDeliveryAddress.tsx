"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createAddressApi,
  updateAddressApi,
  getAddressesApi,
  deleteAddressApi,
  setDefaultAddressApi,
  parseAddressesFromApi,
  extractAddressId,
  type UserAddress,
} from "@/lib/api/address";

const inputClass =
  "w-full border border-[#E8E8E8] rounded-xl px-3 py-2.5 text-sm text-[#1D1D1D] placeholder-[#1D1D1D40] outline-none focus:border-[#006B4D] focus:ring-2 focus:ring-[#006B4D]/10 transition-colors";

const SAVE_AS_OPTIONS = ["Home", "Work", "Other"] as const;

const LocationPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1D1D1D] shrink-0">
    <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const EmptyAddressIllustration = () => (
  <svg width="120" height="88" viewBox="0 0 120 88" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto opacity-70" aria-hidden>
    <rect x="8" y="42" width="18" height="36" rx="2" stroke="#B0B0B0" strokeWidth="1.5" />
    <rect x="30" y="28" width="22" height="50" rx="2" stroke="#B0B0B0" strokeWidth="1.5" />
    <rect x="56" y="36" width="20" height="42" rx="2" stroke="#B0B0B0" strokeWidth="1.5" />
    <rect x="80" y="44" width="16" height="34" rx="2" stroke="#B0B0B0" strokeWidth="1.5" />
    <path d="M60 8C48 8 38 18 38 30c0 14 22 38 22 38s22-24 22-38c0-12-10-22-22-22z" fill="#E8E8E8" stroke="#9CA3AF" strokeWidth="1.5" />
    <circle cx="60" cy="30" r="6" fill="#fff" stroke="#9CA3AF" strokeWidth="1.5" />
  </svg>
);

interface AddressFormState {
  address: string;
  city: string;
  house_no: string;
  landmark: string;
  save_as: string;
}

const emptyForm = (cityDefault: string): AddressFormState => ({
  address: "",
  city: cityDefault,
  house_no: "",
  landmark: "",
  save_as: "Home",
});

interface FormCoords {
  latitude: string;
  longitude: string;
}

const emptyCoords = (): FormCoords => ({ latitude: "", longitude: "" });

const coordsFromProps = (lat?: number | null, long?: number | null): FormCoords => ({
  latitude: lat != null ? String(lat) : "",
  longitude: long != null ? String(long) : "",
});

async function reverseGeocode(lat: string, lon: string): Promise<{
  address: string;
  city: string;
  house_no: string;
  landmark: string;
}> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
    { headers: { "User-Agent": "TalliDrinks/1.0" } },
  );
  const data = await res.json();
  const addr = (data?.address ?? {}) as Record<string, string>;

  const city =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.suburb ||
    addr.county ||
    addr.state_district ||
    "";

  const road = [addr.house_number, addr.road, addr.neighbourhood, addr.suburb]
    .filter(Boolean)
    .join(", ");

  const display = data?.display_name ? String(data.display_name).split(",").slice(0, 4).join(", ") : road;

  return {
    address: road || display || "",
    city,
    house_no: addr.house_number ?? "",
    landmark: addr.amenity || addr.landmark || "",
  };
}

interface Props {
  token: string;
  defaultCity?: string;
  latitude?: number | null;
  longitude?: number | null;
  selectedId: number | null;
  onSelectedIdChange: (id: number | null) => void;
}

const CheckoutDeliveryAddress = ({
  token,
  defaultCity = "",
  latitude,
  longitude,
  selectedId,
  onSelectedIdChange,
}: Props) => {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AddressFormState>(() => emptyForm(defaultCity));
  const [formCoords, setFormCoords] = useState<FormCoords>(() => coordsFromProps(latitude, longitude));
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    try {
      const res = await getAddressesApi({ token });
      if (res.code !== 1) {
        setAddresses([]);
        setActionError(res.message || "Could not load addresses.");
        onSelectedIdChange(null);
        return;
      }
      const list = parseAddressesFromApi(res.data);
      setAddresses(list);
      if (list.length === 0) onSelectedIdChange(null);
    } catch {
      setAddresses([]);
      setActionError("Could not load addresses. Please try again.");
      onSelectedIdChange(null);
    } finally {
      setLoading(false);
    }
  }, [token, onSelectedIdChange]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  useEffect(() => {
    if (loading || addresses.length === 0) return;
    if (selectedId != null && addresses.some((a) => a.id === selectedId)) return;
    const preferred = addresses.find((a) => a.is_default) ?? addresses[0];
    onSelectedIdChange(preferred.id);
  }, [addresses, loading, selectedId, onSelectedIdChange]);

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm(defaultCity));
    setFormCoords(coordsFromProps(latitude, longitude));
    setShowForm(true);
    setActionError(null);
  };

  const openEditForm = (addr: UserAddress) => {
    setEditingId(addr.id);
    setForm({
      address: addr.address,
      city: addr.city || defaultCity,
      house_no: addr.house_no ?? "",
      landmark: addr.landmark ?? "",
      save_as: addr.save_as ?? "Home",
    });
    setFormCoords({
      latitude: addr.latitude ?? "",
      longitude: addr.longitude ?? "",
    });
    setShowForm(true);
    setActionError(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm(defaultCity));
    setFormCoords(emptyCoords());
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setActionError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setActionError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = String(pos.coords.latitude);
        const lon = String(pos.coords.longitude);
        setFormCoords({ latitude: lat, longitude: lon });
        try {
          const parsed = await reverseGeocode(lat, lon);
          setForm((f) => ({
            ...f,
            address: parsed.address || f.address,
            city: parsed.city || f.city || defaultCity,
            house_no: parsed.house_no || f.house_no,
            landmark: parsed.landmark || f.landmark,
          }));
        } catch {
          setActionError("Location detected. Please confirm address fields before saving.");
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) {
          setActionError("Location access denied. Allow location in browser settings or enter address manually.");
        } else {
          setActionError("Could not detect your location. Please try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  };

  const handleSaveForm = async () => {
    if (!form.address.trim()) {
      setActionError("Please enter street address.");
      return;
    }
    if (!form.city.trim()) {
      setActionError("Please enter city.");
      return;
    }
    if (!formCoords.latitude.trim() || !formCoords.longitude.trim()) {
      setActionError("Please use current location or ensure latitude and longitude are set.");
      return;
    }

    setSaving(true);
    setActionError(null);
    const coords = {
      latitude: formCoords.latitude.trim(),
      longitude: formCoords.longitude.trim(),
    };

    try {
      const res = editingId
        ? await updateAddressApi({
            token,
            id: editingId,
            address: form.address.trim(),
            city: form.city.trim(),
            house_no: form.house_no.trim(),
            landmark: form.landmark.trim(),
            save_as: form.save_as,
            ...coords,
          })
        : await createAddressApi({
            token,
            address: form.address.trim(),
            city: form.city.trim(),
            house_no: form.house_no.trim(),
            landmark: form.landmark.trim(),
            save_as: form.save_as,
            ...coords,
          });

      if (res.code !== 1) {
        setActionError(res.message || "Could not save address.");
        return;
      }

      const newId = extractAddressId(res.data);
      closeForm();
      await loadAddresses();
      if (newId) onSelectedIdChange(newId);
      else if (editingId) onSelectedIdChange(editingId);
    } catch {
      setActionError("Could not save address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this address?")) return;
    setBusyId(id);
    setActionError(null);
    try {
      const res = await deleteAddressApi({ token, id });
      if (res.code !== 1) {
        setActionError(res.message || "Could not delete address.");
        return;
      }
      if (selectedId === id) onSelectedIdChange(null);
      await loadAddresses();
    } catch {
      setActionError("Could not delete address.");
    } finally {
      setBusyId(null);
    }
  };

  const handleSetDefault = async (id: number) => {
    setBusyId(id);
    setActionError(null);
    try {
      const res = await setDefaultAddressApi({ token, id });
      if (res.code !== 1) {
        setActionError(res.message || "Could not set default address.");
        return;
      }
      onSelectedIdChange(id);
      await loadAddresses();
    } catch {
      setActionError("Could not set default address.");
    } finally {
      setBusyId(null);
    }
  };

  const formatAddressLine = (addr: UserAddress) => {
    const parts = [
      addr.house_no,
      addr.address,
      addr.landmark ? `Near ${addr.landmark}` : "",
      addr.city,
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="rounded-2xl border border-[#E8E8E8] bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <LocationPinIcon />
        <h2 className="text-base font-bold text-[#1D1D1D]">Delivery Address</h2>
      </div>

      {actionError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
          {actionError}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-[#1D1D1D80] py-8 text-center">Loading addresses…</p>
      ) : showForm ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm font-semibold text-[#1D1D1D]">
              {editingId ? "Edit address" : "Add new address"}
            </p>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={locating || saving}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-[#006B4D] text-[#006B4D] text-sm font-semibold rounded-xl hover:bg-[#006B4D08] disabled:opacity-50 transition-colors shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
              {locating ? "Detecting location…" : "Use current location"}
            </button>
          </div>
          {formCoords.latitude && formCoords.longitude && (
            <p className="text-xs text-[#006B4D]">
              Location set ({Number(formCoords.latitude).toFixed(4)}, {Number(formCoords.longitude).toFixed(4)})
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">Label</label>
              <select
                value={form.save_as}
                onChange={(e) => setForm((f) => ({ ...f, save_as: e.target.value }))}
                className={inputClass}
              >
                {SAVE_AS_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">House / flat no.</label>
              <input
                type="text"
                value={form.house_no}
                onChange={(e) => setForm((f) => ({ ...f, house_no: e.target.value }))}
                className={inputClass}
                placeholder="e.g. C/9"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">Street address</label>
              <textarea
                rows={2}
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className={`${inputClass} resize-none`}
                placeholder="Building, street, area"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className={inputClass}
                placeholder="City"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1D1D1D] mb-1.5">Landmark</label>
              <input
                type="text"
                value={form.landmark}
                onChange={(e) => setForm((f) => ({ ...f, landmark: e.target.value }))}
                className={inputClass}
                placeholder="Optional — near…"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSaveForm}
              disabled={saving || locating}
              className="px-5 py-2.5 bg-[#006B4D] hover:bg-[#005a3f] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {saving ? "Saving…" : editingId ? "Update address" : "Save address"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="px-5 py-2.5 border border-[#E8E8E8] text-sm font-semibold text-[#1D1D1D] rounded-xl hover:bg-[#FAFAFA] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-4">
          <EmptyAddressIllustration />
          <p className="text-sm font-bold text-[#1D1D1D] mt-4">No delivery address added yet</p>
          <p className="text-xs text-[#1D1D1D80] mt-1 mb-5">Add a new address to continue</p>
          <button
            type="button"
            onClick={openAddForm}
            className="w-full max-w-sm mx-auto py-3.5 bg-[#006B4D] hover:bg-[#005a3f] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            + Add New Address
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-[#1D1D1D80]">Select a delivery address for this order</p>
          {addresses.map((addr) => {
            const selected = selectedId === addr.id;
            const busy = busyId === addr.id;
            return (
              <div
                key={addr.id}
                className={`relative rounded-xl border p-4 pr-24 transition-colors ${
                  selected ? "border-[#006B4D] bg-[#006B4D08]" : "border-[#E8E8E8] bg-[#FAFAFA]"
                }`}
              >
                {addr.is_default && (
                  <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wide text-[#006B4D] bg-white border border-[#006B4D30] px-2 py-0.5 rounded-full shadow-sm">
                    Default
                  </span>
                )}
                <label className="flex gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="checkout-address"
                    checked={selected}
                    onChange={() => onSelectedIdChange(addr.id)}
                    className="mt-1 shrink-0 accent-[#006B4D]"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-[#1D1D1D] block mb-1">
                      {addr.save_as ?? "Home"}
                    </span>
                    <p className="text-sm text-[#1D1D1D80] leading-relaxed">{formatAddressLine(addr)}</p>
                  </div>
                </label>
                <div className="flex flex-wrap gap-2 mt-3 pl-7">
                  <button
                    type="button"
                    onClick={() => openEditForm(addr)}
                    disabled={busy}
                    className="text-xs font-semibold text-[#006B4D] hover:underline disabled:opacity-50"
                  >
                    Edit
                  </button>
                  {!addr.is_default && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(addr.id)}
                      disabled={busy}
                      className="text-xs font-semibold text-[#1D1D1D80] hover:text-[#1D1D1D] disabled:opacity-50"
                    >
                      {busy ? "…" : "Set as default"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(addr.id)}
                    disabled={busy}
                    className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
          <button
            type="button"
            onClick={openAddForm}
            className="w-full py-3 border-2 border-dashed border-[#E8E8E8] text-sm font-semibold text-[#006B4D] rounded-xl hover:border-[#006B4D40] hover:bg-[#006B4D06] transition-colors"
          >
            + Add New Address
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutDeliveryAddress;
