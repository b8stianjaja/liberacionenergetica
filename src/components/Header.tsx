'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Added Next.js Image component
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const WHATSAPP_NUMBER = "56900000000"; 
const WHATSAPP_MESSAGE = encodeURIComponent("Hola Johanna, me gustaría agendar una sesión.");

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const pathname = usePathname();
  const { itemsCount, toggleCart, isLoaded } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const sections = ['inicio', 'sobre-mi', 'terapias', 'testimonios', 'boutique'];
      let current = '';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            current = `#${section}`;
          }
        }
      }
      setActiveHash(current || '/');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [pathname, activeHash]);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Sobre mí', href: '/#sobre-mi' },
    { name: 'Terapias', href: '/#terapias' },
    { name: 'Testimonios', href: '/#testimonios' },
    { name: 'Boutique', href: '/#boutique' },
  ];

  return (
    <>
      <header id="app-header" className={`w-full fixed top-0 z-[80] transition-all duration-500 ease-in-out ${
        isScrolled ? 'bg-white/85 backdrop-blur-xl border-b border-[var(--purple-deep)]/10 shadow-sm py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-[90rem] mx-auto px-6 lg:px-16 flex justify-between items-center">
          
          {/* UPDATED LOGO SECTION */}
          <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 md:gap-4 group relative z-[90]">
            
            {/* Image Container: Designed to be slightly larger than the text block */}
            <div className="relative w-10 h-10 md:w-14 md:h-14 flex-shrink-0 transition-transform duration-500 group-hover:scale-105">
              <Image 
                src="/cruz.png" 
                alt="Cruz Ankh - Liberación Energética"
                fill
                className="object-contain opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-sm"
                priority
              />
            </div>

            {/* Text Container */}
            <div className="flex flex-col items-start">
              <span className="font-serif text-2xl md:text-3xl text-[var(--purple-deep)] leading-none tracking-wide group-hover:text-[var(--gold-magic)] transition-colors duration-500">
                Johanna Grandón
              </span>
              <span className="text-[9px] md:text-[10px] text-[var(--gold-magic)] tracking-[0.25em] uppercase mt-1.5 font-bold">
                Radiestesista, Biodecodificadora Emocional y Terapeuta Profesional Holística con Péndulo Hebreo
              </span>
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-8 text-[12px] uppercase tracking-[0.15em] font-bold text-zinc-500">
            {navLinks.map((link) => {
              const isActive = activeHash === link.href || (activeHash === '/' && link.href === '/');
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`relative overflow-hidden group py-1 transition-colors hover:text-[var(--purple-deep)] ${isActive ? 'text-[var(--purple-deep)]' : ''}`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[var(--gold-magic)] transform origin-left transition-transform duration-300 ease-out ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4 md:space-x-6 z-[90]">
            <div className="hidden sm:flex items-center space-x-5">
              <Link href="/login" aria-label="Portal de Usuario" className="text-[var(--purple-deep)] hover:text-[var(--gold-magic)] transition-colors">
                <User size={20} strokeWidth={1.5} />
              </Link>
              
              <button onClick={toggleCart} aria-label="Abrir carrito" className="text-[var(--purple-deep)] hover:text-[var(--gold-magic)] transition-colors relative group">
                <ShoppingCart size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                {isLoaded && itemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[var(--gold-magic)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in">
                    {itemsCount}
                  </span>
                )}
              </button>
            </div>

            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hidden lg:inline-flex items-center gap-2 bg-[var(--purple-deep)] text-white px-6 py-2.5 rounded-full text-xs tracking-wider uppercase font-bold hover:bg-[var(--gold-magic)] transition-all shadow-md hover:-translate-y-0.5"
            >
              Agenda tu sesión <ArrowRight size={14} />
            </a>

            <button 
              className="md:hidden text-[var(--purple-deep)] p-2 focus:outline-none" 
              aria-label="Menú principal"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
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
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-playfair text-[var(--purple-deep)] hover:text-[var(--gold-magic)] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--gold-magic)]/30 to-transparent my-4" />
          <div className="flex flex-col space-y-6">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-lg text-zinc-600 font-playfair">
              <User size={22} className="text-[var(--gold-magic)]" /> Portal Admin
            </Link>
            <button onClick={() => { setMobileMenuOpen(false); toggleCart(); }} className="flex items-center gap-3 text-lg text-zinc-600 text-left font-playfair w-full">
              <ShoppingCart size={22} className="text-[var(--gold-magic)]" /> 
              Ver Cesta {isLoaded && itemsCount > 0 ? `(${itemsCount})` : ''}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}