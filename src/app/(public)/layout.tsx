"use client";

import { CartProvider, useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";
import { ShoppingCart, Menu, Sparkles } from "lucide-react";
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
    <header className={`fixed w-full top-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolled ? 'py-4' : 'py-8'}`}>
      <div className="max-w-[90rem] mx-auto px-6 lg:px-12">
        {/* El "Altar" Glassmorphism */}
        <div className={`flex justify-between items-center px-8 py-4 rounded-full transition-all duration-700 ${scrolled ? 'bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50' : 'bg-transparent'}`}>
          
          <Link href="/" className="flex flex-col items-start group">
            <span className="font-playfair text-2xl text-foreground font-medium tracking-tight">Johanna Grandón</span>
            <span className="text-[9px] text-foreground/40 tracking-[0.3em] uppercase font-bold mt-0.5 group-hover:iridescent-text transition-all">Liberación Energética</span>
          </Link>
          
          <nav className="hidden md:flex space-x-12 text-[10px] font-bold tracking-[0.25em] uppercase text-foreground/60">
            {['Terapias', 'Boutique', 'Testimonios'].map((item) => (
              <button key={item} onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({behavior: 'smooth'})} className="relative overflow-hidden group py-1">
                <span className="block group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">{item}</span>
                <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 text-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center">{item}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-6">
            <button onClick={openCart} className="text-foreground hover:text-gold transition-colors relative flex items-center gap-2 group">
              <ShoppingCart size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-500" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>
            <a href="https://wa.me/569XXXXXXXX" target="_blank" rel="noopener noreferrer" className="hidden lg:inline-flex items-center justify-center bg-foreground text-white px-8 py-3.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-gold hover:shadow-xl hover:shadow-gold/20 transition-all duration-500">
              Agendar
            </a>
            <button className="md:hidden text-foreground p-1"><Menu size={24} strokeWidth={1.5} /></button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-background pt-32 pb-12 relative overflow-hidden flex flex-col items-center text-center border-t border-lavender/50">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[400px] bg-gradient-to-b from-lavender/40 to-transparent blur-3xl -z-10 rounded-full"></div>
      
      <Sparkles className="text-gold mb-8" size={32} strokeWidth={1} />
      <h3 className="font-playfair text-4xl md:text-6xl lg:text-[5rem] leading-[1] tracking-tighter text-foreground mb-12">
        Vuelve a tu <span className="iridescent-text italic font-light">esencia.</span>
      </h3>
      
      <a href="https://wa.me/569XXXXXXXX" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden bg-white border border-foreground/10 px-12 py-5 rounded-full text-[11px] font-bold tracking-widest uppercase text-foreground transition-all duration-500 hover:border-gold hover:shadow-[0_10px_40px_rgba(212,184,114,0.15)]">
        <span className="relative z-10 group-hover:text-gold transition-colors duration-500">Iniciar Transformación</span>
      </a>

      <div className="w-full max-w-[90rem] mx-auto px-6 mt-32 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-widest text-foreground/40 font-bold uppercase gap-4">
        <p>&copy; {new Date().getFullYear()} Johanna Grandón.</p>
        <Link href="/login" className="hover:text-gold transition-colors">Portal Profesional</Link>
      </div>
    </footer>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="luxury-noise"></div>
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