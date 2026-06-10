import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import React from "react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {/* El carrito lateral está disponible a nivel global */}
      <CartDrawer />
      
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </CartProvider>
  );
}