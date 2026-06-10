"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Cormorant_Garamond, Montserrat } from "next/font/google";

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap"
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap"
});

gsap.registerPlugin(useGSAP);

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  duration: number | null;
  stock: number;
  imageUrl?: string | null;
};

type FilterType = 'ALL' | 'SERVICE' | 'PHYSICAL' | 'DIGITAL';

export default function HomeClient({ products }: { products: Product[] }) {
  const container = useRef<HTMLDivElement>(null);
  
  // E-commerce State
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  // Filtrado de productos en tiempo real
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesFilter = activeFilter === 'ALL' || product.type === activeFilter;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [products, activeFilter, searchQuery]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "unset";
      }
    });

    // Animación de carga rápida y optimizada
    tl.to(".loader-content", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
      .to(".loader-content", { opacity: 0, y: -20, duration: 0.6, delay: 0.5, ease: "power2.in" })
      .to(".loader-screen", { yPercent: -100, duration: 1, ease: "expo.inOut" })
      
      // Entrada de Navbar y Hero
      .fromTo([".top-navbar", ".store-header"],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" },
        "-=0.6"
      )
      
      // Entrada de los productos
      .fromTo(".store-card",
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.08, 
          ease: "back.out(1.2)",
          clearProps: "all" 
        },
        "-=0.6"
      );
  }, { scope: container });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);
  };

  const handleAddToCart = () => {
    // Simulación visual de añadir al carrito
    setCartCount(prev => prev + 1);
    gsap.fromTo(".cart-badge", 
      { scale: 1.5, backgroundColor: "#a855f7" }, 
      { scale: 1, backgroundColor: "#111827", duration: 0.4, ease: "back.out(2)" }
    );
  };

  return (
    <div ref={container} className={`relative min-h-screen bg-[#FDFCFB] text-gray-900 ${montserrat.className}`}>
      
      {/* ================= LOADER ================= */}
      <div className="loader-screen fixed inset-0 z-[100] bg-white flex items-center justify-center pointer-events-none">
        <div className="loader-content flex flex-col items-center gap-6 opacity-0 translate-y-4">
          <SparkleStarIcon className="w-12 h-12 text-indigo-600 animate-spin-slow" />
          <h2 className={`text-4xl text-gray-900 font-medium tracking-tight ${cormorant.className}`}>
            Liberación Energética
          </h2>
        </div>
      </div>

      {/* ================= NAVBAR E-COMMERCE ================= */}
      <nav className="top-navbar fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] opacity-0">
        <div className="max-w-[96rem] mx-auto px-5 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-4 md:gap-8">
          
          {/* Brand */}
          <div className="flex items-center gap-2 shrink-0 cursor-pointer">
            <SparkleStarIcon className="w-6 h-6 text-indigo-600 hidden sm:block" />
            <span className={`text-2xl font-bold text-gray-900 tracking-tight ${cormorant.className}`}>
              L.E. Boutique
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar terapias, cuarzos, oráculos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Cart */}
          <button className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors shrink-0">
            <CartIcon className="w-7 h-7" />
            {cartCount > 0 && (
              <span className="cart-badge absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* ================= CONTENIDO PRINCIPAL ================= */}
      <main className="relative z-10 max-w-[96rem] mx-auto px-5 sm:px-8 lg:px-12 pt-32 pb-24 min-h-screen flex flex-col">
        
        {/* HERO HEADER */}
        <header className="store-header flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 opacity-0">
          <div className="max-w-2xl">
            <h1 className={`text-5xl md:text-6xl lg:text-7xl font-medium text-gray-900 mb-4 tracking-tight ${cormorant.className}`}>
              Catálogo <span className="italic text-indigo-600">Sanador</span>
            </h1>
            <p className="text-gray-500 font-light text-base md:text-lg leading-relaxed">
              Encuentra las herramientas dispuestas por el universo para restaurar tu armonía interior y elevar tu vibración.
            </p>
          </div>

          {/* FILTROS (Desktop & Mobile Scroll) */}
          <div className="flex overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0 hide-scrollbar gap-2 shrink-0">
            {[
              { id: 'ALL', label: 'Todo' },
              { id: 'SERVICE', label: 'Terapias' },
              { id: 'PHYSICAL', label: 'Productos Físicos' },
              { id: 'DIGITAL', label: 'Digitales' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as FilterType)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  activeFilter === filter.id 
                    ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </header>

        {/* ================= GRILLA DE PRODUCTOS ================= */}
        {filteredProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <SearchIcon className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className={`text-3xl text-gray-900 mb-2 ${cormorant.className}`}>No se encontraron resultados</h3>
            <p className="text-gray-500">Intenta buscar con otras palabras o limpia los filtros.</p>
            <button 
              onClick={() => {setSearchQuery(''); setActiveFilter('ALL');}}
              className="mt-6 text-indigo-600 font-bold hover:text-indigo-800 underline decoration-2 underline-offset-4"
            >
              Ver todo el catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <article 
                key={product.id} 
                className="store-card group flex flex-col bg-white rounded-[2rem] p-4 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* IMAGEN */}
                <div className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-gray-50 mb-5">
                  {/* Badges */}
                  <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    <span className={`px-3 py-1 text-[10px] font-bold tracking-[0.15em] uppercase rounded-full shadow-sm backdrop-blur-md border ${
                      product.type === 'SERVICE' ? 'bg-purple-100/90 text-purple-800 border-purple-200' : 
                      product.type === 'PHYSICAL' ? 'bg-orange-100/90 text-orange-800 border-orange-200' : 
                      'bg-blue-100/90 text-blue-800 border-blue-200'
                    }`}>
                      {product.type === 'SERVICE' ? 'Terapia' : product.type === 'PHYSICAL' ? 'Físico' : 'Digital'}
                    </span>
                  </div>

                  {product.imageUrl ? (
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <SparkleStarIcon className="w-10 h-10 text-gray-300" />
                    </div>
                  )}

                  {/* Quick Add Overlay Overlay (Desktop solo) */}
                  <div className="absolute inset-x-4 bottom-4 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:block">
                    <button 
                      onClick={handleAddToCart}
                      disabled={product.type === 'PHYSICAL' && product.stock === 0}
                      className="w-full bg-white/90 backdrop-blur-md text-gray-900 font-bold py-3 rounded-xl shadow-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {product.type === 'SERVICE' ? 'Reservar Cita' : product.stock === 0 ? 'Agotado' : 'Añadir a la Bolsa'}
                    </button>
                  </div>
                </div>

                {/* INFO */}
                <div className="flex flex-col flex-1 px-2 pb-2">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h2 className={`text-xl lg:text-2xl font-semibold text-gray-900 leading-tight ${cormorant.className}`}>
                      {product.name}
                    </h2>
                    {product.duration && (
                      <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg shrink-0">
                        {product.duration} min
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1">
                    {product.description}
                  </p>
                  
                  {/* FOOTER TARJETA */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <p className={`text-2xl text-gray-900 font-semibold ${cormorant.className}`}>
                      {formatPrice(product.price)}
                    </p>
                    
                    {/* Botón Mobile (Visible siempre en móvil, oculto en Desktop donde usamos el hover) */}
                    <button 
                      onClick={handleAddToCart}
                      disabled={product.type === 'PHYSICAL' && product.stock === 0}
                      className="md:hidden w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center disabled:bg-gray-200 disabled:text-gray-400 active:scale-95 transition-transform"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
              </article>
            ))}
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}

// ==========================================
// Iconos 
// ==========================================
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;
}
function CartIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
}
function SparkleStarIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2L14.09 9.91L22 12L14.09 14.09L12 22L9.91 14.09L2 12L9.91 9.91L12 2Z" /></svg>;
}
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
}