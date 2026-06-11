"use client";

import { useRef, useEffect, useState, useMemo, MouseEvent as ReactMouseEvent } from "react";
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

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export type Category = { id: string; name: string; };
export type Product = {
  id: string; name: string; description: string;
  price: number; type: string; categoryId: string | null;
  duration: number | null; stock: number; imageUrl: string | null;
};

export default function HomeClient({ products, categories }: { products: Product[], categories: Category[] }) {
  const container = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorAuraRef = useRef<HTMLDivElement>(null);
  const { addItem, totalItems, openCart } = useCart();
  
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  // MOCK BANNER DATA - This would come from Liberacion-API/Cloudinary
  const banners = useMemo(() => [
    { id: 'b1', title: 'Cosmic Renewal Sale', subtitle: '30% off all services this month.', imageUrl: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1600' },
    { id: 'b2', title: 'MANIFEST YOUR DESIRES', subtitle: 'Etéreo tools, special prices.', imageUrl: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=1600' },
    { id: 'b3', title: 'Spiritual Synergy Pack', subtitle: 'Buy 2, Get 1 free on select products.', imageUrl: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=1600' },
  ], []);

  useEffect(() => {
    setMounted(true);
    // Lock scroll exclusively during initial load
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    
    // Forcefully scroll to top on reload to prevent ScrollTrigger miscalculations
    window.scrollTo(0, 0);
    
    return () => { 
      document.documentElement.style.overflow = "";
      document.body.style.overflow = ""; 
    };
  }, []);

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

  // HOOK 1: CORE ENGINE (Loader, Hero, Cursor, and Parallax)
  useGSAP(() => {
    // --- Custom Cursor Physics (Hardware Accelerated) ---
    const xTo = gsap.quickTo(cursorRef.current, "x", {duration: 0.15, ease: "power3"});
    const yTo = gsap.quickTo(cursorRef.current, "y", {duration: 0.15, ease: "power3"});
    const xAuraTo = gsap.quickTo(cursorAuraRef.current, "x", {duration: 0.6, ease: "power3"});
    const yAuraTo = gsap.quickTo(cursorAuraRef.current, "y", {duration: 0.6, ease: "power3"});

    const moveCursor = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xAuraTo(e.clientX);
      yAuraTo(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);

    // Make cursor react to interactive elements
    const interactives = document.querySelectorAll('.interactive-element');
    const expandCursor = () => {
      gsap.to(cursorRef.current, { scale: 3, backgroundColor: "rgba(192, 132, 252, 0.4)", mixBlendMode: "difference", duration: 0.3 });
      gsap.to(cursorAuraRef.current, { scale: 0, opacity: 0, duration: 0.3 });
    };
    const shrinkCursor = () => {
      gsap.to(cursorRef.current, { scale: 1, backgroundColor: "#c084fc", mixBlendMode: "normal", duration: 0.3 });
      gsap.to(cursorAuraRef.current, { scale: 1, opacity: 1, duration: 0.3 });
    };

    interactives.forEach(el => {
      el.addEventListener('mouseenter', expandCursor);
      el.addEventListener('mouseleave', shrinkCursor);
    });

    // --- Timeline Animations ---
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        ScrollTrigger.refresh();
      }
    });

    // 1. Original Loader sequence
    tl.to(".loader-content", { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
      .to(".loader-content", { opacity: 0, y: -40, scale: 0.9, duration: 0.6, delay: 0.6, ease: "power2.in" })
      .to(".loader-screen", { height: 0, duration: 1.2, ease: "expo.inOut" })
      
      // 2. Hero Orchestration
      .fromTo(".parallax-orb", 
        { scale: 0, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 2.5, stagger: 0.2, ease: "elastic.out(1, 0.4)" }, 
        "-=0.8"
      )
      .fromTo(".top-navbar",
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "expo.out" },
        "-=1.8"
      )
      .fromTo(".hero-text-line",
        { y: 120, opacity: 0, rotateX: -60 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.8, stagger: 0.1, ease: "power4.out", transformOrigin: "bottom center" },
        "-=1.5"
      )
      .fromTo(".filter-pill",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.05, ease: "back.out(1.5)" },
        "-=1.2"
      );

    // --- Deep Parallax Orbs (Triggered on Scroll) ---
    gsap.to('.parallax-orb-1', {
      yPercent: 40,
      ease: "none",
      scrollTrigger: { trigger: container.current, start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to('.parallax-orb-2', {
      yPercent: -30,
      xPercent: 20,
      ease: "none",
      scrollTrigger: { trigger: container.current, start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to('.parallax-orb-3', {
      yPercent: 60,
      ease: "none",
      scrollTrigger: { trigger: container.current, start: "top top", end: "bottom top", scrub: true }
    });

    // Cleanup memory leaks
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', expandCursor);
        el.removeEventListener('mouseleave', shrinkCursor);
      });
    };
  }, { scope: container }); 

  // HOOK 2: PROMOTIONAL CAROUSEL ENGINE
  useGSAP(() => {
    if (banners.length < 2) return;
    
    // Add cloned slide to the end for seamless loop
    const track = document.querySelector('.carousel-track') as HTMLElement;
    if (track && track.children.length === banners.length) {
      const clone = track.children[0].cloneNode(true);
      track.appendChild(clone);
    }

    const slideCount = banners.length;
    const totalSlides = slideCount + 1;
    const slideWidth = 100; // in percent
    
    const carouselTL = gsap.timeline({
      repeat: -1, 
      scrollTrigger: { 
        trigger: ".carousel-container", 
        start: "top 90%", 
        toggleActions: "play none none none" 
      }
    });

    carouselTL.set('.carousel-track', { xPercent: 0 }); // reset

    // Animate slides and labels
    for (let i = 1; i <= slideCount; i++) {
      // Per slide text animation trigger
      carouselTL.fromTo(`.carousel-item-${i} .banner-text`,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "expo.out" },
        "+=0.5"
      )
      .to(".carousel-track", {
        xPercent: -slideWidth * i, 
        duration: 2.5, 
        ease: "power3.inOut"
      }, "+=3") // slide speed, plus pause before moving
      .addLabel(`slide-${i+1}`)
      
      // text out trigger
      .to(`.carousel-item-${i} .banner-text`, { y: -30, opacity: 0, duration: 1 }, "-=2.5");
    }

    // Go to the cloned first slide, then snap back
    carouselTL.set(".carousel-track", { xPercent: 0 }); // Seamless snap back

  }, { scope: container, dependencies: [banners] });

  // HOOK 3: DYNAMIC PRODUCT CASCADES (Re-runs safely on filter change)
  useGSAP(() => {
    const cards = gsap.utils.toArray('.product-card-wrapper') as HTMLElement[];
    
    // Kill old scroll triggers before applying new ones to prevent stacking
    ScrollTrigger.getAll().forEach(t => {
      if (t.vars.trigger && (t.vars.trigger as HTMLElement).classList?.contains('product-card-wrapper')) {
        t.kill();
      }
    });

    cards.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, y: 200, scale: 0.85, rotateY: index % 2 === 0 ? -15 : 15, rotateX: 10 },
        {
          opacity: 1, y: 0, scale: 1, rotateY: 0, rotateX: 0,
          duration: 1.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 95%",
            toggleActions: "play none none reverse",
          }
        }
      );
    });

    ScrollTrigger.refresh(); 
  }, { scope: container, dependencies: [filteredProducts] });

  // 3D Hardware Accelerated Card Hover
  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;

    gsap.to(card.querySelector('.card-inner'), {
      rotateX,
      rotateY,
      scale: 1.03,
      transformPerspective: 1000,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = (e: ReactMouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget.querySelector('.card-inner'), {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 1.2,
      ease: "elastic.out(1.2, 0.3)"
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);
  };

  const handleAddToCart = (product: Product, e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || null,
    });

    gsap.fromTo(".cart-badge", 
      { scale: 3, rotation: 180, backgroundColor: "#c084fc", opacity: 0 }, 
      { scale: 1, rotation: 0, backgroundColor: "#111827", opacity: 1, duration: 1, ease: "elastic.out(1, 0.3)" }
    );
  };

  // ASYMMETRICAL EDITORIAL PATTERN
  const designPattern = ["col-span-1", "col-span-2", "col-span-1", "col-span-1", "col-span-2", "col-span-1"];

  return (
    <div ref={container} className={`relative min-h-screen bg-[#F7F7F9] text-gray-900 ${montserrat.className} selection:bg-purple-300 selection:text-purple-900 overflow-hidden cursor-none`}>
      
      {/* GLOBAL CSS INJECTION: Kills scrollbars and cursor natively */}
      <style dangerouslySetInnerHTML={{__html: `
        html, body {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
          cursor: none;
        }
        *::-webkit-scrollbar { display: none !important; }
        .perspective-container { perspective: 2000px; transform-style: preserve-3d; }
      `}} />

      {/* HOLOGRAPHIC NOISE SURFACE */}
      <div className="fixed inset-0 z-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}/>

      {/* ETHEREAL CUSTOM CURSOR */}
      <div ref={cursorRef} className="fixed top-0 left-0 w-3 h-3 bg-fuchsia-400 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 will-change-transform shadow-[0_0_20px_rgba(232,121,249,0.8)]" />
      <div ref={cursorAuraRef} className="fixed top-0 left-0 w-12 h-12 border border-fuchsia-300/50 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 will-change-transform transition-opacity" />

      {/* DEEP PARALLAX AMBIENT ORBS */}
      <div className="parallax-orb parallax-orb-1 absolute top-[-5%] left-[-10%] w-[60vw] h-[60vw] bg-fuchsia-400/20 blur-[150px] rounded-full pointer-events-none z-0 will-change-transform" />
      <div className="parallax-orb parallax-orb-2 absolute top-[20%] right-[-15%] w-[50vw] h-[50vw] bg-indigo-500/15 blur-[140px] rounded-full pointer-events-none z-0 will-change-transform" />
      <div className="parallax-orb parallax-orb-3 absolute bottom-[-20%] left-[20%] w-[55vw] h-[55vw] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none z-0 will-change-transform" />

      {/* ORIGINAL PRESERVED LOADER */}
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

      <nav className="top-navbar fixed top-0 w-full z-50 bg-white/30 backdrop-blur-3xl border-b border-white/50 shadow-[0_4px_40px_rgba(0,0,0,0.02)] opacity-0">
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12 h-24 flex items-center justify-between gap-8">
          <div className="interactive-element flex items-center gap-4 shrink-0 group transition-opacity">
            <div className="bg-gray-900 p-2.5 rounded-2xl text-white shadow-2xl shadow-gray-900/30 group-hover:rotate-90 transition-transform duration-700 ease-in-out hidden sm:block">
              <SparkleStarIcon className="w-6 h-6" />
            </div>
            <span className={`text-3xl font-bold text-gray-900 tracking-tighter ${cormorant.className}`}>
              L.E. Boutique
            </span>
          </div>

          <div className="flex-1 max-w-2xl relative group hidden sm:block interactive-element">
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 to-indigo-500/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-6 w-5 h-5 text-gray-400 group-focus-within:text-fuchsia-500 transition-colors duration-500" />
              <input 
                type="text" 
                placeholder="Busca la frecuencia que tu alma necesita..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/60 backdrop-blur-md border border-white rounded-2xl py-4 pl-16 pr-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-fuchsia-400/30 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <button 
            onClick={openCart} 
            className="interactive-element relative p-4 bg-white/70 backdrop-blur-xl rounded-2xl text-gray-900 border border-white shadow-lg hover:bg-gray-900 hover:text-white transition-all duration-500 shrink-0 active:scale-90"
          >
            <CartIcon className="w-6 h-6" />
            {mounted && totalItems > 0 && (
              <span className="cart-badge absolute -top-2 -right-2 bg-fuchsia-500 text-white text-xs font-black w-7 h-7 rounded-xl flex items-center justify-center border-[3px] border-[#F7F7F9] shadow-xl">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-[90rem] mx-auto px-6 lg:px-12 pt-48 pb-40">
        
        {/* HERO SECTION */}
        <header className="flex flex-col xl:flex-row justify-between items-end gap-16 mb-40 perspective-container">
          <div className="max-w-4xl w-full">
            <div className="hero-text-line overflow-hidden mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/40 backdrop-blur-xl border border-white shadow-xl shadow-fuchsia-900/5 text-fuchsia-800 text-xs font-black tracking-[0.3em] uppercase">
                <SparkleStarIcon className="w-4 h-4 animate-[spin_5s_linear_infinite]" /> Alineación Cuántica
              </div>
            </div>
            
            <h1 className={`text-6xl sm:text-7xl md:text-[8rem] lg:text-[9.5rem] font-medium text-gray-900 tracking-tighter leading-[0.85] ${cormorant.className}`}>
              <div className="hero-text-line overflow-hidden pb-4">
                <span>Santuario</span>
              </div>
              <div className="hero-text-line overflow-hidden">
                <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-purple-600">
                  Energético.
                </span>
              </div>
            </h1>
            
            <div className="hero-text-line mt-12">
              <p className="text-gray-500 font-medium text-lg sm:text-xl md:text-2xl leading-relaxed max-w-2xl border-l-[3px] border-fuchsia-300 pl-8">
                Un portal de frecuencias curativas. Descubre herramientas ancestrales y etéreas para restaurar el orden natural de tu espíritu y materia.
              </p>
            </div>
          </div>

          <div className="w-full xl:w-auto flex flex-wrap xl:flex-col justify-start xl:justify-end gap-4 pb-4">
            {dynamicFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`filter-pill interactive-element relative px-8 py-4 rounded-2xl text-[12px] font-black tracking-[0.2em] uppercase transition-all duration-700 overflow-hidden group ${
                  activeFilter === filter.id 
                    ? 'text-white scale-105 shadow-2xl shadow-fuchsia-500/40 border-transparent' 
                    : 'bg-white/40 backdrop-blur-md text-gray-500 hover:text-gray-900 border border-white hover:bg-white hover:shadow-2xl hover:-translate-y-1'
                }`}
              >
                {activeFilter === filter.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black -z-10" />
                )}
                {filter.label}
              </button>
            ))}
          </div>
        </header>

        {/* PROMOTIONAL CAROUSEL BANNER SECTION */}
        {banners.length > 0 && (
          <section className="carousel-container relative w-full aspect-[21/9] sm:aspect-[21/7] rounded-[3.5rem] overflow-hidden mb-40 border border-white/60 shadow-2xl shadow-fuchsia-900/5 group perspective-container">
            <div className="carousel-track flex w-full h-full will-change-transform">
              {banners.map((banner, i) => (
                <article key={banner.id} className={`carousel-item-${i+1} flex-shrink-0 w-full h-full relative`}>
                  <Image 
                    src={banner.imageUrl} 
                    alt={banner.title} 
                    fill 
                    className="object-cover transition-transform duration-[10s] group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                  
                  {/* Banner text overlays, targeted for per-slide animation */}
                  <div className="absolute bottom-12 sm:bottom-16 left-12 sm:left-16 max-w-xl text-white z-10">
                    <div className="banner-text">
                      <h3 className={`text-4xl sm:text-6xl font-medium tracking-tighter leading-none mb-3 ${cormorant.className}`}>
                        {banner.title}
                      </h3>
                      <p className="text-white/80 text-lg sm:text-xl font-medium max-w-sm">
                        {banner.subtitle}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            {/* Carousel navigation visual feedback (automatic, just showing dots) */}
            <div className="absolute bottom-6 right-6 flex gap-2 z-10 interactive-element">
              {banners.map((_, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/40 border border-white group-hover:scale-125 transition-transform" />
              ))}
            </div>
          </section>
        )}

        {filteredProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-40">
            <div className="w-40 h-40 bg-white/50 backdrop-blur-2xl rounded-[3rem] flex items-center justify-center mb-12 shadow-2xl border border-white rotate-12 animate-pulse">
              <SearchIcon className="w-16 h-16 text-fuchsia-300 -rotate-12" />
            </div>
            <h3 className={`text-4xl sm:text-6xl text-gray-900 mb-6 font-medium ${cormorant.className}`}>Vacío Cuántico</h3>
            <p className="text-gray-500 text-lg sm:text-2xl mb-12 text-center max-w-xl leading-relaxed">Las energías que buscas aún no se han manifestado en este plano. Transmuta tu búsqueda.</p>
            <button 
              onClick={() => {setSearchQuery(''); setActiveFilter('ALL');}}
              className="interactive-element bg-gray-900 text-white px-12 py-5 rounded-2xl font-bold tracking-widest uppercase text-sm shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_60px_rgba(192,132,252,0.4)] hover:bg-fuchsia-600 transition-all duration-500 active:scale-90"
            >
              Restaurar Visión
            </button>
          </div>
        ) : (
          /* ASYMMETRICAL EDITORIAL GRID - Solves "Text Cut-Out" by editorializing the cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-24 sm:gap-y-32 items-start">
            {filteredProducts.map((product, i) => (
              <div 
                key={product.id} 
                className={`product-card-wrapper perspective-container interactive-element ${designPattern[i % designPattern.length]} ${i % 2 !== 0 ? 'lg:mt-32' : ''} ${i % 3 === 0 ? 'xl:mt-40' : ''}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <article className="card-inner group flex flex-col bg-white/40 backdrop-blur-2xl p-5 rounded-[3.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-white transition-all duration-700 hover:shadow-[0_40px_100px_rgba(192,132,252,0.2)] hover:bg-white/60">
                  
                  <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-100/50 transform-gpu mb-8">
                    <div className="absolute top-6 left-6 z-20 pointer-events-none">
                      <span className={`px-5 py-2 text-[10px] font-black tracking-[0.25em] uppercase rounded-full shadow-2xl backdrop-blur-xl border ${
                        product.type === 'SERVICE' ? 'bg-fuchsia-500/30 text-fuchsia-900 border-fuchsia-200/50' : 
                        product.type === 'PHYSICAL' ? 'bg-orange-500/30 text-orange-900 border-orange-200/50' : 
                        'bg-indigo-500/30 text-indigo-900 border-indigo-200/50'
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
                        className="object-cover transition-transform duration-[4s] ease-out group-hover:scale-110 pointer-events-none"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center pointer-events-none">
                        <SparkleStarIcon className="w-20 h-20 text-gray-300" />
                      </div>
                    )}

                    {/* FOCUS FADE OVER IMAGE ON HOVER - The entire description is displayed here */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-gray-900/20 text-white p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end">
                      <p className="text-[14px] mb-8 font-medium leading-relaxed max-w-sm pointer-events-none">
                        {product.description}
                      </p>
                      <button 
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={product.type === 'PHYSICAL' && product.stock === 0}
                        className="interactive-element w-full bg-white text-gray-900 font-bold py-4.5 rounded-2xl shadow-2xl hover:bg-fuchsia-600 hover:text-white disabled:opacity-50 disabled:bg-white disabled:text-gray-400 transition-all active:scale-95 flex items-center justify-center gap-3 border border-white"
                      >
                        {product.type === 'SERVICE' ? 'Agendar Sesión' : product.stock === 0 ? 'Agotado' : (
                          <><PlusIcon className="w-5 h-5" /> Manifestar</>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card lower details, now cleaner */}
                  <div className="flex flex-col flex-1 px-3 pb-3 pointer-events-none">
                    {/* Larger, bolded title, and price are now the main visual detail */}
                    <h2 className={`text-4xl sm:text-5xl font-medium text-gray-900 leading-[1] mb-5 transition-colors duration-500 ${cormorant.className}`}>
                      {product.name}
                    </h2>
                    
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-900/5">
                      <p className={`text-3xl text-gray-900 font-semibold ${cormorant.className}`}>
                        {formatPrice(product.price)}
                      </p>
                      
                      {/* Mobile quick add button */}
                      <button 
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={product.type === 'PHYSICAL' && product.stock === 0}
                        className="xl:hidden w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-fuchsia-600 disabled:opacity-50 transition-all shadow-xl pointer-events-auto"
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