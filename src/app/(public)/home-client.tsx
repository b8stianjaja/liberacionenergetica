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

  useGSAP(() => {
    const xTo = gsap.quickTo(cursorRef.current, "x", {duration: 0.15, ease: "power3"});
    const yTo = gsap.quickTo(cursorRef.current, "y", {duration: 0.15, ease: "power3"});
    const xAuraTo = gsap.quickTo(cursorAuraRef.current, "x", {duration: 0.6, ease: "power3"});
    const yAuraTo = gsap.quickTo(cursorAuraRef.current, "y", {duration: 0.6, ease: "power3"});

    const moveCursor = (e: MouseEvent) => { xTo(e.clientX); yTo(e.clientY); xAuraTo(e.clientX); yAuraTo(e.clientY); };
    window.addEventListener("mousemove", moveCursor);

    const interactives = document.querySelectorAll('.interactive-element');
    const expandCursor = () => { gsap.to(cursorRef.current, { scale: 3, backgroundColor: "rgba(161, 161, 170, 0.2)", mixBlendMode: "multiply", duration: 0.3 }); gsap.to(cursorAuraRef.current, { scale: 0, opacity: 0, duration: 0.3 }); };
    const shrinkCursor = () => { gsap.to(cursorRef.current, { scale: 1, backgroundColor: "#A1A1AA", mixBlendMode: "normal", duration: 0.3 }); gsap.to(cursorAuraRef.current, { scale: 1, opacity: 1, duration: 0.3 }); };
    interactives.forEach(el => { el.addEventListener('mouseenter', expandCursor); el.addEventListener('mouseleave', shrinkCursor); });

    const tl = gsap.timeline();
    tl.to(".loader-content", { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
      .to(".loader-content", { opacity: 0, y: -20, scale: 0.95, duration: 0.6, delay: 0.6, ease: "power2.in" })
      .to(".loader-screen", { height: 0, duration: 1.2, ease: "expo.inOut" })
      .fromTo(".parallax-orb", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 3, stagger: 0.3, ease: "sine.out" }, "-=0.8")
      .fromTo(".top-navbar", { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "expo.out" }, "-=1.8");

    gsap.to('.parallax-orb-1', { yPercent: 20, ease: "none", scrollTrigger: { trigger: container.current, start: "top top", end: "bottom top", scrub: true }});
    gsap.to('.parallax-orb-2', { yPercent: -15, xPercent: 10, ease: "none", scrollTrigger: { trigger: container.current, start: "top top", end: "bottom top", scrub: true }});
    gsap.to('.sacred-geometry-bg', { rotation: 360, duration: 180, repeat: -1, ease: "none" });

    return () => { window.removeEventListener("mousemove", moveCursor); interactives.forEach(el => { el.removeEventListener('mouseenter', expandCursor); el.removeEventListener('mouseleave', shrinkCursor); }); };
  }, { scope: container }); 

  useGSAP(() => {
    const cards = gsap.utils.toArray('.product-card-wrapper') as HTMLElement[];
    cards.forEach((card, index) => {
      ScrollTrigger.create({
        trigger: card, start: "top 90%",
        animation: gsap.fromTo(card, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", delay: index * 0.05 }),
        toggleActions: "play none none reverse"
      });
    });
  }, { scope: container, dependencies: [filteredProducts] });

  const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);

  const handleAddToCart = (product: Product, e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || null });
    gsap.fromTo(".cart-badge", { scale: 2, rotation: -180, backgroundColor: "#E4E4E7", opacity: 0 }, { scale: 1, rotation: 0, backgroundColor: "#27272A", color: "#fff", opacity: 1, duration: 1, ease: "elastic.out(1, 0.4)" });
  };

  const designPattern = ["col-span-1", "col-span-2", "col-span-1", "col-span-1", "col-span-2", "col-span-1"];

  return (
    <div ref={container} className={`relative min-h-screen bg-[#FCFCFD] text-zinc-800 ${montserrat.className} overflow-hidden cursor-none selection:bg-zinc-200 selection:text-black`}>
      
      {/* SOFT SILVER GRAIN */}
      <div className="fixed inset-0 z-0 opacity-[0.25] mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.95\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}/>

      {/* TETRAGRAMMATON WATERMARK (Subtle Light Silver) */}
      <div className="sacred-geometry-bg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110vw] h-[110vw] opacity-[0.03] pointer-events-none z-0 text-zinc-600">
        <TetragrammatonIcon className="w-full h-full" />
      </div>

      {/* DELICATE CHROME CURSOR */}
      <div ref={cursorRef} className="fixed top-0 left-0 w-2.5 h-2.5 bg-zinc-400 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(161,161,170,0.5)]" />
      <div ref={cursorAuraRef} className="fixed top-0 left-0 w-10 h-10 border border-zinc-300 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-opacity" />

      {/* ETHEREAL ORBS */}
      <div className="parallax-orb parallax-orb-1 absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-zinc-200/40 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="parallax-orb parallax-orb-2 absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-white/60 blur-[100px] rounded-full pointer-events-none z-0" />

      {/* SERENE LOADER */}
      <div className="loader-screen fixed inset-0 z-[100] bg-[#FCFCFD] flex items-center justify-center pointer-events-none">
        <div className="loader-content flex flex-col items-center gap-8 opacity-0 translate-y-4">
          <TetragrammatonIcon className="w-20 h-20 text-zinc-300 animate-[spin_12s_linear_infinite]" />
          <h2 className={`text-3xl text-zinc-500 font-medium tracking-[0.3em] uppercase ${cormorant.className}`}>Apertura</h2>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="top-navbar fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-zinc-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12 h-24 flex items-center justify-between gap-8">
          <div className="interactive-element flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="p-2 border border-zinc-200 rounded-full group-hover:border-zinc-400 group-hover:rotate-180 transition-all duration-1000 bg-white">
              <TetragrammatonIcon className="w-7 h-7 text-zinc-400" />
            </div>
            {/* EXACT HEADER REQUEST */}
            <span className={`text-xl sm:text-2xl font-medium text-zinc-800 tracking-wider hidden sm:block ${cormorant.className}`}>
              liberacionenergetica™ Boutique
            </span>
          </div>

          <div className="flex-1 max-w-xl relative group hidden sm:block interactive-element">
            <SearchIcon className="absolute left-6 w-4 h-4 text-zinc-400 top-1/2 -translate-y-1/2 group-focus-within:text-zinc-700 transition-colors" />
            <input 
              type="text" 
              placeholder="Sintoniza tu búsqueda..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-full py-3.5 pl-14 pr-6 text-xs tracking-widest text-zinc-800 focus:outline-none focus:border-zinc-400 focus:shadow-[0_0_20px_rgba(212,212,216,0.5)] transition-all placeholder:text-zinc-400 uppercase shadow-sm"
            />
          </div>

          <button onClick={openCart} className="interactive-element relative p-4 bg-white rounded-full border border-zinc-200 hover:border-zinc-400 hover:shadow-md transition-all active:scale-95 shadow-sm group">
            <CartIcon className="w-5 h-5 text-zinc-500 group-hover:text-zinc-800 transition-colors" />
            {mounted && totalItems > 0 && <span className="cart-badge absolute -top-1 -right-1 bg-zinc-800 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">{totalItems}</span>}
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-[90rem] mx-auto px-6 lg:px-12 pt-40 pb-40">
        
        {/* BRIDGE: LIGHT SILVER FILTERS */}
        <div className="flex flex-wrap justify-center gap-3 mb-24 relative z-20">
          {dynamicFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`filter-pill interactive-element px-8 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 border ${
                activeFilter === filter.id 
                  ? 'bg-zinc-800 text-white border-zinc-800 shadow-[0_8px_20px_rgba(0,0,0,0.1)]' 
                  : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-zinc-800 hover:shadow-sm'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* HEALING SHOWCASE */}
        {filteredProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-32 text-center">
            <TetragrammatonIcon className="w-24 h-24 text-zinc-300 mb-8 animate-[spin_30s_linear_infinite]" />
            <h3 className={`text-3xl text-zinc-600 mb-4 tracking-widest uppercase ${cormorant.className}`}>Silencio Interior</h3>
            <p className="text-zinc-400 text-sm tracking-widest max-w-md leading-relaxed">No se encontraron vibraciones en esta sintonía actual.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-24 items-start">
            {filteredProducts.map((product, i) => (
              <div key={product.id} className={`product-card-wrapper w-full ${designPattern[i % designPattern.length]} ${i % 2 !== 0 ? 'lg:mt-24' : ''}`}>
                <article className="group relative flex flex-col gap-6 p-4 rounded-[2rem] bg-white hover:shadow-[0_20px_60px_rgba(212,212,216,0.3)] transition-all duration-700 border border-zinc-100 hover:border-zinc-200">
                  
                  {/* The Pure Archway (Image) */}
                  <div className="relative w-full aspect-[3/4] rounded-[1.5rem] overflow-hidden border border-zinc-100 bg-[#F4F4F5]">
                    <div className="absolute top-4 left-4 z-20 pointer-events-none">
                      <span className="px-3 py-1 text-[8px] font-black tracking-[0.3em] uppercase rounded-full bg-white/90 backdrop-blur-sm text-zinc-600 border border-zinc-200 shadow-sm">
                        {product.type === 'SERVICE' ? 'Terapia' : product.type === 'PHYSICAL' ? 'Materia' : 'Etéreo'}
                      </span>
                    </div>

                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover transition-transform duration-[4s] ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-50"><TetragrammatonIcon className="w-16 h-16 text-zinc-200" /></div>
                    )}
                  </div>

                  <div className="flex flex-col z-20 px-2">
                    <h2 className={`text-2xl text-zinc-800 mb-2 transition-colors duration-500 ${cormorant.className}`}>
                      {product.name}
                    </h2>
                    <p className="text-[13px] text-zinc-500 leading-relaxed mb-6 line-clamp-3">
                      {product.description}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-6">
                      <p className={`text-xl text-zinc-800 font-medium ${cormorant.className}`}>
                        {formatPrice(product.price)}
                      </p>
                      <button onClick={(e) => handleAddToCart(product, e)} disabled={product.stock === 0} className="interactive-element w-10 h-10 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-800 transition-all active:scale-90 disabled:opacity-30 shadow-sm">
                        <PlusIcon className="w-4 h-4" />
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

// --- Icons ---
function SearchIcon(props: React.SVGProps<SVGSVGElement>) { return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>; }
function CartIcon(props: React.SVGProps<SVGSVGElement>) { return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>; }
function PlusIcon(props: React.SVGProps<SVGSVGElement>) { return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>; }

// SACRED GEOMETRY / TETRAGRAMMATON ICON
function TetragrammatonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5" {...props}>
      <circle cx="100" cy="100" r="95" strokeDasharray="4 4" />
      <circle cx="100" cy="100" r="85" />
      <circle cx="100" cy="100" r="70" />
      <polygon points="100,15 174,143 26,143" />
      <polygon points="100,185 26,57 174,57" />
      <rect x="50" y="50" width="100" height="100" transform="rotate(45 100 100)" />
      <circle cx="100" cy="100" r="4" fill="currentColor" />
    </svg>
  );
}