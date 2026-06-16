"use client";

import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Plus, Sparkles, MoveRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export type Category = { id: string; name: string; };
export type Banner = { id: string; title: string; subtitle: string; imageUrl: string; };
export type Product = { id: string; name: string; description: string; price: number; type: string; categoryId: string | null; duration: number | null; stock: number; imageUrl: string | null; };

interface HomeClientProps { products: Product[]; categories: Category[]; banners: Banner[]; }

export default function HomeClient({ products, categories, banners }: HomeClientProps) {
  const container = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const boutiqueProducts = useMemo(() => products.filter(p => p.type !== 'SERVICE'), [products]);
  const activeCategories = useMemo(() => {
    const usedIds = new Set(boutiqueProducts.map(p => p.categoryId));
    return categories.filter(cat => usedIds.has(cat.id));
  }, [categories, boutiqueProducts]);

  const dynamicFilters = useMemo(() => [{ id: 'ALL', label: 'Todo el Compendio' }, ...activeCategories.map(cat => ({ id: cat.id, label: cat.name }))], [activeCategories]);
  const filteredProducts = useMemo(() => boutiqueProducts.filter(p => activeFilter === 'ALL' || p.categoryId === activeFilter), [boutiqueProducts, activeFilter]);
  
  const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);

  useGSAP(() => {
    // 1. PRELOADER INMERSIVO (Con Cleanup de Overflow)
    document.body.style.overflow = "hidden";
    const tl = gsap.timeline({ 
      onComplete: () => { 
        document.body.style.overflow = ""; 
      } 
    });

    tl.to(".loader-logo", { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
      .to(".loader-logo", { scale: 1.05, duration: 1.2, ease: "sine.inOut" })
      .to(".loader-bg", { yPercent: -100, duration: 1.2, ease: "power4.inOut" }) // Mejor performance que clipPath
      .fromTo(".hero-text-mask span", { y: "100%" }, { y: "0%", stagger: 0.1, duration: 1, ease: "power3.out" }, "-=0.6")
      .fromTo(".hero-image-wrapper", { scale: 1.2, filter: "blur(20px)" }, { scale: 1, filter: "blur(0px)", duration: 1.8, ease: "power3.out" }, "-=1");

    // 2. PARALLAX DEL HERO
    gsap.to(".hero-image", {
      yPercent: 15, // Reducido para evitar overflows
      ease: "none",
      scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: true }
    });

    // 3. EFECTO "TAROT STACKING" CORREGIDO (Escala dinámica basada en scroll)
    const cards = gsap.utils.toArray('.tarot-card') as HTMLElement[];
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return; // La última no se achica
      
      ScrollTrigger.create({
        trigger: card,
        start: "top top+=100", // Cuando choca arriba
        endTrigger: cards[i + 1], // Hasta que llega la siguiente
        end: "top top+=120",
        scrub: true,
        animation: gsap.to(card, {
          scale: 0.9,
          opacity: 0.4,
          filter: "blur(4px)",
          transformOrigin: "top center",
          ease: "none"
        })
      });
    });

    // 4. FADE IN DE LA BOUTIQUE
    gsap.fromTo(".boutique-item", 
      { y: 50, opacity: 0 }, 
      { scrollTrigger: { trigger: ".boutique-grid", start: "top 80%" }, y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" }
    );

    // CLEANUP de seguridad en caso de hot-reload
    return () => { document.body.style.overflow = ""; };
  }, { scope: container });

  return (
    <div ref={container} className="w-full relative bg-[var(--bg-canvas)]">
      
      {/* --- PRELOADER --- */}
      <div className="loader-bg fixed inset-0 z-[100] bg-[var(--purple-deep)] flex items-center justify-center pointer-events-none will-change-transform">
        <div className="loader-logo opacity-0 translate-y-10 flex flex-col items-center">
          <Sparkles size={40} className="text-[var(--gold-magic)] mb-4 animate-spin-slow" strokeWidth={1} />
          <h1 className="font-playfair text-white text-5xl tracking-tight">Johanna Grandón</h1>
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="hero-section relative w-full h-[100svh] min-h-[600px] flex items-center overflow-hidden px-6 lg:px-16">
        <div className="absolute inset-0 z-0 hero-image-wrapper overflow-hidden bg-[var(--purple-light)]">
          {banners.length > 0 && (
            <Image src={banners[0].imageUrl} alt="Bienestar" fill priority className="hero-image object-cover object-center will-change-transform" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-canvas)] via-[var(--bg-canvas)]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl pt-20">
          <div className="overflow-hidden mb-2">
            <h1 className="hero-text-mask font-playfair text-5xl md:text-[5.5rem] lg:text-[7rem] text-[var(--purple-deep)] leading-[0.9] tracking-tight">
              <span className="block translate-y-full">Despierta tu</span>
            </h1>
          </div>
          <div className="overflow-hidden mb-8">
            <h1 className="hero-text-mask font-playfair text-5xl md:text-[5.5rem] lg:text-[7rem] leading-[0.9] tracking-tight flex items-center gap-4">
              <span className="block translate-y-full golden-rainbow-text italic font-light">energía vital.</span>
            </h1>
          </div>
          
          <div className="overflow-hidden mb-12">
            <p className="hero-text-mask text-[var(--purple-deep)]/70 text-base md:text-xl font-light max-w-lg leading-relaxed">
              <span className="block translate-y-full">Sanación cuántica, radiestesia y biodecodificación para liberar las memorias que tu cuerpo ya no necesita cargar.</span>
            </p>
          </div>

          <button onClick={() => document.getElementById('terapias')?.scrollIntoView({behavior: 'smooth'})} className="group relative flex items-center gap-4 text-[var(--purple-deep)] font-bold uppercase tracking-[0.2em] text-xs hover:text-[var(--gold-magic)] transition-colors">
            <div className="w-12 h-12 rounded-full border border-[var(--purple-deep)] flex items-center justify-center group-hover:scale-110 group-hover:border-[var(--gold-magic)] transition-all duration-500">
              <MoveRight strokeWidth={1} className="group-hover:translate-x-1 transition-transform" />
            </div>
            Explorar Terapias
          </button>
        </div>
      </section>

      {/* --- TERAPIAS: NATIVE CSS STACKING (Fallo Corregido) --- */}
      <section id="terapias" className="relative w-full pb-32 bg-[var(--bg-canvas)] pt-24 px-6 lg:px-16">
        <div className="max-w-xl mx-auto text-center mb-16">
          <h2 className="font-playfair text-4xl lg:text-5xl text-[var(--purple-deep)] mb-4">El Oráculo de Sanación</h2>
          <p className="text-[var(--purple-deep)]/50 uppercase tracking-[0.2em] text-[10px] font-bold">Un viaje en tres fases</p>
        </div>

        {/* Contenedor Flex para Stacking Nativo (Sin Pinning Bugueado) */}
        <div className="max-w-[1000px] mx-auto flex flex-col gap-[4vh] pb-[10vh]">
          
          {/* Card 1 */}
          <div className="tarot-card sticky top-[12vh] w-full min-h-[500px] md:h-[60vh] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(91,58,128,0.05)] border border-[var(--purple-deep)]/10 overflow-hidden flex flex-col md:flex-row will-change-transform z-10">
             <div className="w-full h-48 md:h-full md:w-1/2 bg-[var(--purple-light)]/30 relative flex items-center justify-center">
                <span className="text-8xl font-playfair text-[var(--purple-deep)] opacity-10">I</span>
             </div>
             <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-center bg-white">
               <h3 className="font-playfair text-3xl md:text-4xl text-[var(--purple-deep)] mb-4">Radiestesia</h3>
               <p className="text-zinc-600 font-light leading-relaxed">Limpieza profunda del campo electromagnético. Detectamos parásitos energéticos y bloqueos mediante el uso del péndulo, transmutando la densidad en luz pura.</p>
             </div>
          </div>

          {/* Card 2 */}
          <div className="tarot-card sticky top-[15vh] w-full min-h-[500px] md:h-[60vh] bg-[#FDFCF8] rounded-[2rem] shadow-[0_20px_50px_rgba(91,58,128,0.08)] border border-[var(--gold-magic)]/20 overflow-hidden flex flex-col md:flex-row will-change-transform z-20">
             <div className="w-full h-48 md:h-full md:w-1/2 bg-[var(--gold-magic)]/10 relative flex items-center justify-center">
                <span className="text-8xl font-playfair text-[var(--gold-magic)] opacity-20">II</span>
             </div>
             <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-center bg-[#FDFCF8]">
               <h3 className="font-playfair text-3xl md:text-4xl text-[var(--purple-deep)] mb-4">Biodecodificación</h3>
               <p className="text-zinc-600 font-light leading-relaxed">El síntoma físico es la voz del alma no escuchada. Rastreamos tu árbol genealógico y tus conflictos silenciados para desactivar la enfermedad desde su raíz biológica.</p>
             </div>
          </div>

          {/* Card 3 */}
          <div className="tarot-card sticky top-[18vh] w-full min-h-[500px] md:h-[60vh] bg-[var(--purple-deep)] rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-white/10 overflow-hidden flex flex-col md:flex-row text-white will-change-transform z-30">
             <div className="w-full h-48 md:h-full md:w-1/2 bg-black/20 relative flex items-center justify-center">
                <span className="text-8xl font-playfair text-white opacity-10">III</span>
             </div>
             <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
               <h3 className="font-playfair text-3xl md:text-4xl mb-4">Péndulo Hebreo</h3>
               <p className="text-white/70 font-light leading-relaxed">Sellado del aura. Utilizamos símbolos radiónicos milenarios y la Cruz de la Vida egipcia (Ankh) para anclar tu nueva frecuencia y proteger tu campo áurico de reincidencias.</p>
             </div>
          </div>

        </div>
      </section>

      {/* --- LA BOUTIQUE: BENTO GRID --- */}
      <section className="relative w-full py-24 bg-white px-6 lg:px-16 rounded-t-[3rem] md:rounded-t-[4rem] shadow-[0_-20px_50px_rgba(0,0,0,0.02)] z-40">
        <div className="max-w-[90rem] mx-auto">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 lg:mb-16 border-b border-[var(--purple-deep)]/10 pb-8 gap-6">
            <div>
              <h2 className="font-playfair text-4xl lg:text-5xl text-[var(--purple-deep)] mb-3">Reliquias & Materia</h2>
              <p className="text-zinc-500 font-light">Herramientas canalizadas para sostener tu trabajo interno.</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {dynamicFilters.map(f => (
                <button
                  key={f.id} onClick={() => setActiveFilter(f.id)}
                  className={`px-4 lg:px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                    activeFilter === f.id ? 'bg-[var(--purple-deep)] text-white' : 'bg-[var(--bg-canvas)] text-zinc-500 hover:border-[var(--gold-magic)] hover:text-[var(--purple-deep)]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="w-full py-20 flex flex-col items-center justify-center opacity-50">
               <Sparkles className="text-[var(--purple-deep)] mb-4" size={32}/>
               <p className="font-playfair text-xl">Aún no hay reliquias en esta categoría.</p>
            </div>
          ) : (
            <div className="boutique-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="boutique-item group flex flex-col cursor-pointer">
                  <div className="w-full aspect-[4/5] bg-[var(--purple-light)]/20 rounded-[1.5rem] overflow-hidden relative mb-4">
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                         <Sparkles className="text-[var(--purple-deep)]/20" size={40}/>
                      </div>
                    )}
                    
                    {/* Botón flotante al hacer hover */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-white/80 backdrop-blur-md p-2 pl-4 rounded-xl border border-white/50 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                      <span className="font-playfair text-lg text-[var(--purple-deep)]">{formatPrice(product.price)}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || null }); }}
                        disabled={product.stock === 0}
                        className="w-10 h-10 bg-[var(--purple-deep)] text-white rounded-lg flex items-center justify-center hover:bg-[var(--gold-magic)] transition-colors disabled:opacity-50"
                      >
                        {product.stock === 0 ? <span className="text-[10px]">NO</span> : <Plus size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-playfair text-xl lg:text-2xl text-[var(--purple-deep)] mb-1 group-hover:text-[var(--gold-magic)] transition-colors">{product.name}</h3>
                  <p className="text-zinc-500 text-xs lg:text-sm font-light line-clamp-2">{product.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}