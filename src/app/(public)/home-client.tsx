"use client";

import { useRef, useEffect, useState, useMemo, MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { useCart } from "@/context/CartContext";
import EnergyScene from "@/components/canvas/EnergyScene";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], style: ["normal", "italic"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600"], display: "swap" });

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP, ScrollTrigger);

export type Category = { id: string; name: string; };
export type Banner = { id: string; title: string; subtitle: string; imageUrl: string; };
export type Product = { id: string; name: string; description: string; price: number; type: string; categoryId: string | null; duration: number | null; stock: number; imageUrl: string | null; };

interface HomeClientProps { products: Product[]; categories: Category[]; banners: Banner[]; }

export default function HomeClient({ products, categories, banners }: HomeClientProps) {
  const container = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorAuraRef = useRef<HTMLDivElement>(null);
  
  const { addItem, totalItems, openCart } = useCart();
  
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  
  // Estado para el Lightbox interactivo
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => { 
    setMounted(true); 
    window.scrollTo(0, 0); 
  }, []);

  // Bloquear scroll cuando el lightbox está abierto
  useEffect(() => {
    if (selectedProduct) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedProduct]);

  const dynamicFilters = useMemo(() => [{ id: 'ALL', label: 'El Todo' }, ...categories.map(cat => ({ id: cat.id, label: cat.name }))], [categories]);
  
  const filteredProducts = useMemo(() => 
    products.filter((product) => 
      (activeFilter === 'ALL' || product.categoryId === activeFilter || product.type === activeFilter) && 
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ), [products, activeFilter, searchQuery]);

  const infiniteBanners = useMemo(() => [...banners, ...banners], [banners]);

  useGSAP(() => {
    // Cursor magnético optimizado (sólo visible en desktop)
    const xTo = gsap.quickTo(cursorRef.current, "x", {duration: 0.15, ease: "power3"});
    const yTo = gsap.quickTo(cursorRef.current, "y", {duration: 0.15, ease: "power3"});
    const xAuraTo = gsap.quickTo(cursorAuraRef.current, "x", {duration: 0.5, ease: "power3"});
    const yAuraTo = gsap.quickTo(cursorAuraRef.current, "y", {duration: 0.5, ease: "power3"});

    const moveCursor = (e: MouseEvent) => { 
      xTo(e.clientX); yTo(e.clientY); 
      xAuraTo(e.clientX); yAuraTo(e.clientY); 
    };
    window.addEventListener("mousemove", moveCursor, { passive: true });

    // Secuencia de entrada etérea
    const tl = gsap.timeline();
    tl.to(".loader-content", { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
      .to(".loader-screen", { opacity: 0, duration: 1.2, ease: "power2.inOut", delay: 0.8, display: "none" })
      .fromTo(".top-navbar", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "expo.out" }, "-=0.5");

    return () => { window.removeEventListener("mousemove", moveCursor); };
  }, { scope: container }); 

  useGSAP(() => {
    if (banners.length < 2) return;
    gsap.to(".carousel-track", {
      xPercent: -50,
      duration: banners.length * 8, // Movimiento más lento y relajante
      ease: "none",
      repeat: -1,
    });
  }, { scope: container, dependencies: [banners] });

  useGSAP(() => {
    const cards = gsap.utils.toArray('.product-card-wrapper') as HTMLElement[];
    cards.forEach((card, index) => {
      ScrollTrigger.create({
        trigger: card, 
        start: "top 90%",
        animation: gsap.fromTo(card, 
          { opacity: 0, y: 40, scale: 0.98 }, 
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out", delay: index * 0.05 }
        ),
        toggleActions: "play none none reverse"
      });
    });
  }, { scope: container, dependencies: [filteredProducts] });

  const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);

  const handleAddToCart = (product: Product, e?: ReactMouseEvent<HTMLButtonElement>) => {
    if (e) e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || null });
    gsap.fromTo(".cart-badge", { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" });
  };

  const designPattern = ["col-span-1", "col-span-2", "col-span-1", "col-span-1", "col-span-2", "col-span-1"];

  return (
    <div ref={container} className={`relative min-h-screen bg-[#FAFAFB] text-zinc-800 ${montserrat.className} overflow-hidden md:cursor-none selection:bg-zinc-200 selection:text-black`}>
      
      <EnergyScene />

      {/* Sombras difusas de fondo para dar profundidad de cristal */}
      <div className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-white rounded-full blur-[120px] pointer-events-none z-0 opacity-80" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-zinc-200/40 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Cursores Personalizados (Ocultos en móvil) */}
      <div className="hidden md:block">
        <div ref={cursorRef} className="fixed top-0 left-0 w-2 h-2 bg-zinc-600 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(161,161,170,0.5)] will-change-transform" />
        <div ref={cursorAuraRef} className="fixed top-0 left-0 w-12 h-12 border-[0.5px] border-zinc-400/40 bg-white/10 backdrop-blur-[1px] rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 will-change-transform transition-all" />
      </div>

      {/* Pantalla de Carga Estética */}
      <div className="loader-screen fixed inset-0 z-[100] bg-[#FAFAFB] flex items-center justify-center pointer-events-none">
        <div className="loader-content flex flex-col items-center gap-8 opacity-0 translate-y-8">
          <TetragrammatonIcon className="w-16 h-16 text-zinc-400 animate-[spin_10s_linear_infinite]" />
          <h2 className={`text-xl md:text-2xl text-silver-shimmer font-light tracking-[0.5em] uppercase ${cormorant.className}`}>Alineando</h2>
        </div>
      </div>

      <nav className="top-navbar fixed top-0 w-full z-40 bg-white/40 backdrop-blur-2xl shadow-[0_1px_30px_rgba(0,0,0,0.02)] border-b border-white/50">
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12 h-20 sm:h-24 flex items-center justify-between gap-4 sm:gap-8">
          <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="relative p-2 bg-white/80 rounded-full shadow-sm border border-zinc-100 group-hover:rotate-180 transition-all duration-[1.5s] ease-in-out shrink-0">
              <TetragrammatonIcon className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-600" />
            </div>
            <span className={`text-[16px] sm:text-2xl md:text-3xl font-medium tracking-widest text-silver-shimmer whitespace-nowrap ${cormorant.className}`}>
              liberacionenergetica
            </span>
          </div>

          <div className="flex-1 max-w-xl relative group hidden md:block">
            <div className="absolute inset-0 bg-white/60 rounded-full blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-6 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Buscar artefactos o servicios..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/70 backdrop-blur-md border border-zinc-200/80 shadow-[inset_0_2px_10px_rgba(0,0,0,0.01)] rounded-full py-3 pl-14 pr-6 text-[11px] font-bold tracking-[0.15em] text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-300 transition-all placeholder:text-zinc-400 uppercase"
              />
            </div>
          </div>

          <button onClick={openCart} className="relative p-3.5 bg-white/80 backdrop-blur-md rounded-full border border-zinc-200/80 hover:shadow-lg transition-all duration-300 active:scale-95 group shrink-0">
            <CartIcon className="w-5 h-5 text-zinc-600 group-hover:text-black transition-colors" />
            {mounted && totalItems > 0 && (
              <span className="cart-badge absolute -top-1 -right-1 bg-zinc-800 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-[2px] border-white shadow-sm">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-[90rem] mx-auto px-6 lg:px-12 pt-36 pb-40">
        
        {/* Carrusel Infinito (Estilo Galería de Arte) */}
        {banners.length > 0 && (
          <section className="carousel-container relative w-full aspect-[4/3] sm:aspect-[21/9] lg:aspect-[21/7] rounded-[2.5rem] overflow-hidden mb-24 border-[4px] border-white shadow-2xl shadow-zinc-200/50 group">
            <div className="carousel-track flex h-full will-change-transform w-max">
              {infiniteBanners.map((banner, i) => (
                <article key={`${banner.id}-${i}`} className="w-[100vw] max-w-[90rem] h-full relative shrink-0 px-0">
                  <Image src={banner.imageUrl} alt={banner.title} fill priority={i === 0} className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent mix-blend-multiply" />
                  <div className="absolute bottom-12 sm:bottom-24 left-8 sm:left-20 max-w-2xl text-white z-10">
                    <h3 className={`text-4xl sm:text-6xl md:text-7xl font-light tracking-wide mb-4 text-silver-shimmer drop-shadow-lg ${cormorant.className}`}>
                      {banner.title}
                    </h3>
                    {banner.subtitle && <p className="text-zinc-200 text-xs sm:text-sm font-medium tracking-[0.3em] uppercase">{banner.subtitle}</p>}
                  </div>
                </article>
              ))}
            </div>
            {/* Indicadores Minimalistas */}
            <div className="absolute bottom-8 right-12 flex gap-3 z-20">
              {banners.map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-sm" />)}
            </div>
          </section>
        )}

        {/* Filtros Limpios */}
        <div className="flex flex-wrap justify-center gap-4 mb-24 relative z-20">
          {dynamicFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-8 py-3.5 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 ${
                activeFilter === filter.id 
                  ? 'bg-zinc-800 text-white shadow-xl shadow-zinc-300 border border-zinc-800 scale-105' 
                  : 'bg-white/60 backdrop-blur-md text-zinc-500 border border-zinc-200/80 hover:bg-white hover:text-zinc-900 hover:shadow-md'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Grilla de Productos */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-center relative z-20">
            <TetragrammatonIcon className="w-20 h-20 text-zinc-200 mb-8 animate-[spin_15s_linear_infinite]" />
            <h3 className={`text-4xl text-zinc-400 mb-4 tracking-widest uppercase ${cormorant.className}`}>El Vacío</h3>
            <p className="text-zinc-400 text-xs font-bold tracking-[0.3em] uppercase">No hay manifestaciones para esta búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 items-start relative z-20">
            {filteredProducts.map((product, i) => (
              <div key={product.id} className={`product-card-wrapper w-full ${designPattern[i % designPattern.length]} ${i % 2 !== 0 ? 'lg:mt-24' : ''}`}>
                <article 
                  className="group relative flex flex-col gap-5 p-5 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white hover:border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-3 transition-all duration-700 cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-zinc-100/50">
                    <div className="absolute top-5 left-5 z-20 pointer-events-none">
                      <span className="px-4 py-2 text-[9px] font-bold tracking-[0.25em] uppercase rounded-full bg-white/90 backdrop-blur-md text-zinc-800 shadow-sm">
                        {product.type === 'SERVICE' ? 'Terapia' : product.type === 'PHYSICAL' ? 'Materia' : 'Etéreo'}
                      </span>
                    </div>
                    {product.imageUrl ? (
                      <Image 
                        src={product.imageUrl} 
                        alt={product.name} 
                        fill 
                        className="object-cover transition-all duration-[2s] ease-out group-hover:scale-110 group-hover:brightness-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <TetragrammatonIcon className="w-12 h-12 text-zinc-300 group-hover:rotate-180 transition-transform duration-[2s]" />
                      </div>
                    )}
                    {/* Overlay al hacer hover para invitar al clic */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-bold tracking-[0.2em] uppercase transition-opacity duration-500 drop-shadow-md">
                        Ver Visión
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col z-20 px-3 pb-2">
                    <h2 className={`text-2xl text-zinc-800 mb-2 group-hover:text-black transition-colors leading-tight ${cormorant.className}`}>
                      {product.name}
                    </h2>
                    <p className="text-[13px] text-zinc-500 font-medium leading-relaxed mb-6 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between pt-5 border-t border-zinc-200/50">
                      <p className={`text-2xl text-zinc-900 ${cormorant.className}`}>
                        {formatPrice(product.price)}
                      </p>
                      <button 
                        onClick={(e) => handleAddToCart(product, e)} 
                        disabled={product.stock === 0} 
                        className="relative flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 text-white hover:bg-zinc-700 transition-all duration-300 hover:scale-110 active:scale-95 shadow-md disabled:opacity-50 disabled:hover:scale-100 z-30"
                        title="Añadir al compendio"
                      >
                        <PlusIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- LIGHTBOX (Vista Inmersiva del Producto) --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-8">
          {/* Overlay oscuro con blur */}
          <div 
            className="absolute inset-0 bg-zinc-900/80 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out]"
            onClick={() => setSelectedProduct(null)}
          />
          
          {/* Contenedor Modal */}
          <div className="relative w-full max-w-6xl bg-[#FAFAFB] rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-[scaleUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
            
            {/* Botón Cerrar */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 z-50 p-3 bg-white/50 backdrop-blur-md rounded-full text-zinc-500 hover:text-black hover:bg-white transition-all"
            >
              <CloseIcon className="w-5 h-5" />
            </button>

            {/* Área de Imagen en Alta Calidad */}
            <div className="w-full md:w-1/2 relative bg-zinc-100 min-h-[40vh] md:min-h-full">
              {selectedProduct.imageUrl ? (
                <Image src={selectedProduct.imageUrl} alt={selectedProduct.name} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                  <TetragrammatonIcon className="w-24 h-24 text-zinc-300" />
                </div>
              )}
            </div>

            {/* Área de Detalles */}
            <div className="w-full md:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col overflow-y-auto custom-scrollbar">
              <span className="inline-block px-4 py-2 text-[10px] font-bold tracking-[0.3em] uppercase rounded-full bg-zinc-100 text-zinc-600 w-max mb-6">
                {selectedProduct.type === 'SERVICE' ? 'Terapia' : selectedProduct.type === 'PHYSICAL' ? 'Materia' : 'Etéreo'}
              </span>
              
              <h2 className={`text-4xl sm:text-5xl text-zinc-900 mb-6 leading-tight ${cormorant.className}`}>
                {selectedProduct.name}
              </h2>
              
              <div className="w-12 h-[1px] bg-zinc-300 mb-6" />
              
              <p className="text-zinc-600 leading-relaxed mb-8 text-sm sm:text-base whitespace-pre-line">
                {selectedProduct.description}
              </p>

              {selectedProduct.duration && (
                <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-8">
                  Duración del servicio: {selectedProduct.duration} min
                </p>
              )}
              
              <div className="mt-auto pt-8 flex items-center justify-between border-t border-zinc-200">
                <p className={`text-4xl text-zinc-900 ${cormorant.className}`}>
                  {formatPrice(selectedProduct.price)}
                </p>
                <button 
                  onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}
                  disabled={selectedProduct.stock === 0}
                  className="px-8 py-4 bg-zinc-900 text-white rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-zinc-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
                >
                  {selectedProduct.stock === 0 ? 'Agotado' : 'Adquirir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos CSS Inline para las animaciones del Modal para no depender de Tailwind config global */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}} />
    </div>
  );
}

// --- ICONOS ---
function SearchIcon(props: React.SVGProps<SVGSVGElement>) { return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>; }
function CartIcon(props: React.SVGProps<SVGSVGElement>) { return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>; }
function PlusIcon(props: React.SVGProps<SVGSVGElement>) { return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>; }
function CloseIcon(props: React.SVGProps<SVGSVGElement>) { return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>; }

function TetragrammatonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5" {...props}>
      <circle cx="100" cy="100" r="95" strokeDasharray="3 6" opacity="0.5" />
      <circle cx="100" cy="100" r="85" strokeWidth="0.75" />
      <circle cx="100" cy="100" r="65" opacity="0.3" />
      <polygon points="100,15 174,143 26,143" strokeWidth="0.75" />
      <polygon points="100,185 26,57 174,57" strokeWidth="0.75" />
      <rect x="50" y="50" width="100" height="100" transform="rotate(45 100 100)" strokeDasharray="2 2" opacity="0.6"/>
      <circle cx="100" cy="100" r="3" fill="currentColor" opacity="0.8" />
    </svg>
  );
}