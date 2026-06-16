"use client";

import { CartProvider, useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";
import { ShoppingCart, User, Menu } from "lucide-react";
import React, { useEffect, useState } from "react";

function Header() {
  const { totalItems, openCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolled ? 'py-4 glass-panel shadow-sm' : 'py-8 bg-transparent'}`}>
      <div className="max-w-[90rem] mx-auto px-6 lg:px-12 flex justify-between items-center">
        
        <Link href="/" className="flex flex-col items-start group relative z-10 hover-trigger">
          <span className="font-playfair text-2xl lg:text-3xl text-foreground tracking-tight">Johanna Grandón</span>
          <span className="text-[9px] lg:text-[10px] text-gold tracking-[0.3em] uppercase font-bold mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">Liberación Energética</span>
        </Link>
        
        <nav className="hidden md:flex space-x-12 text-[11px] font-bold tracking-[0.2em] uppercase text-foreground/70">
          <button onClick={() => document.getElementById('terapias')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-gold transition-colors hover-trigger">Terapias</button>
          <button onClick={() => document.getElementById('testimonios')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-gold transition-colors hover-trigger">Testimonios</button>
          <button onClick={() => document.getElementById('boutique')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-gold transition-colors hover-trigger">Boutique</button>
        </nav>

        <div className="flex items-center space-x-6 lg:space-x-8 relative z-10">
          <Link href="/login" className="text-foreground hover:text-gold transition-colors hidden sm:block hover-trigger">
            <User size={20} strokeWidth={1} />
          </Link>
          <button onClick={openCart} className="text-foreground hover:text-gold transition-colors relative hover-trigger">
            <ShoppingCart size={20} strokeWidth={1} />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
          <button className="md:hidden text-foreground"><Menu size={24} strokeWidth={1} /></button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-white py-24 mt-32 rounded-t-[4rem] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
      <div className="max-w-[90rem] mx-auto px-6 lg:px-12 text-center relative z-10">
        <h3 className="font-playfair text-4xl md:text-6xl lg:text-8xl mb-8 text-lavender opacity-90 tracking-tight">
          Sanar es recordar.
        </h3>
        <div className="flex justify-center items-center gap-6 mb-16">
            <div className="w-24 h-[1px] bg-gold/50"></div>
            <p className="text-gold font-light italic text-xl md:text-2xl">~ Vuelve a tu esencia ~</p>
            <div className="w-24 h-[1px] bg-gold/50"></div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-20 text-[10px] md:text-xs tracking-[0.2em] uppercase text-purple-200/60 font-bold">
          <span className="hover:text-gold transition-colors cursor-pointer">Radiestesia</span>
          <span className="hover:text-gold transition-colors cursor-pointer">Péndulo Hebreo</span>
          <span className="hover:text-gold transition-colors cursor-pointer">Cruz de Ankh</span>
          <span className="hover:text-gold transition-colors cursor-pointer">Biodecodificación</span>
        </div>
        <div className="border-t border-white/10 pt-8 text-[10px] tracking-widest text-purple-300/50 uppercase">
          <p>&copy; {new Date().getFullYear()} Johanna Grandón. Creado con intención.</p>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <CartDrawer />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow flex flex-col items-center w-full">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}