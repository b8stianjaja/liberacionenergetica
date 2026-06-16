"use client";

import { CartProvider, useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";
import { ShoppingCart, Menu, Heart } from "lucide-react";
import React, { useEffect, useState } from "react";

function Header() {
  const { totalItems, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-700 ease-out ${scrolled ? 'py-4 bg-white/80 backdrop-blur-xl shadow-sm' : 'py-8 bg-transparent'}`}>
      <div className="max-w-[90rem] mx-auto px-6 lg:px-12 flex justify-between items-center">
        
        <Link href="/" className="flex items-center gap-4 group">
          <Heart className="text-gold fill-transparent group-hover:fill-gold transition-all duration-500 transform group-hover:scale-110" size={32} strokeWidth={1} />
          <div className="flex flex-col">
            <span className="font-playfair text-2xl lg:text-3xl text-foreground font-medium tracking-tight">Johanna Grandón</span>
            <span className="text-[8px] lg:text-[9px] text-foreground/60 tracking-[0.3em] uppercase font-bold mt-1 group-hover:golden-rainbow-text transition-all duration-500">Liberación Energética</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex space-x-12 text-[11px] font-bold tracking-[0.2em] uppercase text-foreground/70">
          <button onClick={() => document.getElementById('terapias')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-gold transition-colors duration-300">Terapias</button>
          <button onClick={() => document.getElementById('testimonios')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-gold transition-colors duration-300">Testimonios</button>
          <button onClick={() => document.getElementById('boutique')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-gold transition-colors duration-300">Boutique</button>
        </nav>

        <div className="flex items-center space-x-6">
          <a href="https://wa.me/569XXXXXXXX" target="_blank" rel="noopener noreferrer" className="hidden lg:inline-flex bg-foreground text-white px-8 py-3.5 rounded-full text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-gold hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
            Agenda tu sesión
          </a>
          <button onClick={openCart} className="text-foreground hover:text-gold transition-all duration-500 relative hover:scale-110">
            <ShoppingCart size={24} strokeWidth={1} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                {totalItems}
              </span>
            )}
          </button>
          <button className="md:hidden text-foreground"><Menu size={28} strokeWidth={1} /></button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-lavender/30 text-foreground pt-32 pb-16 px-6 mt-20 relative overflow-hidden border-t border-white">
      <div className="max-w-[90rem] mx-auto flex flex-col items-center text-center relative z-10">
        <Heart className="text-gold mb-8 animate-pulse" size={40} strokeWidth={1} />
        <h3 className="font-playfair text-4xl md:text-6xl mb-8 tracking-tight">
          Sanar es recordar <br className="hidden md:block" />
          <span className="golden-rainbow-text italic font-light">quién eres en esencia.</span>
        </h3>
        <p className="text-foreground/60 max-w-lg mx-auto text-sm md:text-base mb-16 leading-relaxed">
          Un espacio diseñado para brindarte paz profunda, desde los más pequeños de la familia hasta los más grandes.
        </p>
        
        <div className="w-full h-[1px] bg-foreground/10 mb-12"></div>
        <div className="flex flex-col md:flex-row justify-between w-full text-[10px] tracking-widest text-foreground/50 uppercase font-bold gap-6">
          <p>&copy; {new Date().getFullYear()} Johanna Grandón. Creado en Luz.</p>
          <Link href="/login" className="hover:text-gold transition-colors">Portal de Gestión</Link>
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
        <main className="flex-grow w-full relative z-10">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}