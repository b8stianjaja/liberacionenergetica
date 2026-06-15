"use client";

import { CartProvider, useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";
import { ShoppingCart, User, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";

function Header() {
  const { totalItems, openCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="w-full glass-panel sticky top-0 z-50 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        
        <Link href="/" className="flex flex-col items-start group relative">
          <Sparkles className="absolute -left-5 -top-2 w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="font-playfair text-2xl text-foreground leading-none group-hover:text-gold transition-colors duration-500">
            Johanna Grandón
          </span>
          <span className="text-[10px] text-gold tracking-[0.2em] uppercase mt-1 font-bold">
            Liberación Energética
          </span>
        </Link>
        
        <nav className="hidden md:flex space-x-10 text-[13px] font-bold tracking-widest uppercase text-gray-500">
          <Link href="/" className="hover:text-gold transition-colors duration-300">Inicio</Link>
          <button onClick={() => document.getElementById('terapias')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-gold transition-colors duration-300">Terapias</button>
          <button onClick={() => document.getElementById('testimonios')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-gold transition-colors duration-300">Testimonios</button>
          <button onClick={() => document.getElementById('boutique')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-gold transition-colors duration-300">Boutique</button>
        </nav>

        <div className="flex items-center space-x-6">
          <Link href="/login" className="text-foreground hover:text-gold transition-colors duration-300 hidden sm:block">
            <User size={20} strokeWidth={1.5} />
          </Link>
          <button onClick={openCart} className="text-foreground hover:text-gold transition-colors duration-300 relative group">
            <ShoppingCart size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-300" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-md shadow-gold/30">
                {totalItems}
              </span>
            )}
          </button>
          <a href="https://wa.me/569XXXXXXXX" target="_blank" rel="noopener noreferrer" 
             className="hidden lg:inline-flex relative overflow-hidden group bg-foreground text-white px-6 py-2.5 rounded-full text-sm shadow-lg shadow-purple-900/20">
            <span className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/30 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
            <span className="relative">Agenda tu sesión</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative bg-foreground text-white pt-24 pb-12 mt-20 rounded-t-[3rem] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
        <h3 className="font-playfair text-4xl md:text-5xl mb-6 text-lavender font-light">
          Sanar es recordar <br/> <span className="text-gold italic">quién eres en esencia.</span>
        </h3>
        <div className="flex justify-center items-center gap-4 mb-12">
            <div className="w-16 h-[1px] bg-gold/50"></div>
            <Sparkles className="text-gold w-5 h-5" />
            <div className="w-16 h-[1px] bg-gold/50"></div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-16 text-sm text-purple-200 tracking-widest uppercase font-bold text-[10px]">
          <span className="hover:text-gold cursor-pointer transition-colors">Radiestesia</span>
          <span className="hover:text-gold cursor-pointer transition-colors">Péndulo Hebreo</span>
          <span className="hover:text-gold cursor-pointer transition-colors">Cruz de Ankh</span>
          <span className="hover:text-gold cursor-pointer transition-colors">Biodecodificación</span>
        </div>
        <div className="border-t border-white/10 pt-8 text-xs text-purple-300/60 flex flex-col md:flex-row justify-between">
          <p>&copy; {new Date().getFullYear()} Johanna Grandón. Liberación Energética.</p>
          <p>Hecho con amor y luz.</p>
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
        <main className="flex-grow flex flex-col items-center w-full relative">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}