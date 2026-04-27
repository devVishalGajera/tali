import type { StoreDetail } from "./storeDetailTypes";

export const mockStore: StoreDetail = {
  name: "The Grand Cellar",
  description:
    "A premium wine and liquor store offering a curated selection of fine spirits, wines, and craft beers from around the world. Experience exceptional service and expert recommendations.",
  heroImage: "/assets/images/banner/store_banner.png",
  isVerified: true,
  isPremium: true,
  ratings: [
    { label: "Store Rating",    score: 4.7, desc: "Overall customer satisfaction",    icon: "/assets/icons/store-rating.svg" },
    { label: "Delivery Rating", score: 4.9, desc: "Speed and reliability of delivery", icon: "/assets/icons/delivery-rating.svg" },
    { label: "Staff Expertise", score: 4.5, desc: "Knowledge and helpfulness of staff", icon: "/assets/icons/staff-rating.svg" },
  ],
  contact: {
    phone:    "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    website:  "www.grandcellar.com",
    radius:   "5 km",
    delivery: "Available",
    estTime:  "30 - 60 Minutes",
    parking:  "Available",
  },
  hours: [
    { days: "Monday-Saturday", time: "10:00 AM - 10:00 PM" },
    { days: "Sunday",          time: "12:00 AM - 08:00 PM" },
  ],
  categories: [
    { name: "Beer",   image: "/assets/icons/cateogories/Beer.png" },
    { name: "Wine",   image: "/assets/icons/cateogories/Wine.png" },
    { name: "Liquor", image: "/assets/icons/cateogories/Liquor.png" },
  ],
  payments: [
    { name: "MasterCard",    icon: "/assets/icons/payment-methods/MasterCard.svg" },
    { name: "PayPal",        icon: "/assets/icons/payment-methods/PayPal.svg" },
    { name: "eBay",          icon: "/assets/icons/payment-methods/eBay.svg" },
    { name: "Google Pay",    icon: "/assets/icons/payment-methods/Google Pay.svg" },
    { name: "monobank",      icon: "/assets/icons/payment-methods/monobank.svg" },
    { name: "Discover",      icon: "/assets/icons/payment-methods/Discover.svg" },
    { name: "Western Union", icon: "/assets/icons/payment-methods/Western Union.svg" },
    { name: "Payoneer",      icon: "/assets/icons/payment-methods/Payoneer.svg" },
  ],
  address: "123, Wine Street, Bandra West, Mumbai, Maharashtra 400050",
  social: {
    facebook:  "#",
    instagram: "#",
    twitter:   "#",
    youtube:   "#",
  },
  photos: [
    { label: "Store Interior", image: "/assets/images/banner/store_banner.png" },
    { label: "Store Exterior", image: "/assets/images/banner/store_banner.png" },
    { label: "Wine Section",   image: "/assets/images/banner/store_banner.png" },
    { label: "Liquor Section", image: "/assets/images/banner/store_banner.png" },
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
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Lorem ipsum dolor",
      rating: 4,
      date: "01 Jun 2025",
      text: "Lorem ipsum dolor sit amet consectetur. Nec et semper dignissim mauris tristique quisque. Non morbi consequat euismod odio pharetra consequat amet semper. Tellus id.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  ],
};
