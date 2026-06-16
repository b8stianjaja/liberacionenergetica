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
    <header id="app-header" className={`fixed w-full top-0 z-50 transition-colors duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(74,51,104,0.05)] py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-[85rem] mx-auto px-6 flex justify-between items-center">
        
        <Link href="/" className="flex items-center gap-3 group">
          <Heart className="text-gold fill-transparent group-hover:fill-gold transition-colors duration-500" size={26} strokeWidth={1.5} />
          <div className="flex flex-col">
            <span className="font-playfair text-xl md:text-2xl text-foreground font-medium tracking-tight">Johanna Grandón</span>
            <span className="text-[8px] md:text-[9px] text-foreground/60 tracking-[0.2em] uppercase font-bold mt-0.5 group-hover:text-gold transition-colors">Liberación Energética</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex space-x-10 text-[11px] font-bold tracking-widest uppercase text-foreground/70">
          <button onClick={() => document.getElementById('enfoque')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-gold transition-colors">El Enfoque</button>
          <button onClick={() => document.getElementById('terapias-slide')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-gold transition-colors">Terapias</button>
          <button onClick={() => document.getElementById('boutique')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-gold transition-colors">Boutique</button>
        </nav>

        <div className="flex items-center space-x-5">
          <button onClick={openCart} className="text-foreground hover:text-gold transition-colors relative flex items-center justify-center h-10 w-10 rounded-full hover:bg-lavender">
            <ShoppingCart size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
               <span className="absolute 1 top-1 right-1 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                {totalItems}
              </span>
            )}
          </button>
          <a href="https://wa.me/569XXXXXXXX" target="_blank" rel="noopener noreferrer" className="hidden lg:inline-flex bg-foreground text-white px-7 py-3 rounded-full text-[11px] tracking-widest font-bold uppercase hover:bg-gold transition-colors shadow-sm">
            Agendar Sesión
          </a>
          <button className="md:hidden text-foreground"><Menu size={24} strokeWidth={1.5} /></button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-background pt-24 pb-12 px-6 mt-20 text-center rounded-t-[3rem] border-t border-white">
      <div className="max-w-[85rem] mx-auto flex flex-col items-center">
        <Heart className="text-gold mb-8 fill-gold/20" size={32} strokeWidth={1} />
        <h3 className="font-playfair text-3xl md:text-5xl mb-6 tracking-tight">Sanar es recordar quién eres.</h3>
        <p className="text-white/60 max-w-md mx-auto text-sm md:text-base mb-16 leading-relaxed">
          Un espacio seguro creado para acompañarte a ti y a tu familia a recuperar la paz emocional y el bienestar natural.
        </p>
        <div className="w-full h-[1px] bg-white/10 mb-8"></div>
        <div className="flex flex-col md:flex-row justify-between items-center w-full text-[10px] tracking-widest text-white/50 uppercase font-bold gap-6">
          <p>&copy; {new Date().getFullYear()} Johanna Grandón. Creado con intención.</p>
          <Link href="/login" className="hover:text-gold transition-colors">Acceso Profesional</Link>
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
        {/* ELIMINADO EL CONTEXTO DE APILAMIENTO (z-10 relative) PARA QUE EL PRELOADER FUNCIONE */}
        <main className="flex-grow w-full">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}