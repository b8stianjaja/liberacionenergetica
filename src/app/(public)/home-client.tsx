"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
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

gsap.registerPlugin(useGSAP);

// INTERFACES ACTUALIZADAS PARA ELIMINAR EL ERROR TS 2322
export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  categoryId: string | null;
  duration: number | null;
  stock: number;
  imageUrl: string | null;
};

export default function HomeClient({ products, categories }: { products: Product[], categories: Category[] }) {
  const container = useRef<HTMLDivElement>(null);
  const { addItem, totalItems, openCart, isHydrated } = useCart();
  
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Generamos los filtros dinámicamente incluyendo las categorías de la base de datos
  const dynamicFilters = useMemo(() => {
    const baseFilters = [{ id: 'ALL', label: 'Todo' }];
    const categoryFilters = categories.map(cat => ({ id: cat.id, label: cat.name }));
    return [...baseFilters, ...categoryFilters];
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filtramos por ID de categoría dinámica O por el tipo de producto
      const matchesFilter = activeFilter === 'ALL' || product.categoryId === activeFilter || product.type === activeFilter;
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

    tl.to(".loader-content", { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
      .to(".loader-content", { opacity: 0, y: -30, duration: 0.6, delay: 0.6, ease: "power2.in" })
      .to(".loader-screen", { yPercent: -100, duration: 1.2, ease: "expo.inOut" })
      .fromTo([".ambient-glow", ".top-navbar", ".store-header"],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "expo.out" },
        "-=0.8"
      )
      .fromTo(".store-card",
        { opacity: 0, y: 60, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 1, 
          stagger: 0.1, 
          ease: "expo.out",
          clearProps: "all" 
        },
        "-=0.8"
      );
  }, { scope: container });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || null,
    });

    setTimeout(() => {
      gsap.fromTo(".cart-badge", 
        { scale: 1.8, rotation: 15, backgroundColor: "#8b5cf6" }, 
        { scale: 1, rotation: 0, backgroundColor: "#111827", duration: 0.5, ease: "back.out(2.5)" }
      );
    }, 50);
  };

  return (
    <div ref={container} className={`relative min-h-screen bg-[#FAFAFA] text-gray-900 ${montserrat.className} overflow-hidden`}>
      <div className="ambient-glow absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-300/20 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="ambient-glow absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-300/20 blur-[100px] rounded-full pointer-events-none z-0" />

      <div className="loader-screen fixed inset-0 z-[100] bg-[#FAFAFA] flex items-center justify-center pointer-events-none">
        <div className="loader-content flex flex-col items-center gap-6 opacity-0 translate-y-8">
          <div className="relative flex items-center justify-center w-20 h-20">
            <div className="absolute inset-0 border-t-2 border-indigo-200 rounded-full animate-spin"></div>
            <SparkleStarIcon className="w-8 h-8 text-indigo-600 animate-pulse" />
          </div>
          <h2 className={`text-4xl md:text-5xl text-gray-900 font-bold tracking-tight ${cormorant.className}`}>
            Liberación Energética
          </h2>
        </div>
      </div>

      <nav className="top-navbar fixed top-0 w-full z-50 bg-white/60 backdrop-blur-2xl border-b border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.04)] opacity-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200 hidden sm:block">
              <SparkleStarIcon className="w-5 h-5" />
            </div>
            <span className={`text-2xl font-bold text-gray-900 tracking-tight ${cormorant.className}`}>
              L.E. Boutique
            </span>
          </div>

          <div className="flex-1 max-w-xl relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Busca tu sanación..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/80 border border-gray-200 rounded-full py-3.5 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <button 
            onClick={openCart} 
            className="relative p-3 bg-white rounded-full text-gray-700 border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 hover:text-indigo-600 transition-all shrink-0 active:scale-95"
          >
            <CartIcon className="w-6 h-6" />
            {isHydrated && totalItems > 0 && (
              <span className="cart-badge absolute -top-1 -right-1 bg-gray-900 text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-36 pb-24 min-h-screen flex flex-col">
        <header className="store-header flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 opacity-0">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-widest uppercase mb-6">
              <SparkleStarIcon className="w-3 h-3" /> Elevando tu frecuencia
            </div>
            <h1 className={`text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1] ${cormorant.className}`}>
              Catálogo <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Sanador</span>
            </h1>
            <p className="text-gray-500 font-medium text-lg md:text-xl leading-relaxed max-w-xl">
              Encuentra las herramientas dispuestas por el universo para restaurar tu armonía interior.
            </p>
          </div>

          <div className="flex overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 hide-scrollbar gap-3 shrink-0">
            {dynamicFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`relative whitespace-nowrap px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 overflow-hidden ${
                  activeFilter === filter.id 
                    ? 'text-white shadow-lg shadow-indigo-200' 
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                {activeFilter === filter.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 -z-10" />
                )}
                {filter.label}
              </button>
            ))}
          </div>
        </header>

        {filteredProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
              <SearchIcon className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className={`text-3xl text-gray-900 mb-3 font-bold ${cormorant.className}`}>No hay resultados</h3>
            <p className="text-gray-500 text-lg mb-8 text-center max-w-md">No logramos encontrar lo que buscas. Intenta con otros términos o explora nuestro catálogo completo.</p>
            <button 
              onClick={() => {setSearchQuery(''); setActiveFilter('ALL');}}
              className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-indigo-600 transition-colors shadow-lg active:scale-95"
            >
              Explorar todo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {filteredProducts.map((product) => (
              <article key={product.id} className="store-card group flex flex-col cursor-pointer">
                <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-100 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500">
                  <div className="absolute top-4 left-4 z-20">
                    <span className={`px-4 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-full shadow-sm backdrop-blur-md border ${
                      product.type === 'SERVICE' ? 'bg-purple-500/10 text-purple-700 border-purple-200/50' : 
                      product.type === 'PHYSICAL' ? 'bg-orange-500/10 text-orange-700 border-orange-200/50' : 
                      'bg-blue-500/10 text-blue-700 border-blue-200/50'
                    }`}>
                      {product.type === 'SERVICE' ? 'Terapia' : product.type === 'PHYSICAL' ? 'Físico' : 'Digital'}
                    </span>
                  </div>

                  {product.imageUrl ? (
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
                      <SparkleStarIcon className="w-12 h-12 text-gray-300" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute inset-x-4 bottom-4 z-20 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled={product.type === 'PHYSICAL' && product.stock === 0}
                      className="w-full bg-white/95 backdrop-blur-xl text-gray-900 font-bold py-3.5 rounded-2xl shadow-xl hover:bg-gray-900 hover:text-white disabled:opacity-50 disabled:bg-white disabled:text-gray-400 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      {product.type === 'SERVICE' ? 'Reservar Cita' : product.stock === 0 ? 'Agotado' : (
                        <><PlusIcon className="w-5 h-5" /> Añadir a la Bolsa</>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col flex-1 px-1">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h2 className={`text-2xl font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors ${cormorant.className}`}>
                      {product.name}
                    </h2>
                    {product.duration && (
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-100/80 backdrop-blur-sm px-2 py-1 rounded-md shrink-0 border border-gray-200/50">
                        {product.duration} min
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 font-medium leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <p className={`text-2xl text-gray-900 font-bold ${cormorant.className}`}>
                      {formatPrice(product.price)}
                    </p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled={product.type === 'PHYSICAL' && product.stock === 0}
                      className="md:hidden w-10 h-10 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white disabled:opacity-50 transition-colors"
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
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;
}
function CartIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
}
function SparkleStarIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2L14.09 9.91L22 12L14.09 14.09L12 22L9.91 14.09L2 12L9.91 9.91L12 2Z" /></svg>;
}
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
}