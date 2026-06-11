"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { useCart } from "@/context/CartContext";

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap"
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap"
});

// Register ScrollTrigger alongside useGSAP
gsap.registerPlugin(useGSAP, ScrollTrigger);

export type Category = { id: string; name: string; };
export type Product = {
  id: string; name: string; description: string;
  price: number; type: string; categoryId: string | null;
  duration: number | null; stock: number; imageUrl: string | null;
};

export default function HomeClient({ products, categories }: { products: Product[], categories: Category[] }) {
  const container = useRef<HTMLDivElement>(null);
  const { addItem, totalItems, openCart, isHydrated } = useCart();
  
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const dynamicFilters = useMemo(() => {
    const baseFilters = [{ id: 'ALL', label: 'El Todo' }];
    const categoryFilters = categories.map(cat => ({ id: cat.id, label: cat.name }));
    return [...baseFilters, ...categoryFilters];
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesFilter = activeFilter === 'ALL' || product.categoryId === activeFilter || product.type === activeFilter;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [products, activeFilter, searchQuery]);

  useEffect(() => {
    // Lock scroll during loader
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => { 
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset"; 
    };
  }, []);

  useGSAP(() => {
    // 1. LOADER TIMELINE (Untouched as requested, but acts as the spark)
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = "auto";
        document.body.style.overflow = "auto";
        ScrollTrigger.refresh(); // Crucial: recalculate scroll positions after loader disappears
      }
    });

    tl.to(".loader-content", { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
      .to(".loader-content", { opacity: 0, y: -40, scale: 0.9, duration: 0.8, delay: 0.6, ease: "power4.inOut" })
      .to(".loader-screen", { height: 0, duration: 1.2, ease: "expo.inOut" })
      
      // 2. RADICAL HERO REVEAL
      .fromTo(".ambient-orb", 
        { scale: 0, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 2, stagger: 0.3, ease: "elastic.out(1, 0.5)" }, 
        "-=0.8"
      )
      .fromTo(".top-navbar",
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "expo.out" },
        "-=1.5"
      )
      .fromTo(".hero-text-line",
        { y: 100, opacity: 0, rotateX: -45 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.5, stagger: 0.15, ease: "power4.out", transformOrigin: "bottom center" },
        "-=1.2"
      )
      .fromTo(".filter-pill",
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 1, stagger: 0.05, ease: "back.out(1.5)" },
        "-=1"
      );

    // 3. SCROLL-TRIGGERED PRODUCT CASCADES
    const cards = gsap.utils.toArray('.product-card-wrapper') as HTMLElement[];
    cards.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, y: 150, scale: 0.9, rotateY: index % 2 === 0 ? -10 : 10 },
        {
          opacity: 1, y: 0, scale: 1, rotateY: 0,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse", // Plays on enter, reverses on leave
          }
        }
      );
    });

    // 4. FLOATING ORB ANIMATION (Continuous)
    gsap.to(".ambient-orb", {
      y: "random(-30, 30)",
      x: "random(-30, 30)",
      rotation: "random(-20, 20)",
      duration: "random(4, 8)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.5
    });

  }, { scope: container, dependencies: [filteredProducts] });

  // 3D Hover Effect for Cards
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardRef: HTMLElement) => {
    const rect = cardRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Exaggerated but controlled 3D tilt
    const rotateX = ((y - centerY) / centerY) * -12; 
    const rotateY = ((x - centerX) / centerX) * 12;

    gsap.to(cardRef, {
      rotateX,
      rotateY,
      scale: 1.02,
      transformPerspective: 1000,
      duration: 0.5,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = (cardRef: HTMLElement) => {
    gsap.to(cardRef, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 1,
      ease: "elastic.out(1, 0.3)"
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || null,
    });

    // Explosive cart badge animation
    gsap.fromTo(".cart-badge", 
      { scale: 2.5, rotation: 45, backgroundColor: "#c084fc" }, 
      { scale: 1, rotation: 0, backgroundColor: "#111827", duration: 0.8, ease: "elastic.out(1, 0.3)" }
    );
  };

  return (
    <div ref={container} className={`relative min-h-screen bg-[#F7F7F9] text-gray-900 ${montserrat.className} selection:bg-purple-300 selection:text-purple-900 overflow-x-hidden`}>
      
      {/* EXTREME CSS INJECTION: Kill all scrollbars entirely across the page */}
      <style dangerouslySetInnerHTML={{__html: `
        html, body {
          scrollbar-width: none !important; /* Firefox */
          -ms-overflow-style: none !important; /* IE/Edge */
        }
        *::-webkit-scrollbar {
          display: none !important; /* Chrome/Safari/Opera */
        }
        .perspective-container { perspective: 1500px; }
      `}} />

      {/* DYNAMIC AMBIENT ORBS */}
      <div className="ambient-orb absolute top-[-5%] left-[-10%] w-[60vw] h-[60vw] bg-fuchsia-400/20 blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="ambient-orb absolute top-[30%] right-[-15%] w-[50vw] h-[50vw] bg-indigo-400/20 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="ambient-orb absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] bg-purple-500/15 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* LOADER (Untouched structure) */}
      <div className="loader-screen fixed top-0 inset-x-0 bottom-0 z-[100] bg-[#F7F7F9] flex items-center justify-center overflow-hidden">
        <div className="loader-content flex flex-col items-center gap-6 opacity-0">
          <div className="relative flex items-center justify-center w-24 h-24">
            <div className="absolute inset-0 border-t-2 border-indigo-300 rounded-full animate-spin duration-1000"></div>
            <div className="absolute inset-2 border-b-2 border-fuchsia-300 rounded-full animate-spin duration-700 reverse"></div>
            <SparkleStarIcon className="w-10 h-10 text-indigo-600 animate-pulse" />
          </div>
          <h2 className={`text-4xl md:text-5xl text-gray-900 font-bold tracking-tight ${cormorant.className}`}>
            Liberación Energética
          </h2>
        </div>
      </div>

      <nav className="top-navbar fixed top-0 w-full z-50 bg-white/40 backdrop-blur-3xl border-b border-white/60 shadow-[0_4px_40px_rgba(0,0,0,0.03)] opacity-0">
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12 h-24 flex items-center justify-between gap-8">
          <div className="flex items-center gap-4 shrink-0 cursor-pointer group">
            <div className="bg-gray-900 p-2.5 rounded-2xl text-white shadow-2xl shadow-gray-900/30 group-hover:rotate-180 transition-transform duration-700 ease-in-out">
              <SparkleStarIcon className="w-6 h-6" />
            </div>
            <span className={`text-3xl font-bold text-gray-900 tracking-tighter ${cormorant.className}`}>
              L.E. Boutique
            </span>
          </div>

          <div className="flex-1 max-w-2xl relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-6 w-5 h-5 text-gray-400 group-focus-within:text-fuchsia-600 transition-colors duration-500" />
              <input 
                type="text" 
                placeholder="Busca el catalizador de tu sanación..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/70 border border-white rounded-2xl py-4 pl-16 pr-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <button 
            onClick={openCart} 
            className="relative p-4 bg-white/80 backdrop-blur-md rounded-2xl text-gray-900 border border-white shadow-lg shadow-gray-200/50 hover:bg-gray-900 hover:text-white transition-all duration-300 shrink-0 active:scale-90"
          >
            <CartIcon className="w-6 h-6" />
            {isHydrated && totalItems > 0 && (
              <span className="cart-badge absolute -top-2 -right-2 bg-fuchsia-600 text-white text-xs font-black w-7 h-7 rounded-xl flex items-center justify-center border-[3px] border-[#F7F7F9] shadow-xl">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-[90rem] mx-auto px-6 lg:px-12 pt-48 pb-40">
        
        {/* HERO SECTION: Exaggerated Copy & Typography */}
        <header className="flex flex-col xl:flex-row justify-between items-end gap-16 mb-32 perspective-container">
          <div className="max-w-4xl w-full">
            <div className="hero-text-line overflow-hidden mb-6">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/60 backdrop-blur-md border border-white shadow-xl shadow-fuchsia-900/5 text-fuchsia-800 text-xs font-black tracking-[0.3em] uppercase">
                <SparkleStarIcon className="w-4 h-4 animate-spin-slow" /> Eleva tu Frecuencia
              </div>
            </div>
            
            <h1 className={`text-7xl md:text-[7rem] lg:text-[8.5rem] font-medium text-gray-900 tracking-tighter leading-[0.9] ${cormorant.className}`}>
              <div className="hero-text-line overflow-hidden pb-4">
                <span>Santuario</span>
              </div>
              <div className="hero-text-line overflow-hidden">
                <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-purple-600">
                  Energético.
                </span>
              </div>
            </h1>
            
            <div className="hero-text-line mt-10">
              <p className="text-gray-500 font-medium text-xl md:text-2xl leading-relaxed max-w-2xl border-l-4 border-fuchsia-200 pl-6">
                Despierta tu consciencia. Cada elemento en esta colección ha sido intencionado para catalizar tu evolución espiritual y restaurar tu balance áurico.
              </p>
            </div>
          </div>

          {/* DYNAMIC, STAGGERED FILTERS */}
          <div className="w-full xl:w-auto flex flex-wrap xl:flex-col justify-start xl:justify-end gap-3 pb-4">
            {dynamicFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`filter-pill relative px-8 py-4 rounded-2xl text-[13px] font-black tracking-widest uppercase transition-all duration-500 overflow-hidden group ${
                  activeFilter === filter.id 
                    ? 'text-white scale-105 shadow-2xl shadow-fuchsia-500/30' 
                    : 'bg-white/60 backdrop-blur-sm text-gray-500 hover:text-gray-900 border border-white hover:bg-white hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {activeFilter === filter.id && (
                  <div className="absolute inset-0 bg-gray-900 -z-10" />
                )}
                {filter.label}
              </button>
            ))}
          </div>
        </header>

        {filteredProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-32">
            <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-gray-200 border border-white rotate-6 animate-pulse">
              <SearchIcon className="w-12 h-12 text-gray-300 -rotate-6" />
            </div>
            <h3 className={`text-5xl text-gray-900 mb-6 font-medium ${cormorant.className}`}>Vacío Cuántico</h3>
            <p className="text-gray-500 text-xl mb-12 text-center max-w-lg">Las energías que buscas aún no se han manifestado en este plano. Ajusta tu búsqueda.</p>
            <button 
              onClick={() => {setSearchQuery(''); setActiveFilter('ALL');}}
              className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-10 py-5 rounded-2xl font-bold tracking-wider hover:shadow-2xl hover:shadow-gray-900/30 transition-all duration-300 active:scale-90"
            >
              Restaurar Visión
            </button>
          </div>
        ) : (
          /* ASYMMETRICAL MASONRY-STYLE GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-24 items-start">
            {filteredProducts.map((product, i) => (
              <div 
                key={product.id} 
                className={`product-card-wrapper perspective-container ${i % 2 !== 0 ? 'lg:mt-24' : ''} ${i % 3 === 0 ? 'xl:mt-32' : ''}`}
              >
                <article 
                  className="store-card group flex flex-col bg-white/70 backdrop-blur-xl p-4 rounded-[3rem] shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-white/80 transition-shadow duration-700 hover:shadow-[0_40px_80px_rgba(192,132,252,0.15)] cursor-pointer"
                  onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                  onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                  onClick={() => {/* Route to product detail in future */}}
                >
                  
                  <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-100 mb-8 transform-gpu">
                    <div className="absolute top-5 left-5 z-20">
                      <span className={`px-5 py-2 text-[10px] font-black tracking-[0.2em] uppercase rounded-2xl shadow-xl backdrop-blur-md border ${
                        product.type === 'SERVICE' ? 'bg-fuchsia-500/20 text-fuchsia-900 border-fuchsia-200/50' : 
                        product.type === 'PHYSICAL' ? 'bg-orange-500/20 text-orange-900 border-orange-200/50' : 
                        'bg-indigo-500/20 text-indigo-900 border-indigo-200/50'
                      }`}>
                        {product.type === 'SERVICE' ? 'Terapia' : product.type === 'PHYSICAL' ? 'Materia' : 'Etéreo'}
                      </span>
                    </div>

                    {product.imageUrl ? (
                      <Image 
                        src={product.imageUrl} 
                        alt={product.name} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-[3s] ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <SparkleStarIcon className="w-16 h-16 text-gray-300" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="absolute inset-x-5 bottom-5 z-20 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                      <button 
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={product.type === 'PHYSICAL' && product.stock === 0}
                        className="w-full bg-white/95 backdrop-blur-2xl text-gray-900 font-bold py-4 rounded-2xl shadow-2xl hover:bg-gray-900 hover:text-white disabled:opacity-50 disabled:bg-white disabled:text-gray-400 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-3 border border-white"
                      >
                        {product.type === 'SERVICE' ? 'Agendar Sesión' : product.stock === 0 ? 'Agotado' : (
                          <><PlusIcon className="w-5 h-5" /> Manifestar</>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 px-3 pb-3 pointer-events-none">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h2 className={`text-3xl font-medium text-gray-900 leading-[1.1] group-hover:text-fuchsia-600 transition-colors duration-500 ${cormorant.className}`}>
                        {product.name}
                      </h2>
                    </div>
                    
                    <p className="text-[14px] text-gray-500 line-clamp-2 mb-8 font-medium leading-relaxed">
                      {product.description}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-900/5">
                      <p className={`text-3xl text-gray-900 font-semibold ${cormorant.className}`}>
                        {formatPrice(product.price)}
                      </p>
                      
                      {/* Mobile quick add button */}
                      <button 
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={product.type === 'PHYSICAL' && product.stock === 0}
                        className="xl:hidden w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-fuchsia-600 disabled:opacity-50 transition-colors shadow-xl pointer-events-auto"
                      >
                        <PlusIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Icons remain SVG but logic stays clean
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;
}
function CartIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
}
function SparkleStarIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2L14.09 9.91L22 12L14.09 14.09L12 22L9.91 14.09L2 12L9.91 9.91L12 2Z" /></svg>;
}
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
}