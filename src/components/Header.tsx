'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext'; // NUEVO: Importación del contexto

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { itemsCount, toggleCart } = useCart(); // NUEVO: Consumo del contexto

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [pathname]);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Sobre mí', href: '/sobre-mi' },
    { name: 'Terapias', href: '/terapias' },
    { name: 'Testimonios', href: '/testimonios' },
    { name: 'Boutique', href: '/boutique' },
  ];

  return (
    <>
      <header id="app-header" className={`w-full fixed top-0 z-[80] transition-all duration-500 ease-in-out ${
        isScrolled ? 'bg-white/85 backdrop-blur-xl border-b border-[var(--purple-deep)]/10 shadow-sm py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-[90rem] mx-auto px-6 lg:px-16 flex justify-between items-center">
          
          <Link href="/" className="flex flex-col items-start group relative z-[90]">
            <span className="font-serif text-2xl md:text-3xl text-[var(--purple-deep)] leading-none tracking-wide group-hover:text-[var(--gold-magic)] transition-colors duration-500">
              Johanna Grandón
            </span>
            <span className="text-[9px] md:text-[10px] text-[var(--gold-magic)] tracking-[0.25em] uppercase mt-1.5 font-bold">
              Liberación Energética
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-8 text-[12px] uppercase tracking-[0.15em] font-bold text-zinc-500">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className={`relative overflow-hidden group py-1 transition-colors hover:text-[var(--purple-deep)] ${pathname === link.href ? 'text-[var(--purple-deep)]' : ''}`}>
                {link.name}
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[var(--gold-magic)] transform origin-left transition-transform duration-300 ease-out ${pathname === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4 md:space-x-6 z-[90]">
            <div className="hidden sm:flex items-center space-x-5">
              <Link href="/login" className="text-[var(--purple-deep)] hover:text-[var(--gold-magic)] transition-colors">
                <User size={20} strokeWidth={1.5} />
              </Link>
              {/* BOTÓN DEL CARRITO INTERACTIVO */}
              <button onClick={toggleCart} className="text-[var(--purple-deep)] hover:text-[var(--gold-magic)] transition-colors relative group">
                <ShoppingCart size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                {itemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[var(--gold-magic)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in">
                    {itemsCount}
                  </span>
                )}
              </button>
            </div>

            <a href="https://wa.me/tunumerowhatsapp" target="_blank" rel="noopener noreferrer" className="hidden lg:inline-flex items-center gap-2 bg-[var(--purple-deep)] text-white px-6 py-2.5 rounded-full text-xs tracking-wider uppercase font-bold hover:bg-[var(--gold-magic)] transition-all shadow-md hover:-translate-y-0.5">
              Agenda tu sesión <ArrowRight size={14} />
            </a>

            <button className="md:hidden text-[var(--purple-deep)] p-2 focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* MENÚ MÓVIL INTERACTIVO */}
      <div className={`fixed inset-0 bg-white/95 backdrop-blur-2xl z-[70] md:hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col h-full justify-center px-8 pb-20 space-y-8">
          <nav className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-3xl font-playfair text-[var(--purple-deep)] hover:text-[var(--gold-magic)] transition-colors">{link.name}</Link>
            ))}
          </nav>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--gold-magic)]/30 to-transparent my-4" />
          <div className="flex flex-col space-y-6">
            <Link href="/login" className="flex items-center gap-3 text-lg text-zinc-600 font-playfair">
              <User size={22} className="text-[var(--gold-magic)]" /> Portal Admin
            </Link>
            <button onClick={() => { setMobileMenuOpen(false); toggleCart(); }} className="flex items-center gap-3 text-lg text-zinc-600 text-left font-playfair">
              <ShoppingCart size={22} className="text-[var(--gold-magic)]" /> Ver Cesta ({itemsCount})
            </button>
          </div>
        </div>
      </div>
    </>
  );
}