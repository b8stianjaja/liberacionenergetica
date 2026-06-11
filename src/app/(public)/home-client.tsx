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

  // GSAP Animations (Cursor, Parallax, Loader)
  useGSAP(() => {
    const xTo = gsap.quickTo(cursorRef.current, "x", {duration: 0.15, ease: "power3"});
    const yTo = gsap.quickTo(cursorRef.current, "y", {duration: 0.15, ease: "power3"});
    const xAuraTo = gsap.quickTo(cursorAuraRef.current, "x", {duration: 0.6, ease: "power3"});
    const yAuraTo = gsap.quickTo(cursorAuraRef.current, "y", {duration: 0.6, ease: "power3"});

    const moveCursor = (e: MouseEvent) => { xTo(e.clientX); yTo(e.clientY); xAuraTo(e.clientX); yAuraTo(e.clientY); };
    window.addEventListener("mousemove", moveCursor);

    const interactives = document.querySelectorAll('.interactive-element');
    const expandCursor = () => { gsap.to(cursorRef.current, { scale: 3, backgroundColor: "rgba(255, 255, 255, 0.4)", mixBlendMode: "difference", duration: 0.3 }); gsap.to(cursorAuraRef.current, { scale: 0, opacity: 0, duration: 0.3 }); };
    const shrinkCursor = () => { gsap.to(cursorRef.current, { scale: 1, backgroundColor: "#E4E4E7", mixBlendMode: "normal", duration: 0.3 }); gsap.to(cursorAuraRef.current, { scale: 1, opacity: 1, duration: 0.3 }); };
    interactives.forEach(el => { el.addEventListener('mouseenter', expandCursor); el.addEventListener('mouseleave', shrinkCursor); });

    const tl = gsap.timeline();
    tl.to(".loader-content", { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
      .to(".loader-content", { opacity: 0, y: -40, scale: 0.9, duration: 0.6, delay: 0.6, ease: "power2.in" })
      .to(".loader-screen", { height: 0, duration: 1.2, ease: "expo.inOut" })
      .fromTo(".parallax-orb", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.5, stagger: 0.2, ease: "elastic.out(1, 0.4)" }, "-=0.8")
      .fromTo(".top-navbar", { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "expo.out" }, "-=1.8");

    gsap.to('.parallax-orb-1', { yPercent: 40, ease: "none", scrollTrigger: { trigger: container.current, start: "top top", end: "bottom top", scrub: true }});
    gsap.to('.parallax-orb-2', { yPercent: -30, xPercent: 20, ease: "none", scrollTrigger: { trigger: container.current, start: "top top", end: "bottom top", scrub: true }});
    
    // Animate the Tetragrammaton
    gsap.to('.sacred-geometry-bg', { rotation: 360, duration: 120, repeat: -1, ease: "none" });

    return () => { window.removeEventListener("mousemove", moveCursor); interactives.forEach(el => { el.removeEventListener('mouseenter', expandCursor); el.removeEventListener('mouseleave', shrinkCursor); }); };
  }, { scope: container }); 

  useGSAP(() => {
    const cards = gsap.utils.toArray('.product-card-wrapper') as HTMLElement[];
    cards.forEach((card, index) => {
      ScrollTrigger.create({
        trigger: card, start: "top 90%",
        animation: gsap.fromTo(card, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.5, ease: "expo.out", delay: index * 0.05 }),
        toggleActions: "play none none reverse"
      });
    });
  }, { scope: container, dependencies: [filteredProducts] });

  const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);

  const handleAddToCart = (product: Product, e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || null });
    gsap.fromTo(".cart-badge", { scale: 3, rotation: 180, backgroundColor: "#ffffff", opacity: 0 }, { scale: 1, rotation: 0, backgroundColor: "#E4E4E7", color: "#000", opacity: 1, duration: 1, ease: "elastic.out(1, 0.3)" });
  };

  const designPattern = ["col-span-1", "col-span-2", "col-span-1", "col-span-1", "col-span-2", "col-span-1"];

  return (
    <div ref={container} className={`relative min-h-screen bg-[#030305] text-zinc-200 ${montserrat.className} overflow-hidden cursor-none`}>
      
      {/* HOLOGRAPHIC NOISE */}
      <div className="fixed inset-0 z-0 opacity-[0.05] mix-blend-screen pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}/>

      {/* TETRAGRAMMATON WATERMARK */}
      <div className="sacred-geometry-bg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] opacity-[0.03] pointer-events-none z-0 text-zinc-300">
        <TetragrammatonIcon className="w-full h-full" />
      </div>

      {/* SILVER CURSOR */}
      <div ref={cursorRef} className="fixed top-0 left-0 w-3 h-3 bg-zinc-200 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
      <div ref={cursorAuraRef} className="fixed top-0 left-0 w-12 h-12 border border-zinc-400/30 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2" />

      {/* SILVER/OBSIDIAN ORBS */}
      <div className="parallax-orb parallax-orb-1 absolute top-[-5%] left-[-10%] w-[60vw] h-[60vw] bg-zinc-400/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="parallax-orb parallax-orb-2 absolute bottom-[-10%] right-[-15%] w-[50vw] h-[50vw] bg-slate-300/5 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* LOADER */}
      <div className="loader-screen fixed inset-0 z-[100] bg-[#030305] flex items-center justify-center pointer-events-none">
        <div className="loader-content flex flex-col items-center gap-6 opacity-0 translate-y-8">
          <TetragrammatonIcon className="w-24 h-24 text-zinc-300 animate-[spin_10s_linear_infinite]" />
          <h2 className={`text-4xl text-zinc-200 font-bold tracking-[0.2em] uppercase ${cormorant.className}`}>Iniciación</h2>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="top-navbar fixed top-0 w-full z-50 bg-[#030305]/60 backdrop-blur-3xl border-b border-white/5">
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12 h-24 flex items-center justify-between gap-8">
          <div className="interactive-element flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="p-2 border border-white/10 rounded-full group-hover:rotate-180 transition-transform duration-1000">
              <TetragrammatonIcon className="w-8 h-8 text-zinc-300" />
            </div>
            <span className={`text-2xl font-bold bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600 bg-clip-text text-transparent tracking-widest uppercase hidden sm:block ${cormorant.className}`}>
              L.E. Boutique
            </span>
          </div>

          <div className="flex-1 max-w-xl relative group hidden sm:block interactive-element">
            <SearchIcon className="absolute left-6 w-4 h-4 text-zinc-500 top-1/2 -translate-y-1/2 group-focus-within:text-zinc-200 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar frecuencia..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-14 pr-6 text-xs tracking-widest text-zinc-200 focus:outline-none focus:border-zinc-400/50 transition-all placeholder:text-zinc-600 uppercase"
            />
          </div>

          <button onClick={openCart} className="interactive-element relative p-4 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all active:scale-95">
            <CartIcon className="w-5 h-5 text-zinc-300" />
            {mounted && totalItems > 0 && <span className="cart-badge absolute -top-1 -right-1 bg-zinc-200 text-black text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#030305] shadow-[0_0_10px_rgba(255,255,255,0.5)]">{totalItems}</span>}
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-[90rem] mx-auto px-6 lg:px-12 pt-36 pb-40">
        
        {/* BRIDGE: SILVER FILTERS */}
        <div className="flex flex-wrap justify-center gap-4 mb-24 relative z-20">
          {dynamicFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`filter-pill interactive-element px-8 py-3 rounded-full text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-500 border ${
                activeFilter === filter.id 
                  ? 'bg-zinc-200 text-black border-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                  : 'bg-transparent text-zinc-500 border-white/10 hover:border-white/40 hover:text-zinc-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* SILVER SHOWCASE */}
        {filteredProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-32 text-center">
            <TetragrammatonIcon className="w-32 h-32 text-zinc-800 mb-8 animate-[spin_20s_linear_infinite]" />
            <h3 className={`text-3xl text-zinc-400 mb-4 tracking-widest uppercase ${cormorant.className}`}>Vacío Alquímico</h3>
            <p className="text-zinc-600 text-sm tracking-widest max-w-md leading-relaxed">Las energías solicitadas no se encuentran en este plano material.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-24 items-start">
            {filteredProducts.map((product, i) => (
              <div key={product.id} className={`product-card-wrapper w-full ${designPattern[i % designPattern.length]} ${i % 2 !== 0 ? 'lg:mt-24' : ''}`}>
                <article className="group relative flex flex-col gap-6 p-4 rounded-[2rem] hover:bg-white/[0.02] transition-colors duration-500 border border-transparent hover:border-white/5">
                  
                  {/* The Silver Archway (Image) */}
                  <div className="relative w-full aspect-[3/4] rounded-[1.5rem] overflow-hidden border border-white/10 bg-[#0A0A0C]">
                    <div className="absolute top-4 left-4 z-20 pointer-events-none">
                      <span className="px-3 py-1 text-[8px] font-black tracking-[0.4em] uppercase rounded-sm bg-black/50 backdrop-blur-md text-zinc-300 border border-white/10">
                        {product.type === 'SERVICE' ? 'Terapia' : product.type === 'PHYSICAL' ? 'Materia' : 'Etéreo'}
                      </span>
                    </div>

                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover transition-transform duration-[3s] ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100 grayscale hover:grayscale-0" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><TetragrammatonIcon className="w-16 h-16 text-zinc-800" /></div>
                    )}
                  </div>

                  <div className="flex flex-col z-20">
                    <h2 className={`text-3xl text-zinc-200 mb-2 transition-colors duration-500 group-hover:text-white ${cormorant.className}`}>
                      {product.name}
                    </h2>
                    <p className="text-[13px] text-zinc-500 leading-relaxed mb-6 line-clamp-3">
                      {product.description}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                      <p className={`text-xl text-zinc-300 ${cormorant.className}`}>
                        {formatPrice(product.price)}
                      </p>
                      <button onClick={(e) => handleAddToCart(product, e)} disabled={product.stock === 0} className="interactive-element w-10 h-10 rounded-full border border-zinc-600 flex items-center justify-center text-zinc-400 hover:bg-zinc-200 hover:text-black hover:border-zinc-200 transition-all active:scale-90 disabled:opacity-30">
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

// THE TETRAGRAMMATON / SACRED GEOMETRY ICON
function TetragrammatonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5" {...props}>
      <circle cx="100" cy="100" r="95" strokeDasharray="4 4" />
      <circle cx="100" cy="100" r="85" />
      <circle cx="100" cy="100" r="70" />
      {/* Interlocking Hexagram */}
      <polygon points="100,15 174,143 26,143" />
      <polygon points="100,185 26,57 174,57" />
      {/* Inner Square */}
      <rect x="50" y="50" width="100" height="100" transform="rotate(45 100 100)" />
      {/* Central Point */}
      <circle cx="100" cy="100" r="5" fill="currentColor" />
    </svg>
  );
}