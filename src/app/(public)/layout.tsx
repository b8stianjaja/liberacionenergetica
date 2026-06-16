"use client";

import { CartProvider, useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";
import { ShoppingCart, Menu, Heart } from "lucide-react";
import React, { useEffect, useState } from "react";

function Header() {
  const { totalItems, openCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-white/95 backdrop-blur-md shadow-sm' : 'py-6 bg-white/80 backdrop-blur-sm'}`}>
      <div className="max-w-[85rem] mx-auto px-6 flex justify-between items-center">
        
        <Link href="/" className="flex flex-col items-start group">
          <span className="font-playfair text-2xl text-foreground font-semibold">Johanna Grandón</span>
          <span className="text-[10px] text-gold tracking-widest uppercase font-bold mt-1">Liberación Energética</span>
        </Link>
        
        {/* Navegación Clara y Legible */}
        <nav className="hidden md:flex space-x-10 text-[13px] font-bold tracking-wider uppercase text-foreground/80">
          <button onClick={() => document.getElementById('terapias')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-gold btn-transition">Terapias</button>
          <button onClick={() => document.getElementById('testimonios')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-gold btn-transition">Testimonios</button>
          <button onClick={() => document.getElementById('boutique')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-gold btn-transition">Boutique</button>
        </nav>

        <div className="flex items-center space-x-6">
          <a href="https://wa.me/569XXXXXXXX" target="_blank" rel="noopener noreferrer" className="hidden lg:inline-flex bg-foreground text-white px-6 py-2.5 rounded-full text-sm hover:bg-gold btn-transition shadow-md">
            Agendar Sesión
          </a>
          <button onClick={openCart} className="text-foreground hover:text-gold btn-transition relative flex items-center gap-2">
            <ShoppingCart size={22} strokeWidth={1.5} />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
                {totalItems}
              </span>
            )}
          </button>
          <button className="md:hidden text-foreground p-1"><Menu size={26} strokeWidth={1.5} /></button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-background pt-24 pb-12 px-6 mt-20 rounded-t-[3rem] text-center">
      <div className="max-w-[85rem] mx-auto flex flex-col items-center">
        <Heart className="text-gold mb-6" size={32} strokeWidth={1.5} />
        <h3 className="font-playfair text-3xl md:text-5xl mb-8 text-white">
          Acompañando tu proceso <br />
          <span className="text-gold italic font-light">con amor y respeto.</span>
        </h3>
        <p className="text-white/70 max-w-lg mx-auto text-sm md:text-base mb-12 leading-relaxed">
          Un espacio de sanación diseñado para brindarte paz, desde los más pequeños de la familia hasta los más grandes.
        </p>
        
        <div className="w-full h-[1px] bg-white/10 mb-8"></div>
        <div className="flex flex-col md:flex-row justify-between items-center w-full text-xs text-white/50 gap-4">
          <p>&copy; {new Date().getFullYear()} Johanna Grandón. Todos los derechos reservados.</p>
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
        <main className="flex-grow w-full">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}