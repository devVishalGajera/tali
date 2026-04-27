"use client";

import ProductCarouselSection from "@/components/shared/ProductCarouselSection";
import { ProductCardItem } from "@/components/shared/ProductCard";

const bestsellerProducts: ProductCardItem[] = [
  { id: 1, name: "Corona Extra Beer", price: "₹200.00", rating: 4.2, ratingCount: 1250, image: "/assets/images/bottles/corona.png", isNewArrival: true },
  { id: 2, name: "Corona Extra Beer", price: "₹200.00", rating: 4.2, ratingCount: 1250, image: "/assets/images/bottles/corona.png" },
  { id: 3, name: "Corona Extra Beer", price: "₹200.00", rating: 4.2, ratingCount: 1250, image: "/assets/images/bottles/corona.png" },
  { id: 4, name: "Corona Extra Beer", price: "₹200.00", rating: 4.2, ratingCount: 1250, image: "/assets/images/bottles/corona.png" },
  { id: 5, name: "Corona Extra Beer", price: "₹200.00", rating: 4.2, ratingCount: 1250, image: "/assets/images/bottles/corona.png" },
  { id: 6, name: "Corona Extra Beer", price: "₹200.00", rating: 4.2, ratingCount: 1250, image: "/assets/images/bottles/corona.png" },
  { id: 7, name: "Corona Extra Beer", price: "₹200.00", rating: 4.2, ratingCount: 1250, image: "/assets/images/bottles/corona.png" },
];

const BestsellerSection = () => (
  <ProductCarouselSection
    title="Bestsellers in California"
    subtitle="Top-selling wines in Californian right now."
    products={bestsellerProducts}
    linkProducts={false}
  />
);

export default BestsellerSection;
