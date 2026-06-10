"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  totalItems: number;
  totalPrice: number;
  isHydrated: boolean;
  // Nuevos estados para la experiencia UI
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("liberacion_cart");
    if (savedCart) setItems(JSON.parse(savedCart));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) localStorage.setItem("liberacion_cart", JSON.stringify(items));
  }, [items, isHydrated]);

  const addItem = (newItem: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((currentItems) => {
      const existing = currentItems.find((i) => i.id === newItem.id);
      if (existing) return currentItems.map((i) => i.id === newItem.id ? { ...i, quantity: i.quantity + quantity } : i);
      return [...currentItems, { ...newItem, quantity }];
    });
  };

  const removeItem = (id: string) => setItems((items) => items.filter((i) => i.id !== id));
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return removeItem(id);
    setItems((items) => items.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, addItem, removeItem, updateQuantity, totalItems, totalPrice, isHydrated,
      isCartOpen, openCart: () => setIsCartOpen(true), closeCart: () => setIsCartOpen(false)
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
};