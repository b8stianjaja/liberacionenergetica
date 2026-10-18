'use client';

import { createContext, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';

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
  isLoaded: boolean;
}

const CART_KEY = 'jg_cart';
const CART_CHANGE_EVENT = 'jg-cart-change';
const CartContext = createContext<CartContextType | undefined>(undefined);

function getCartSnapshot(): string | null {
  try {
    return window.localStorage.getItem(CART_KEY) ?? '[]';
  } catch {
    return '[]';
  }
}

function getServerCartSnapshot(): null {
  return null;
}

function subscribeToCart(onChange: () => void): () => void {
  window.addEventListener('storage', onChange);
  window.addEventListener(CART_CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CART_CHANGE_EVENT, onChange);
  };
}

function isCartItem(value: unknown): value is CartItem {
  if (value === null || typeof value !== 'object') return false;
  const item = value as Partial<CartItem>;

  return (
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    typeof item.quantity === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    (item.imageUrl === null || typeof item.imageUrl === 'string')
  );
}

function parseCart(snapshot: string | null): CartItem[] {
  if (!snapshot) return [];

  try {
    const value: unknown = JSON.parse(snapshot);
    return Array.isArray(value) ? value.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

function updateStoredCart(change: (current: CartItem[]) => CartItem[]): void {
  const items = change(parseCart(getCartSnapshot()));

  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(CART_CHANGE_EVENT));
  } catch (error) {
    console.error('No se pudo guardar el carrito en el navegador', error);
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  // useSyncExternalStore mantiene el servidor y la hidratación consistentes,
  // y escucha cambios del almacenamiento local y de otras pestañas.
  const snapshot = useSyncExternalStore(subscribeToCart, getCartSnapshot, getServerCartSnapshot);
  const items = useMemo(() => parseCart(snapshot), [snapshot]);
  const isLoaded = snapshot !== null;
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    updateStoredCart((current) => {
      const existing = current.find((item) => item.id === newItem.id);

      return existing
        ? current.map((item) => item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...newItem, quantity: 1 }];
    });

    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    updateStoredCart((current) => current.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    updateStoredCart((current) => current.map((item) => item.id === id ? { ...item, quantity } : item));
  };

  const clearCart = () => updateStoredCart(() => []);
  const toggleCart = () => setIsOpen((current) => !current);

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
      isLoaded,
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
