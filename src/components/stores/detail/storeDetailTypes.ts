export interface StoreRating {
  label: string;
  score: number;
  desc: string;
  icon: string; // path to SVG
}

export interface StoreHours {
  days: string;
  time: string;
}

export interface StoreCategory {
  name: string;
  image: string;
}

export interface StorePhoto {
  label: string;
  image: string;
}

export interface MenuItem {
  id: number;
  name: string;
  price: string;
}

export interface StoreReview {
  name: string;
  rating: number;
  date: string;
  text: string;
  avatar: string;
}

export interface StoreDetail {
  name: string;
  description: string;
  heroImage: string;
  isVerified: boolean;
  isPremium: boolean;
  ratings: StoreRating[];
  contact: {
    phone: string;
    whatsapp: string;
    website: string;
    radius: string;
    delivery: string;
    estTime: string;
    parking: string;
  };
  hours: StoreHours[];
  categories: StoreCategory[];
  payments: { name: string; icon: string }[];
  address: string;
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  photos: StorePhoto[];
  menuTabs: string[];
  menuItems: MenuItem[];
  reviews: StoreReview[];
}
