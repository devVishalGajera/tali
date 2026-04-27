"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface CartProduct {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  image: string;
  size?: string;
  quantity: number;
}

interface CartItem extends CartProduct {}

interface CartContextType {
  items: CartItem[];
  lastAdded: CartProduct | null;
  isModalOpen: boolean;
  isDrawerOpen: boolean;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (id: number) => void;
  closeModal: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 101,
      name: "The Wrangler Zinfandel",
      price: "₹2,356",
      priceValue: 2356,
      image: "/assets/images/bottles/single-bottle.png",
      size: "750ml",
      quantity: 2,
    },
    {
      id: 102,
      name: "Burgundy Red Wine",
      price: "₹1,899",
      priceValue: 1899,
      image: "/assets/images/bottles/single-bottle.png",
      size: "750ml",
      quantity: 1,
    },
    {
      id: 103,
      name: "Glen Scotia 18 Year",
      price: "₹4,200",
      priceValue: 4200,
      image: "/assets/images/bottles/single-bottle.png",
      size: "1L",
      quantity: 1,
    },
    {
      id: 104,
      name: "Bombay Sapphire Gin",
      price: "₹3,150",
      priceValue: 3150,
      image: "/assets/images/bottles/single-bottle.png",
      size: "700ml",
      quantity: 2,
    },
  ]);
  const [lastAdded, setLastAdded]     = useState<CartProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const addToCart = useCallback((product: CartProduct) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setLastAdded(product);
    setIsModalOpen(true);
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const closeModal  = useCallback(() => setIsModalOpen(false), []);
  const openDrawer  = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  return (
    <CartContext.Provider
      value={{ items, lastAdded, isModalOpen, isDrawerOpen, addToCart, removeFromCart, closeModal, openDrawer, closeDrawer }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
