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
    <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled ? 'py-3 bg-background/95 backdrop-blur-md shadow-sm' : 'py-5 bg-transparent'}`}>
      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 flex justify-between items-center">
        
        {/* Logo idéntico a la imagen */}
        <Link href="/" className="flex items-center gap-3 group">
          <Heart className="text-gold fill-transparent group-hover:fill-gold transition-colors" size={28} strokeWidth={1.5} />
          <div className="flex flex-col">
            <span className="font-playfair text-2xl text-foreground">Johanna Grandón</span>
            <span className="text-[8px] text-foreground/70 tracking-widest uppercase">Radiestesia • Biodecodificación Emocional<br/>Terapias Holísticas</span>
          </div>
        </Link>
        
        {/* Navegación central */}
        <nav className="hidden md:flex space-x-8 text-[13px] font-medium text-foreground/80">
          <Link href="/" className="hover:text-gold transition-colors">Inicio</Link>
          <Link href="/sobre-mi" className="hover:text-gold transition-colors">Sobre mí</Link>
          <button onClick={() => document.getElementById('terapias')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-gold transition-colors">Terapias</button>
          <button onClick={() => document.getElementById('testimonios')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-gold transition-colors">Testimonios</button>
          <button onClick={() => document.getElementById('boutique')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-gold transition-colors">Boutique</button>
          <Link href="/contacto" className="hover:text-gold transition-colors">Contacto</Link>
        </nav>

        {/* Botón Agenda tu Sesión y Carrito */}
        <div className="flex items-center space-x-5">
          <button onClick={openCart} className="text-foreground hover:text-gold transition-colors relative">
            <ShoppingCart size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
          <a href="https://wa.me/569XXXXXXXX" target="_blank" rel="noopener noreferrer" className="hidden lg:inline-flex bg-foreground text-white px-6 py-2.5 rounded-full text-sm hover:bg-foreground/80 transition-colors shadow-sm">
            Agenda tu sesión <span className="ml-2">💬</span>
          </a>
          <button className="md:hidden text-foreground"><Menu size={24} strokeWidth={1.5} /></button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-background pt-16 pb-10 px-6 mt-20">
      <div className="max-w-[85rem] mx-auto flex flex-col items-center text-center">
        <h3 className="font-playfair text-3xl md:text-4xl mb-4">
          Sanar es recordar quién eres en esencia.
        </h3>
        <Heart className="text-gold mb-12" size={24} strokeWidth={1} />
        
        <div className="flex flex-col md:flex-row justify-between items-center w-full border-t border-white/20 pt-8 gap-6">
          <div className="flex items-center gap-3 text-left">
            <Heart className="text-gold" size={24} strokeWidth={1.5} />
            <div>
              <p className="font-playfair text-lg">Johanna Grandón</p>
              <p className="text-[10px] text-white/70 uppercase tracking-widest">Radiestesista • Biodecodificador emocional<br/>y Terapeuta Profesional</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end text-gold italic font-playfair text-xl">
            <p>Con amor,</p>
            <p>para tu bienestar.</p>
            <Heart size={16} strokeWidth={1} className="mt-2" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <CartDrawer />
      <div className="min-h-screen flex flex-col bg-background selection:bg-lavender selection:text-foreground">
        <Header />
        <main className="flex-grow w-full">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}