/** Shared Talli Beer & Wines store details for listings, product pages, and mocks. */

import type { StoreListItem } from "@/components/stores/StoresListCard";
import type { ShopItem } from "@/components/stores/StoresShopCard";

export const TALLI_STORE_ID = 1;

export const TALLI_STORE_SLUG = "talli";

export function talliStorePath(): string {
  return `/stores/${TALLI_STORE_SLUG}`;
}

export const TALLI_STORE_IMAGE = "/assets/images/shops/talli.jpeg";

export const TALLI_STORE_NAME = "Talli Beer & Wines";

export const TALLI_STORE_ADDRESS =
  "HIRANANDANI MEADOWS, Shop no.1, amanda shopping center, Thane West, Thane, Maharashtra 400610";

export const TALLI_STORE_LOCATION = "Thane West, Maharashtra";

export const TALLI_STORE_STATE = "Maharashtra";

export const TALLI_STORE_COUNTRY = "India";

export const TALLI_STORE_HOURS = "Mon - Sat, 09:00am - 10:00pm";

export const TALLI_STORE_EXPRESS_DELIVERY = "Express delivery 60 Minute";

export const TALLI_STORE_PHONE = "+91 7779027171";

export const TALLI_STORE_DESCRIPTION =
  "Your neighborhood beer and wine shop in Thane West — curated spirits, wines, and craft beers with fast local delivery.";

export const talliStoreListItem: StoreListItem = {
  id: TALLI_STORE_ID,
  name: TALLI_STORE_NAME,
  location: TALLI_STORE_LOCATION,
  image: TALLI_STORE_IMAGE,
  amenities: ["Express delivery", "Free parking"],
  description: TALLI_STORE_DESCRIPTION,
  storeRating: 4.74,
  deliveryRating: 4.9,
  deliveryAvailable: true,
  isPremium: true,
};

export const talliShopItem: ShopItem = {
  id: TALLI_STORE_ID,
  name: TALLI_STORE_NAME,
  address: TALLI_STORE_LOCATION,
  rating: 4.7,
  image: TALLI_STORE_IMAGE,
  logo: TALLI_STORE_IMAGE,
};
