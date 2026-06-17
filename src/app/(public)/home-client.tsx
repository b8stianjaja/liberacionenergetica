"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Plus, Sparkles, MoveRight, Quote, Leaf, CircleDot } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
// @ts-ignore
import Lenis from 'lenis';

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
    // 0. SCROLL PREMIUM CON LENIS
    const lenis = new Lenis({
      lerp: 0.05, // Suavidad extrema. Menor = más manteca.
      wheelMultiplier: 0.6, // Frena la velocidad agresiva del ratón en PC
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0, 0);

    // Bloquear scroll al inicio
    lenis.stop();
    document.body.style.overflow = "hidden";

    // Interceptar anclas para usar scroll suave de Lenis
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href') || '';
        if (href.includes('#')) {
          const id = href.split('#')[1];
          const target = document.getElementById(id);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -50, duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
          }
        }
      });
    });

    // 1. PRELOADER INMERSIVO (EYE CANDY)
    const tl = gsap.timeline({ 
      onComplete: () => { 
        document.body.style.overflow = ""; 
        lenis.start(); // Libera la bestia
      } 
    });

    tl.to(".loader-logo", { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
      .to(".loader-logo", { scale: 1.05, duration: 1.2, ease: "sine.inOut" })
      .to(".loader-bg", { yPercent: -100, duration: 1.4, ease: "expo.inOut" })
      .fromTo(".hero-text-mask span", { y: "100%" }, { y: "0%", stagger: 0.15, duration: 1.2, ease: "expo.out" }, "-=0.8")
      .fromTo(".hero-image-wrapper", { scale: 1.2, filter: "blur(20px)" }, { scale: 1, filter: "blur(0px)", duration: 2, ease: "power3.out" }, "-=1.2");

    // 2. ANIMACIÓN FLOTANTE INFINITA (EYE CANDY)
    gsap.to(".floating-element", {
      y: -15,
      rotation: 5,
      duration: 3.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      stagger: 0.2
    });

    // 3. REVEAL CINEMATOGRÁFICO DE IMÁGENES (CLIP-PATH)
    gsap.utils.toArray('.reveal-image').forEach((img: any) => {
      gsap.fromTo(img,
        { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)", scale: 1.1 },
        { 
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", 
          scale: 1, 
          duration: 1.5, 
          ease: "expo.out",
          scrollTrigger: { trigger: img, start: "top 80%" }
        }
      );
    });

    // 4. ANIMACIONES DE TEXTO ORGÁNICAS
    gsap.utils.toArray('.fade-up').forEach((elem: any) => {
      gsap.fromTo(elem, 
        { opacity: 0, y: 40 },
        { scrollTrigger: { trigger: elem, start: "top 85%" }, opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    });

    // 5. PARALLAX INTERNO DEL TAROT (Profundidad 3D)
    gsap.utils.toArray('.tarot-number').forEach((num: any) => {
      gsap.to(num, {
        y: 120,
        opacity: 0,
        scrollTrigger: {
          trigger: num.parentElement.parentElement, // La carta contenedora
          start: "top center",
          end: "bottom top",
          scrub: 1.5 // Parallax ultra suave gracias a Lenis
        }
      });
    });

    // 6. FADE IN DE LA BOUTIQUE (EFECTO RESORTE)
    gsap.fromTo(".boutique-item", 
      { y: 80, opacity: 0, scale: 0.95 }, 
      { scrollTrigger: { trigger: ".boutique-grid", start: "top 80%" }, y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.15, ease: "back.out(1.5)" }
    );

    return () => { 
      lenis.destroy(); 
      gsap.ticker.remove((time) => { lenis.raf(time * 1000); });
      document.body.style.overflow = ""; 
    };
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
      <section id="inicio" className="hero-section relative w-full h-[100svh] min-h-[600px] flex items-center overflow-hidden px-6 lg:px-16">
        <div className="absolute inset-0 z-0 hero-image-wrapper overflow-hidden bg-[var(--purple-light)]">
          {banners.length > 0 && (
            <Image src={banners[0].imageUrl} alt="Bienestar y Sanación" fill priority className="hero-image object-cover object-center will-change-transform" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-canvas)] via-[var(--bg-canvas)]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl pt-20">
          <div className="overflow-hidden pt-2 pb-4 -mt-2 -mb-4">
            <h1 className="hero-text-mask font-playfair text-5xl md:text-[5.5rem] lg:text-[7rem] text-[var(--purple-deep)] leading-tight md:leading-none tracking-tight">
              <span className="block translate-y-full">Despierta tu</span>
            </h1>
          </div>
          <div className="overflow-hidden pt-2 pb-6 -mt-2 -mb-6">
            <h1 className="hero-text-mask font-playfair text-5xl md:text-[5.5rem] lg:text-[7rem] leading-tight md:leading-none tracking-tight flex items-center gap-4">
              <span className="block translate-y-full golden-rainbow-text italic font-light pr-2">energía vital.</span>
            </h1>
          </div>
          
          <div className="overflow-hidden pt-2 pb-4 -mt-2 -mb-4 mt-6">
            <p className="hero-text-mask text-[var(--purple-deep)]/80 text-base md:text-xl font-light max-w-lg leading-relaxed">
              <span className="block translate-y-full">Sanación cuántica, radiestesia y biodecodificación para liberar las memorias que tu cuerpo ya no necesita cargar.</span>
            </p>
          </div>

          <Link href="/#terapias" className="group relative inline-flex items-center gap-4 text-[var(--purple-deep)] font-bold uppercase tracking-[0.2em] text-xs hover:text-[var(--gold-magic)] transition-colors mt-8">
            <div className="w-12 h-12 rounded-full border border-[var(--purple-deep)] flex items-center justify-center group-hover:scale-110 group-hover:border-[var(--gold-magic)] transition-all duration-500 shadow-lg shadow-[var(--purple-deep)]/5">
              <MoveRight strokeWidth={1} className="group-hover:translate-x-1 transition-transform" />
            </div>
            Explorar Terapias
          </Link>
        </div>
      </section>

      {/* --- SOBRE MÍ --- */}
      <section id="sobre-mi" className="relative w-full py-32 bg-white px-6 lg:px-16 overflow-hidden">
        <div className="max-w-[80rem] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
          <div className="w-full lg:w-1/2 relative">
            <div className="reveal-image aspect-[3/4] w-full max-w-md mx-auto bg-[var(--purple-light)] rounded-[2rem] overflow-hidden relative shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--purple-deep)]/40 to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center text-[var(--purple-deep)]/20">
                <Leaf size={100} strokeWidth={0.5} className="floating-element" />
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-[var(--gold-magic)] rounded-full blur-[80px] opacity-20 -z-10 floating-element" />
          </div>

          <div className="w-full lg:w-1/2 flex flex-col justify-center fade-up">
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--gold-magic)] mb-4 flex items-center gap-3">
               <Sparkles size={12} className="floating-element" /> La Canalizadora
            </h2>
            <h3 className="font-playfair text-4xl lg:text-5xl text-[var(--purple-deep)] mb-8 leading-tight">
              Acompañándote a <br/><span className="italic font-light">recordar tu origen.</span>
            </h3>
            <div className="space-y-6 text-zinc-600 font-light leading-relaxed text-lg">
              <p>
                Mi misión es actuar como puente entre el plano físico y la consciencia cuántica. Creo firmemente que cada síntoma, cada bloqueo y cada dolor es una brújula que apunta hacia una memoria no resuelta.
              </p>
              <p>
                A través de herramientas sagradas como el Péndulo Hebreo y la Biodecodificación, te guío a un espacio de liberación donde tu propia energía vital recupera su curso natural, permitiéndote sanar desde la raíz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TERAPIAS: THE TAROT STACKING --- */}
      <section id="terapias" className="relative w-full bg-[var(--bg-canvas)] pt-32 px-6 lg:px-16">
        <div className="max-w-xl mx-auto text-center mb-24 fade-up">
          <h2 className="font-playfair text-4xl lg:text-5xl text-[var(--purple-deep)] mb-4">El Oráculo de Sanación</h2>
          <p className="text-[var(--purple-deep)]/50 uppercase tracking-[0.2em] text-[10px] font-bold flex items-center justify-center gap-3">
            <CircleDot size={8} className="floating-element" /> Un viaje en tres fases <CircleDot size={8} className="floating-element" />
          </p>
        </div>

        <div className="max-w-[1000px] mx-auto flex flex-col gap-[20vh] pb-[30vh]">
          
          {/* Card 1 */}
          <div className="tarot-card sticky top-[10vh] w-full min-h-[500px] lg:h-[65vh] bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(91,58,128,0.06)] border border-[var(--purple-deep)]/5 overflow-hidden flex flex-col lg:flex-row z-10 transition-transform duration-500 ease-out">
             <div className="w-full h-48 sm:h-64 lg:h-full lg:w-1/2 bg-[var(--purple-light)]/40 relative flex items-center justify-center overflow-hidden">
                <span className="tarot-number text-8xl lg:text-[10rem] font-playfair text-[var(--purple-deep)] opacity-5">I</span>
             </div>
             <div className="w-full lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center bg-white">
               <h3 className="font-playfair text-3xl lg:text-4xl text-[var(--purple-deep)] mb-6">Radiestesia</h3>
               <p className="text-zinc-600 font-light leading-relaxed text-lg">Limpieza profunda del campo electromagnético. Detectamos parásitos energéticos y bloqueos mediante el uso del péndulo, transmutando la densidad en luz pura.</p>
             </div>
          </div>

          {/* Card 2 */}
          <div className="tarot-card sticky top-[13vh] w-full min-h-[500px] lg:h-[65vh] bg-[#FDFCF8] rounded-[2.5rem] shadow-[0_30px_60px_rgba(91,58,128,0.1)] border border-[var(--gold-magic)]/20 overflow-hidden flex flex-col lg:flex-row z-20 transition-transform duration-500 ease-out">
             <div className="w-full h-48 sm:h-64 lg:h-full lg:w-1/2 bg-[var(--gold-magic)]/10 relative flex items-center justify-center overflow-hidden">
                <span className="tarot-number text-8xl lg:text-[10rem] font-playfair text-[var(--gold-magic)] opacity-10">II</span>
             </div>
             <div className="w-full lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center bg-[#FDFCF8]">
               <h3 className="font-playfair text-3xl lg:text-4xl text-[var(--purple-deep)] mb-6">Biodecodificación</h3>
               <p className="text-zinc-600 font-light leading-relaxed text-lg">El síntoma físico es la voz del alma no escuchada. Rastreamos tu árbol genealógico y tus conflictos silenciados para desactivar la enfermedad desde su raíz biológica.</p>
             </div>
          </div>

          {/* Card 3 */}
          <div className="tarot-card sticky top-[16vh] w-full min-h-[500px] lg:h-[65vh] bg-[var(--purple-deep)] rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.3)] border border-white/10 overflow-hidden flex flex-col lg:flex-row text-white z-30 transition-transform duration-500 ease-out">
             <div className="w-full h-48 sm:h-64 lg:h-full lg:w-1/2 bg-black/20 relative flex items-center justify-center overflow-hidden">
                <span className="tarot-number text-8xl lg:text-[10rem] font-playfair text-white opacity-5">III</span>
             </div>
             <div className="w-full lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center">
               <h3 className="font-playfair text-3xl lg:text-4xl mb-6">Péndulo Hebreo</h3>
               <p className="text-white/80 font-light leading-relaxed text-lg">Sellado del aura. Utilizamos símbolos radiónicos milenarios y la Cruz de la Vida egipcia (Ankh) para anclar tu nueva frecuencia y proteger tu campo áurico de reincidencias.</p>
             </div>
          </div>

        </div>
      </section>

      {/* --- TESTIMONIOS --- */}
      <section id="testimonios" className="relative w-full py-32 bg-[var(--purple-light)]/30 px-6 lg:px-16 overflow-hidden">
        <div className="max-w-[80rem] mx-auto text-center fade-up">
          <Quote size={48} className="mx-auto text-[var(--gold-magic)] opacity-50 mb-8 floating-element" />
          <h2 className="font-playfair text-4xl lg:text-5xl text-[var(--purple-deep)] mb-16">Ecos de Sanación</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "Llegué con una carga en el pecho que llevaba años. La sesión de radiestesia me devolvió la respiración.", name: "María José P." },
              { text: "Entender de dónde venía mi síntoma a través de la biodecodificación cambió mi vida por completo.", name: "Carolina S." },
              { text: "Una experiencia de luz pura. El uso del péndulo hebreo me hizo sentir protegida y renovada.", name: "Andrea V." }
            ].map((testimonio, i) => (
              <div key={i} className="bg-white p-10 rounded-[2rem] shadow-sm border border-[var(--purple-deep)]/5 flex flex-col justify-between items-start text-left hover:-translate-y-3 hover:shadow-xl transition-all duration-500">
                <p className="text-zinc-600 font-light leading-relaxed mb-8">"{testimonio.text}"</p>
                <span className="font-playfair text-[var(--purple-deep)] font-bold">{testimonio.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- LA BOUTIQUE: BENTO GRID --- */}
      <section id="boutique" className="relative w-full py-32 bg-white px-6 lg:px-16 rounded-t-[3rem] md:rounded-t-[4rem] shadow-[0_-30px_60px_rgba(0,0,0,0.03)] z-40">
        <div className="max-w-[90rem] mx-auto">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 border-b border-[var(--purple-deep)]/10 pb-8 gap-8 fade-up">
            <div>
              <h2 className="font-playfair text-4xl lg:text-5xl text-[var(--purple-deep)] mb-4">Reliquias & Materia</h2>
              <p className="text-zinc-500 font-light text-lg">Herramientas canalizadas para sostener tu trabajo interno.</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {dynamicFilters.map(f => (
                <button
                  key={f.id} onClick={() => setActiveFilter(f.id)}
                  className={`px-5 py-2.5 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 ${
                    activeFilter === f.id ? 'bg-[var(--purple-deep)] text-white shadow-lg shadow-[var(--purple-deep)]/20' : 'bg-[var(--bg-canvas)] text-zinc-500 hover:border-[var(--gold-magic)] hover:text-[var(--purple-deep)]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="w-full py-32 flex flex-col items-center justify-center opacity-50 fade-up">
               <Sparkles className="text-[var(--purple-deep)] mb-6 floating-element" size={40}/>
               <p className="font-playfair text-2xl text-[var(--purple-deep)]">Aún no hay reliquias en esta categoría.</p>
            </div>
          ) : (
            <div className="boutique-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="boutique-item group flex flex-col cursor-pointer">
                  <div className="w-full aspect-[4/5] bg-[var(--purple-light)]/40 rounded-[2rem] overflow-hidden relative mb-5 shadow-sm border border-transparent group-hover:border-[var(--gold-magic)]/30 transition-all duration-500">
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                         <Sparkles className="text-[var(--purple-deep)]/20 floating-element" size={40}/>
                      </div>
                    )}
                    
                    {/* Botón flotante Glassmorphism */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-white/85 backdrop-blur-md p-2 pl-5 rounded-2xl border border-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl shadow-black/5">
                      <span className="font-playfair text-lg font-semibold text-[var(--purple-deep)]">{formatPrice(product.price)}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || null }); }}
                        disabled={product.stock === 0}
                        className="w-12 h-12 bg-[var(--purple-deep)] text-white rounded-[1rem] flex items-center justify-center hover:bg-[var(--gold-magic)] transition-colors disabled:opacity-50"
                      >
                        {product.stock === 0 ? <span className="text-[10px] font-bold">AGOTADO</span> : <Plus size={20} />}
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-playfair text-2xl text-[var(--purple-deep)] mb-2 group-hover:text-[var(--gold-magic)] transition-colors">{product.name}</h3>
                  <p className="text-zinc-500 text-sm font-light line-clamp-2 leading-relaxed">{product.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}