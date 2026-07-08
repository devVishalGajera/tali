import type { StoreDetail } from "./storeDetailTypes";
import { TALLI_STORE_SOCIAL } from "@/lib/social-links";
import {
  TALLI_STORE_ADDRESS,
  TALLI_STORE_DESCRIPTION,
  TALLI_STORE_EXPRESS_DELIVERY,
  TALLI_STORE_HOURS,
  TALLI_STORE_IMAGE,
  TALLI_STORE_NAME,
  TALLI_STORE_PHONE,
} from "@/lib/store/talli-store";

export const mockStore: StoreDetail = {
  name: TALLI_STORE_NAME,
  description: TALLI_STORE_DESCRIPTION,
  heroImage: TALLI_STORE_IMAGE,
  isVerified: true,
  isPremium: true,
  ratings: [
    { label: "Store Rating", score: 4.7, desc: "Overall customer satisfaction", icon: "/assets/icons/store-rating.svg" },
    { label: "Delivery Rating", score: 4.9, desc: "Speed and reliability of delivery", icon: "/assets/icons/delivery-rating.svg" },
    { label: "Staff Expertise", score: 4.5, desc: "Knowledge and helpfulness of staff", icon: "/assets/icons/staff-rating.svg" },
  ],
  contact: {
    phone: TALLI_STORE_PHONE,
    whatsapp: TALLI_STORE_PHONE,
    website: "www.tallidrinks.com",
    radius: "5 km",
    delivery: "Available",
    estTime: TALLI_STORE_EXPRESS_DELIVERY,
    parking: "Available",
  },
  hours: [
    { days: "Monday-Saturday", time: "09:00 AM - 10:00 PM" },
  ],
  categories: [
    { name: "Beer", image: "/assets/icons/cateogories/Beer.png" },
    { name: "Wine", image: "/assets/icons/cateogories/Wine.png" },
    { name: "Liquor", image: "/assets/icons/cateogories/Liquor.png" },
  ],
  payments: [
    { name: "MasterCard", icon: "/assets/icons/payment-methods/MasterCard.svg" },
    { name: "PayPal", icon: "/assets/icons/payment-methods/PayPal.svg" },
    { name: "eBay", icon: "/assets/icons/payment-methods/eBay.svg" },
    { name: "Google Pay", icon: "/assets/icons/payment-methods/Google Pay.svg" },
    { name: "monobank", icon: "/assets/icons/payment-methods/monobank.svg" },
    { name: "Discover", icon: "/assets/icons/payment-methods/Discover.svg" },
    { name: "Western Union", icon: "/assets/icons/payment-methods/Western Union.svg" },
    { name: "Payoneer", icon: "/assets/icons/payment-methods/Payoneer.svg" },
  ],
  address: TALLI_STORE_ADDRESS,
  social: TALLI_STORE_SOCIAL,
  photos: [
    { label: "Store Exterior", image: TALLI_STORE_IMAGE },
    { label: "Store Front", image: TALLI_STORE_IMAGE },
    { label: "Wine Section", image: TALLI_STORE_IMAGE },
    { label: "Liquor Section", image: TALLI_STORE_IMAGE },
  ],
  menuTabs: ["Beer", "Wine", "Liquor"],
  menuItems: Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: "Wine Product",
    price: "₹2,952",
  })),
  reviews: [
    {
      name: "Lorem ipsum dolor",
      rating: 4,
      date: "01 Jun 2025",
      text: "Lorem ipsum dolor sit amet consectetur. Nec et semper dignissim mauris tristique quisque. Non morbi consequat euismod odio pharetra consequat amet semper. Tellus id.",
      avatar: TALLI_STORE_IMAGE,
    },
    {
      name: "Lorem ipsum dolor",
      rating: 4,
      date: "01 Jun 2025",
      text: "Lorem ipsum dolor sit amet consectetur. Nec et semper dignissim mauris tristique quisque. Non morbi consequat euismod odio pharetra consequat amet semper. Tellus id.",
      avatar: TALLI_STORE_IMAGE,
    },
  ],
};
