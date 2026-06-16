"use client";

import { CartProvider, useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";
import { ShoppingCart, Menu, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";

function FloatingNav() {
  const { totalItems, openCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md glass-pill rounded-full px-6 py-3 md:py-4 flex justify-between items-center transition-all duration-500 hover:shadow-xl">
      <Link href="/" className="flex flex-col items-start group">
        <span className="font-playfair text-sm md:text-base font-bold text-foreground">Liberación</span>
        <span className="text-[7px] md:text-[8px] text-gold tracking-widest uppercase">Johanna Grandón</span>
      </Link>
      
      <nav className="hidden md:flex items-center space-x-6 text-[9px] font-bold tracking-[0.2em] uppercase text-foreground/60">
        <button onClick={() => document.getElementById('terapias')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-gold transition-colors">Terapias</button>
        <button onClick={() => document.getElementById('boutique')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-gold transition-colors">Boutique</button>
      </nav>

      <div className="flex items-center space-x-4">
        <button onClick={openCart} className="text-foreground hover:text-gold transition-colors relative flex items-center justify-center w-8 h-8 rounded-full bg-white/50 border border-black/5">
          <ShoppingCart size={14} strokeWidth={1.5} />
          {mounted && totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-gold text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </button>
        <Link href="/login" className="text-foreground hover:text-gold transition-colors w-8 h-8 rounded-full bg-foreground text-white flex items-center justify-center">
          <Menu size={14} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-background pt-32 pb-40 md:pb-32 px-6 relative overflow-hidden flex flex-col items-center text-center">
      <Sparkles className="text-gold mb-8 animate-pulse" size={32} strokeWidth={1} />
      <h3 className="font-playfair text-[10vw] md:text-[6vw] leading-[0.9] tracking-tighter mb-12">
        Vuelve a tu <br /><span className="text-outline-gold italic font-light">esencia.</span>
      </h3>
      <a href="https://wa.me/569XXXXXXXX" target="_blank" rel="noopener noreferrer" className="px-10 py-4 rounded-full bg-gold text-foreground font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-white transition-colors duration-500">
        Agendar Encuentro
      </a>
    </footer>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <CartDrawer />
      <div className="min-h-screen flex flex-col bg-background selection:bg-gold/30 selection:text-foreground">
        <FloatingNav />
        <main className="flex-grow flex flex-col items-center w-full">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}