"use client";

import { useRef, useEffect, useState, useMemo, MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { useCart } from "@/context/CartContext";

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

  useEffect(() => { setMounted(true); window.scrollTo(0, 0); }, []);

  const dynamicFilters = useMemo(() => [{ id: 'ALL', label: 'El Todo' }, ...categories.map(cat => ({ id: cat.id, label: cat.name }))], [categories]);
  const filteredProducts = useMemo(() => products.filter((product) => (activeFilter === 'ALL' || product.categoryId === activeFilter || product.type === activeFilter) && (product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description.toLowerCase().includes(searchQuery.toLowerCase()))), [products, activeFilter, searchQuery]);

  // OPTIMIZATION: Reduced particle count for better performance
  const magicDust = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i, size: Math.random() * 3 + 1, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, delay: Math.random() * 2
  })), []);

  useGSAP(() => {
    const xTo = gsap.quickTo(cursorRef.current, "x", {duration: 0.1, ease: "power3"});
    const yTo = gsap.quickTo(cursorRef.current, "y", {duration: 0.1, ease: "power3"});
    const xAuraTo = gsap.quickTo(cursorAuraRef.current, "x", {duration: 0.5, ease: "power3"});
    const yAuraTo = gsap.quickTo(cursorAuraRef.current, "y", {duration: 0.5, ease: "power3"});

    const moveCursor = (e: MouseEvent) => { xTo(e.clientX); yTo(e.clientY); xAuraTo(e.clientX); yAuraTo(e.clientY); };
    window.addEventListener("mousemove", moveCursor);

    gsap.to(".magic-particle", {
      y: "random(-50, 50)", x: "random(-30, 30)", opacity: "random(0.1, 0.6)",
      duration: "random(8, 15)", repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.2
    });

    const tl = gsap.timeline();
    tl.to(".loader-content", { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
      .to(".loader-screen", { opacity: 0, duration: 1.5, ease: "power2.inOut", delay: 1 })
      .fromTo(".parallax-orb", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 3, stagger: 0.3, ease: "power2.out" }, "-=1")
      .fromTo(".top-navbar", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "expo.out" }, "-=2");

    gsap.to('.sacred-geometry-bg', { rotation: 360, duration: 250, repeat: -1, ease: "none" });

    return () => { window.removeEventListener("mousemove", moveCursor); };
  }, { scope: container }); 

  // RESTORED: CAROUSEL ENGINE
  useGSAP(() => {
    if (banners.length < 2) return;
    const track = document.querySelector('.carousel-track') as HTMLElement;
    if (track && track.children.length === banners.length) {
      const clone = track.children[0].cloneNode(true);
      track.appendChild(clone);
    }
    const slideWidth = 100; 
    const carouselTL = gsap.timeline({ repeat: -1 });
    
    for (let i = 1; i <= banners.length; i++) {
      carouselTL.fromTo(`.carousel-item-${i} .banner-text`, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "expo.out" }, "+=0.5")
      .to(".carousel-track", { xPercent: -slideWidth * i, duration: 2, ease: "power3.inOut" }, "+=4") 
      .to(`.carousel-item-${i} .banner-text`, { y: -20, opacity: 0, duration: 1 }, "-=2");
    }
    carouselTL.set(".carousel-track", { xPercent: 0 }); 
  }, { scope: container, dependencies: [banners] });

  useGSAP(() => {
    const cards = gsap.utils.toArray('.product-card-wrapper') as HTMLElement[];
    cards.forEach((card, index) => {
      ScrollTrigger.create({
        trigger: card, start: "top 85%",
        animation: gsap.fromTo(card, { opacity: 0, y: 40, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "expo.out", delay: index * 0.05 }),
        toggleActions: "play none none reverse"
      });
    });
  }, { scope: container, dependencies: [filteredProducts] });

  const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);

  const handleAddToCart = (product: Product, e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || null });
    gsap.fromTo(".cart-badge", { scale: 2, rotation: -180, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 1, ease: "elastic.out(1, 0.4)" });
  };

  const designPattern = ["col-span-1", "col-span-2", "col-span-1", "col-span-1", "col-span-2", "col-span-1"];

  return (
    <div ref={container} className={`relative min-h-screen bg-[#FAFAFB] text-zinc-800 ${montserrat.className} overflow-hidden cursor-none selection:bg-zinc-300 selection:text-black`}>
      
      {magicDust.map((p) => (
        <div key={p.id} className="magic-particle absolute rounded-full bg-gradient-to-r from-zinc-300 to-white shadow-[0_0_8px_rgba(255,255,255,0.8)] pointer-events-none z-0 will-change-transform" style={{ width: p.size, height: p.size, top: p.top, left: p.left, opacity: 0 }} />
      ))}

      <div className="sacred-geometry-bg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] opacity-[0.03] pointer-events-none z-0 text-zinc-500 will-change-transform">
        <TetragrammatonIcon className="w-full h-full drop-shadow-xl" />
      </div>

      <div className="parallax-orb absolute top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-white rounded-full blur-[100px] pointer-events-none z-0 opacity-80 will-change-transform" />
      <div className="parallax-orb absolute bottom-[20%] -right-[10%] w-[60vw] h-[60vw] bg-zinc-200/40 rounded-full blur-[120px] pointer-events-none z-0 will-change-transform" />

      <div ref={cursorRef} className="fixed top-0 left-0 w-2 h-2 bg-zinc-500 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(161,161,170,0.8)] mix-blend-difference will-change-transform" />
      <div ref={cursorAuraRef} className="fixed top-0 left-0 w-12 h-12 border border-zinc-300 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 backdrop-blur-[1px] will-change-transform" />

      <div className="loader-screen fixed inset-0 z-[100] bg-[#FAFAFB] flex items-center justify-center pointer-events-none">
        <div className="loader-content flex flex-col items-center gap-6 opacity-0 translate-y-4">
          <div className="relative flex items-center justify-center w-32 h-32">
            <TetragrammatonIcon className="w-24 h-24 text-zinc-300 animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent rounded-full animate-pulse" />
          </div>
          <h2 className={`text-3xl text-silver-shimmer font-medium tracking-[0.3em] uppercase ${cormorant.className}`}>Alineando</h2>
        </div>
      </div>

      <nav className="top-navbar fixed top-0 w-full z-50 bg-white/50 backdrop-blur-3xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border-b border-zinc-200/50">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12 h-20 sm:h-24 flex items-center justify-between gap-4 sm:gap-8">
          <div className="flex items-center gap-2 sm:gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="relative p-2 sm:p-2.5 bg-gradient-to-br from-white to-zinc-100 rounded-full border border-zinc-200 group-hover:rotate-180 transition-all duration-[1.5s] shrink-0">
              <TetragrammatonIcon className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-500 group-hover:text-zinc-800 transition-colors" />
            </div>
            {/* FIX: Removed 'hidden sm:block', adjusted text sizes for mobile */}
            <span className={`text-[14px] sm:text-xl md:text-2xl font-medium tracking-wide text-silver-shimmer whitespace-nowrap ${cormorant.className}`}>
              liberacionenergetica™
            </span>
          </div>

          <div className="flex-1 max-w-xl relative group hidden md:block">
            <div className="absolute inset-0 bg-zinc-100/50 rounded-full blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-6 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-800 transition-colors" />
              <input 
                type="text" 
                placeholder="Revelar artefactos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/80 backdrop-blur-md border border-zinc-200 shadow-sm rounded-full py-3.5 pl-14 pr-6 text-[10px] font-bold tracking-widest text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-300 transition-all placeholder:text-zinc-400 uppercase"
              />
            </div>
          </div>

          <button onClick={openCart} className="relative p-3 sm:p-4 bg-gradient-to-b from-white to-zinc-50 rounded-full border border-zinc-200 hover:shadow-md transition-all active:scale-95 group shrink-0">
            <CartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600 group-hover:text-black transition-colors" />
            {mounted && totalItems > 0 && (
              <span className="cart-badge absolute -top-1.5 -right-1.5 bg-gradient-to-br from-zinc-700 to-zinc-900 text-white text-[9px] font-black w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-[90rem] mx-auto px-6 lg:px-12 pt-32 pb-40">
        
        {/* RESTORED: CAROUSEL BANNER */}
        {banners.length > 0 && (
          <section className="carousel-container relative w-full aspect-[4/3] sm:aspect-[21/9] lg:aspect-[21/7] rounded-[2.5rem] overflow-hidden mb-24 border-silver-real shadow-[0_20px_50px_rgba(0,0,0,0.05)] group">
            <div className="carousel-track flex w-full h-full will-change-transform">
              {banners.map((banner, i) => (
                <article key={banner.id} className={`carousel-item-${i+1} flex-shrink-0 w-full h-full relative`}>
                  <Image src={banner.imageUrl} alt={banner.title} fill priority={i === 0} className="object-cover transition-transform duration-[10s] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/20 to-transparent" />
                  <div className="absolute bottom-10 sm:bottom-16 left-8 sm:left-16 max-w-2xl text-white z-10">
                    <div className="banner-text">
                      <h3 className={`text-3xl sm:text-5xl md:text-6xl font-medium tracking-wide mb-3 text-silver-shimmer ${cormorant.className}`}>{banner.title}</h3>
                      {banner.subtitle && <p className="text-zinc-200 text-sm sm:text-base font-medium max-w-md tracking-widest uppercase">{banner.subtitle}</p>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="absolute bottom-6 right-6 flex gap-2 z-10">
              {banners.map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-white/40 border border-white/50" />)}
            </div>
          </section>
        )}

        <div className="flex flex-wrap justify-center gap-3 mb-20 relative z-20">
          {dynamicFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2.5 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase transition-all duration-500 shadow-sm ${
                activeFilter === filter.id 
                  ? 'bg-gradient-to-r from-zinc-800 to-zinc-700 text-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] border border-zinc-900' 
                  : 'bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-300 hover:text-zinc-800 hover:bg-zinc-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-32 text-center relative">
            <TetragrammatonIcon className="w-32 h-32 text-zinc-300 mb-8 animate-[spin_20s_linear_infinite] drop-shadow-xl relative z-10" />
            <h3 className={`text-4xl text-zinc-800 mb-4 tracking-widest uppercase relative z-10 ${cormorant.className}`}>Silencio Cuántico</h3>
            <p className="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase relative z-10">La materia aún no se ha manifestado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20 items-start">
            {filteredProducts.map((product, i) => (
              <div key={product.id} className={`product-card-wrapper w-full ${designPattern[i % designPattern.length]} ${i % 2 !== 0 ? 'lg:mt-24' : ''}`}>
                <article className="group relative flex flex-col gap-5 p-4 rounded-[2rem] bg-white/60 backdrop-blur-xl shadow-[0_5px_20px_rgba(0,0,0,0.02)] border-silver-real hover:shadow-[0_15px_40px_rgba(161,161,170,0.15)] hover:-translate-y-2 transition-all duration-700">
                  <div className="relative w-full aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-zinc-50 border border-white">
                    <div className="absolute top-4 left-4 z-20 pointer-events-none">
                      <span className="px-3 py-1.5 text-[7px] font-black tracking-[0.3em] uppercase rounded-full bg-white/90 backdrop-blur-md text-zinc-700 border border-zinc-200 shadow-sm">
                        {product.type === 'SERVICE' ? 'Terapia' : product.type === 'PHYSICAL' ? 'Materia' : 'Etéreo'}
                      </span>
                    </div>
                    {product.imageUrl ? (
                      <>
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover transition-transform duration-[5s] ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/10 to-transparent pointer-events-none" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <TetragrammatonIcon className="w-16 h-16 text-zinc-200 group-hover:scale-110 transition-transform duration-[3s]" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col z-20 px-2">
                    <h2 className={`text-2xl text-zinc-800 mb-2 group-hover:text-black transition-colors duration-500 leading-tight ${cormorant.className}`}>
                      {product.name}
                    </h2>
                    <p className="text-[12px] text-zinc-500 font-medium leading-relaxed mb-6 line-clamp-3">
                      {product.description}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between pt-4 relative border-t border-zinc-100">
                      <p className={`text-xl text-zinc-800 font-semibold ${cormorant.className}`}>
                        {formatPrice(product.price)}
                      </p>
                      <button onClick={(e) => handleAddToCart(product, e)} disabled={product.stock === 0} className="relative flex items-center justify-center w-10 h-10 rounded-full border-silver-real bg-gradient-to-b from-white to-zinc-50 hover:from-zinc-100 hover:to-zinc-200 transition-all duration-300 active:scale-90 shadow-sm group/btn disabled:opacity-50">
                        <PlusIcon className="w-4 h-4 text-zinc-500 group-hover/btn:text-zinc-900 transition-colors" />
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

function SearchIcon(props: React.SVGProps<SVGSVGElement>) { return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>; }
function CartIcon(props: React.SVGProps<SVGSVGElement>) { return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>; }
function PlusIcon(props: React.SVGProps<SVGSVGElement>) { return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>; }

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