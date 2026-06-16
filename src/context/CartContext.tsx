'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
};

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleCart: () => void;
  itemsCount: number;
  isLoaded: boolean; // NUEVO: Evita errores de hidratación en Next.js
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // Rastrea si se cargó el localStorage

  // Cargar desde localStorage al montar (Solo en el cliente)
  useEffect(() => {
    const savedCart = localStorage.getItem('jg_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from local storage', error);
      }
    }
    setIsLoaded(true); // Indica que ya podemos renderizar cantidades reales de forma segura
  }, []);

  // Guardar en localStorage cada vez que cambien los items
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('jg_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      if (existing) {
        return prev.map((item) => item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
    setIsOpen(true); // Abre el carrito automáticamente al añadir
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, quantity } : item));
  };

  const clearCart = () => setItems([]);
  const toggleCart = () => setIsOpen((prev) => !prev);
  
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart, 
      total, 
      isOpen, 
      setIsOpen, 
      toggleCart, 
      itemsCount,
      isLoaded 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
};