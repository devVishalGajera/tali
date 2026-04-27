"use client";

import ProductCarouselSection from "@/components/shared/ProductCarouselSection";
import { ProductCardItem } from "@/components/shared/ProductCard";

const products: ProductCardItem[] = [
  { id: 1, name: "Corona Extra Beer", price: "₹200.00", rating: 4.2, ratingCount: 1250, image: "/assets/images/bottles/corona.png", isNewArrival: true },
  { id: 2, name: "Corona Extra Beer", price: "₹200.00", rating: 4.2, ratingCount: 1250, image: "/assets/images/bottles/corona.png" },
  { id: 3, name: "Corona Extra Beer", price: "₹200.00", rating: 4.2, ratingCount: 1250, image: "/assets/images/bottles/corona.png" },
  { id: 4, name: "Corona Extra Beer", price: "₹200.00", rating: 4.2, ratingCount: 1250, image: "/assets/images/bottles/corona.png" },
  { id: 5, name: "Corona Extra Beer", price: "₹200.00", rating: 4.2, ratingCount: 1250, image: "/assets/images/bottles/corona.png" },
  { id: 6, name: "Corona Extra Beer", price: "₹200.00", rating: 4.2, ratingCount: 1250, image: "/assets/images/bottles/corona.png" },
  { id: 7, name: "Corona Extra Beer", price: "₹200.00", rating: 4.2, ratingCount: 1250, image: "/assets/images/bottles/corona.png" },
];

const ProductsSection = () => (
  <ProductCarouselSection
    title="Just for you, Talli Drinks"
    subtitle="A weekly set of wines you didn't know you wanted. Based on your taste, like-minded users, and the magic of deep Vivino knowledge."
    products={products}
    linkProducts={true}
  />
);

export default ProductsSection;
