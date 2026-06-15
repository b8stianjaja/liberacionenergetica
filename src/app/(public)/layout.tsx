"use client";

import { CartProvider, useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import React, { useEffect, useState } from "react";

function Header() {
  const { totalItems, openCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-purple-100 shadow-sm transition-mystic">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex flex-col items-start group">
          <span className="font-playfair text-2xl text-foreground leading-none group-hover:text-purple-600 transition-mystic">
            Johanna Grandón
          </span>
          <span className="text-[10px] text-gold tracking-[0.2em] uppercase mt-1 font-bold">
            Liberación Energética
          </span>
        </Link>
        
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-foreground transition-mystic">Inicio</Link>
          <button onClick={() => document.getElementById('terapias')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-foreground transition-mystic">Terapias</button>
          <button onClick={() => document.getElementById('testimonios')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-foreground transition-mystic">Testimonios</button>
          <button onClick={() => document.getElementById('boutique')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-foreground transition-mystic">Boutique</button>
        </nav>

        <div className="flex items-center space-x-5">
          <Link href="/login" className="text-foreground hover:text-gold transition-mystic hidden sm:block">
            <User size={20} strokeWidth={1.5} />
          </Link>
          <button onClick={openCart} className="text-foreground hover:text-gold transition-mystic relative">
            <ShoppingCart size={20} strokeWidth={1.5} />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
          <a href="https://wa.me/tunumerowhatsapp" target="_blank" rel="noopener noreferrer" className="hidden lg:inline-flex bg-foreground text-white px-6 py-2.5 rounded-full text-sm hover:bg-[#362051] transition-mystic shadow-md">
            Agenda tu sesión
          </a>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-white py-16 mt-20 rounded-t-[3rem]">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h3 className="font-playfair text-3xl md:text-4xl mb-4 text-lavender">
          Sanar es recordar quién eres en esencia.
        </h3>
        <div className="flex justify-center items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-gold"></div>
            <p className="text-gold font-light italic text-lg">~ Con amor, para tu bienestar ~</p>
            <div className="w-12 h-[1px] bg-gold"></div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12 text-sm text-purple-200">
          <span>Radiestesia</span><span className="hidden md:inline">•</span>
          <span>Péndulo Hebreo</span><span className="hidden md:inline">•</span>
          <span>Cruz de Ankh</span><span className="hidden md:inline">•</span>
          <span>Biodecodificación</span>
        </div>
        <div className="border-t border-purple-400/20 pt-8 text-xs text-purple-300">
          <p>&copy; {new Date().getFullYear()} Johanna Grandón - Liberación Energética. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <CartDrawer />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col items-center w-full">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}