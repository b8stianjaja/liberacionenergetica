'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X, ArrowRight } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Detectar scroll para efecto glassmorphism dinámico
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Sobre mí', href: '/sobre-mi' },
    { name: 'Terapias', href: '/terapias' },
    { name: 'Testimonios', href: '/testimonios' },
    { name: 'Boutique', href: '/boutique' },
  ];

  return (
    <>
      <header 
        className={`w-full fixed top-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'bg-white/85 backdrop-blur-xl border-b border-[#4a2e6b]/10 shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-3' 
            : 'bg-white/50 backdrop-blur-md border-b border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          {/* LOGO & BRANDING */}
          <Link href="/" className="flex flex-col items-start group relative z-50">
            <span className="font-serif text-2xl md:text-3xl text-[#4a2e6b] leading-none tracking-wide group-hover:text-[#cfaa66] transition-colors duration-500">
              Johanna Grandón
            </span>
            <span className="text-[9px] md:text-[10px] text-[#cfaa66] tracking-[0.25em] uppercase mt-1.5 font-semibold">
              Liberación Energética
            </span>
          </Link>
          
          {/* NAVEGACIÓN DESKTOP */}
          <nav className="hidden md:flex space-x-8 text-[13px] uppercase tracking-widest font-medium text-zinc-600">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`relative overflow-hidden group py-1 transition-colors duration-300 hover:text-[#4a2e6b] ${pathname === link.href ? 'text-[#4a2e6b] font-semibold' : ''}`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-[#cfaa66] transform origin-left transition-transform duration-300 ease-out ${pathname === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </Link>
            ))}
          </nav>

          {/* ACCIONES (Login, Carrito, WhatsApp, Hamburguesa) */}
          <div className="flex items-center space-x-4 md:space-x-6 z-50">
            <div className="hidden sm:flex items-center space-x-5">
              <Link href="/login" className="text-[#4a2e6b] hover:text-[#cfaa66] transition-colors duration-300" aria-label="Mi Cuenta">
                <User size={20} strokeWidth={1.5} />
              </Link>
              <button className="text-[#4a2e6b] hover:text-[#cfaa66] transition-colors duration-300 relative group" aria-label="Carrito">
                <ShoppingCart size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1.5 -right-2 bg-[#cfaa66] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  0
                </span>
              </button>
            </div>

            <a 
              href="https://wa.me/tunumerowhatsapp" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hidden lg:inline-flex items-center gap-2 bg-[#4a2e6b] text-white px-6 py-2.5 rounded-full text-xs tracking-wider uppercase font-medium hover:bg-[#cfaa66] transition-all duration-500 shadow-[0_4px_14px_rgba(74,46,107,0.25)] hover:shadow-[0_6px_20px_rgba(207,170,102,0.4)] hover:-translate-y-0.5"
            >
              Agenda tu sesión <ArrowRight size={14} />
            </a>

            {/* BOTÓN MENÚ MÓVIL */}
            <button 
              className="md:hidden text-[#4a2e6b] p-2 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* MENÚ MÓVIL (Overlay) */}
      <div 
        className={`fixed inset-0 bg-white/95 backdrop-blur-2xl z-40 md:hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-full'
        }`}
      >
        <div className="flex flex-col h-full justify-center px-8 pb-20 space-y-8">
          <nav className="flex flex-col space-y-6">
            {navLinks.map((link, index) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-3xl font-serif text-[#4a2e6b] hover:text-[#cfaa66] transition-colors flex items-center gap-4"
                style={{ transitionDelay: `${index * 50}ms`, transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)', opacity: mobileMenuOpen ? 1 : 0 }}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div 
            className="w-full h-px bg-gradient-to-r from-transparent via-[#cfaa66]/30 to-transparent my-4"
            style={{ transitionDelay: '300ms', transform: mobileMenuOpen ? 'scaleX(1)' : 'scaleX(0)', opacity: mobileMenuOpen ? 1 : 0 }}
          />

          <div 
            className="flex flex-col space-y-6"
            style={{ transitionDelay: '400ms', transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)', opacity: mobileMenuOpen ? 1 : 0 }}
          >
            <Link href="/login" className="flex items-center gap-3 text-lg text-zinc-600">
              <User size={22} className="text-[#cfaa66]" /> Mi Cuenta
            </Link>
            <button className="flex items-center gap-3 text-lg text-zinc-600 text-left">
              <ShoppingCart size={22} className="text-[#cfaa66]" /> Carrito de compras (0)
            </button>
            <a 
              href="https://wa.me/tunumerowhatsapp" 
              className="mt-4 flex justify-center items-center gap-2 bg-[#4a2e6b] text-white px-6 py-4 rounded-full text-sm tracking-wider uppercase font-medium shadow-lg"
            >
              Agenda tu sesión
            </a>
          </div>
        </div>
      </div>
    </>
  );
}