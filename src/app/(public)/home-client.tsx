"use client";

import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Star, ArrowRight, Quote, Plus, Sparkles } from "lucide-react";
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
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const { addItem } = useCart();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  // PURGA DE BOUTIQUE: Eliminamos estrictamente todo lo que sea "SERVICE" (Agenda)
  const boutiqueProducts = useMemo(() => products.filter(p => p.type !== 'SERVICE'), [products]);
  
  // Filtros dinámicos basados SOLO en los productos de la boutique
  const activeCategories = useMemo(() => {
    const usedCategoryIds = new Set(boutiqueProducts.map(p => p.categoryId));
    return categories.filter(cat => usedCategoryIds.has(cat.id));
  }, [categories, boutiqueProducts]);

  const dynamicFilters = useMemo(() => [{ id: 'ALL', label: 'Compendio' }, ...activeCategories.map(cat => ({ id: cat.id, label: cat.name }))], [activeCategories]);
  const filteredProducts = useMemo(() => boutiqueProducts.filter(product => activeFilter === 'ALL' || product.categoryId === activeFilter), [boutiqueProducts, activeFilter]);
  
  const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);

  useGSAP(() => {
    // 1. CONTROL TOTAL DE LA PANTALLA DE CARGA Y EL HEADER
    // Bloqueamos el scroll del usuario para que no rompa la experiencia inicial
    document.body.style.overflow = "hidden";
    
    // Escondemos el header para que no se superponga o se vea antes de tiempo
    gsap.set("#app-header", { yPercent: -100, opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ""; // Liberamos el scroll al terminar
      }
    });

    // Secuencia de carga Awwwards (Duración: ~3.2 segundos)
    tl.fromTo(".loader-logo", 
      { opacity: 0, scale: 0.9 }, 
      { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }
    )
    .to(".loader-logo", { scale: 1.05, duration: 1.5, ease: "sine.inOut" })
    .to(".loader-bg", { yPercent: -100, duration: 1.2, ease: "expo.inOut" }, "+=0.2")
    
    // El Header y el Hero entran maravillosamente mientras el loader sube
    .to("#app-header", { yPercent: 0, opacity: 1, duration: 1.2, ease: "expo.out" }, "-=0.8")
    .fromTo(".breathe-reveal", 
      { y: 50, opacity: 0, filter: "blur(8px)" }, 
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, stagger: 0.15, ease: "power3.out" }, 
      "-=1"
    )
    .fromTo(".hero-image", 
      { scale: 1.1, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 2, ease: "power2.out" }, 
      "-=1.5"
    );

    // 2. REVELADO SUAVE EN SCROLL PARA EL RESTO DE SECCIONES
    gsap.utils.toArray('.scroll-reveal').forEach((section: any) => {
      gsap.fromTo(section.children, 
        { y: 40, opacity: 0 }, 
        { scrollTrigger: { trigger: section, start: "top 85%" }, y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power2.out" }
      );
    });

    // 3. DIAPOSITIVAS INTERACTIVAS (Slide Horizontal Desktop)
    let mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      if (sliderRef.current) {
        const slides = gsap.utils.toArray('.slide-panel');
        gsap.to(slides, {
          xPercent: -100 * (slides.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: ".slider-container",
            pin: true,
            scrub: 1,
            snap: 1 / (slides.length - 1),
            end: () => "+=" + sliderRef.current?.offsetWidth
          }
        });
      }
    });
  }, { scope: container });

  return (
    <div ref={container} className="w-full relative overflow-hidden">
      
      {/* --- PANTALLA DE CARGA (PRELOADER ABSOLUTO) --- */}
      <div className="loader-bg fixed inset-0 z-[999999] bg-background flex items-center justify-center">
        <div className="loader-logo flex flex-col items-center text-center">
          <Sparkles size={36} className="text-gold mb-6 animate-pulse" strokeWidth={1} />
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight mb-4">
            Johanna Grandón
          </h1>
          <p className="golden-rainbow-text text-[9px] tracking-[0.4em] uppercase font-bold">
            Armonizando tu espacio...
          </p>
        </div>
      </div>

      {/* 🖼️ PLACEHOLDER FONDO: Reemplazar '/images/lavanda-bg.png' */}
      <div className="absolute top-0 right-0 w-[80vw] md:w-[40vw] h-[80vw] md:h-[40vw] opacity-20 pointer-events-none -z-10 mix-blend-multiply">
        {/* <Image src="/images/lavanda-bg.png" alt="Decoración Lavanda" fill className="object-contain object-right-top" /> */}
        <div className="absolute inset-0 bg-lavender rounded-full blur-[80px]"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="w-full min-h-[100svh] flex flex-col justify-center pt-24 pb-12 px-6 lg:px-12">
        <div className="max-w-[85rem] mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <div className="w-full lg:w-1/2 flex flex-col">
            <span className="breathe-reveal text-gold font-bold tracking-[0.3em] uppercase text-[10px] mb-6 block">
              Bienestar Emocional Integral
            </span>
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-[5rem] text-foreground leading-[1.05] tracking-tight mb-8">
              <div className="breathe-reveal">Libera tu energía.</div>
              <div className="breathe-reveal golden-rainbow-text italic font-light pb-2">Sana tu origen.</div>
            </h1>
            <p className="breathe-reveal text-foreground/70 text-lg leading-relaxed mb-10 max-w-md font-light">
              Un espacio de respeto para ti y tu familia. A través de la radiestesia y la biodecodificación, desatamos los nudos emocionales para que vuelvas a florecer en paz.
            </p>
            <div className="breathe-reveal flex gap-4">
              <button onClick={() => document.getElementById('terapias-slide')?.scrollIntoView({behavior: 'smooth'})} className="bg-foreground text-white px-10 py-4 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gold hover:shadow-lg transition-all duration-500 shadow-sm">
                Conocer Terapias
              </button>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-[70vh]">
            <div className="breathe-reveal absolute inset-0 w-full h-full rounded-[3rem] lg:rounded-t-[8rem] lg:rounded-b-[3rem] overflow-hidden shadow-2xl border-[8px] border-white bg-lavender/50 flex items-center justify-center">
              {banners.length > 0 ? (
                <Image src={banners[0].imageUrl} alt="Bienestar y Luz" fill priority className="hero-image object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              ) : (
                <span className="hero-image text-foreground/40 text-xs font-bold uppercase tracking-widest text-center px-4">
                  [Sube un Banner en Admin]
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- EL ENFOQUE & TESTIMONIOS --- */}
      <section id="enfoque" className="w-full py-32 px-6 bg-white border-y border-foreground/5 relative z-10">
        <div className="scroll-reveal max-w-[85rem] mx-auto text-center">
          <Sparkles className="text-gold mx-auto mb-8 opacity-50" size={24} />
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-foreground mb-24 max-w-4xl mx-auto leading-relaxed">
            "No atraes lo que quieres, atraes la vibración en la que estás. <br className="hidden md:block"/><span className="golden-rainbow-text italic font-light">Cambiemos tu frecuencia.</span>"
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              "Gracias a la sesión de péndulo, mi hijo ha vuelto a dormir tranquilo. Johanna transmite una paz increíble y nos dio confianza desde el primer minuto.",
              "Llevaba meses sintiendo un peso en el pecho. La biodecodificación me ayudó a entender el origen. Hoy me siento libre, en paz y profundamente feliz.",
              "Una experiencia maravillosa. Su consulta es un bálsamo de tranquilidad. Me explicó cada paso con mucha paciencia. Un antes y un después en mi bienestar."
            ].map((text, i) => (
              <div key={i} className="bg-background p-10 rounded-[2.5rem] border border-black/5 flex flex-col relative hover:-translate-y-2 hover:shadow-xl transition-all duration-500">
                <div className="absolute -top-6 left-8 bg-lavender w-14 h-14 rounded-full flex items-center justify-center text-foreground shadow-sm">
                  <Quote size={20} fill="currentColor" />
                </div>
                <div className="flex text-gold mt-2 mb-6">
                  {[...Array(5)].map((_, index) => <Star key={index} size={16} fill="currentColor" className="mr-1" />)}
                </div>
                <p className="text-foreground/80 leading-relaxed text-sm flex-grow">"{text}"</p>
                <span className="block mt-8 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 border-t border-black/5 pt-4">Consultante</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TERAPIAS (Diapositiva Interactiva GSAP) --- */}
      <section id="terapias-slide" className="slider-container w-full h-auto lg:h-[100vh] bg-background flex flex-col lg:flex-row items-center overflow-hidden relative z-20 pb-20 lg:pb-0">
        
        <div className="w-full px-6 lg:px-12 lg:absolute top-16 left-0 z-20 text-center lg:text-left pt-16 lg:pt-0 mb-8 lg:mb-0">
          <h2 className="font-playfair text-4xl md:text-5xl text-foreground">El Proceso</h2>
          <p className="text-foreground/50 text-[10px] mt-2 uppercase tracking-[0.2em] font-bold hidden lg:block">Desliza para explorar</p>
        </div>

        {/* En Desktop usa Scroll horizontal. En Mobile es una lista normal (flex-col) */}
        <div ref={sliderRef} className="flex flex-col lg:flex-row h-full items-center w-full lg:w-[200vw] lg:pl-12 gap-8 lg:gap-0 px-6 lg:px-0">
          
          {/* Diapositiva 1 */}
          <div className="slide-panel w-full lg:w-[60vw] h-auto lg:h-[70vh] flex-shrink-0 lg:px-6">
            <div className="w-full h-full bg-white rounded-[2.5rem] lg:rounded-[3rem] shadow-sm hover:shadow-xl transition-shadow duration-500 p-8 lg:p-14 flex flex-col md:flex-row gap-10 items-center border border-black/5">
              <div className="w-full md:w-1/2 h-56 md:h-full bg-lavender/40 rounded-[2rem] relative flex items-center justify-center overflow-hidden">
                <span className="text-foreground/30 font-bold uppercase tracking-widest text-[10px] text-center px-4">[Placeholder Foto: Péndulo/Radiestesia]</span>
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <span className="text-6xl lg:text-[6rem] font-playfair text-lavender leading-none mb-4">01</span>
                <h3 className="font-playfair text-3xl text-foreground mb-4">Radiestesia</h3>
                <p className="text-foreground/70 leading-relaxed font-light text-sm lg:text-base">Diagnóstico y limpieza del campo áurico mediante péndulos. Detectamos y transmutamos bloqueos energéticos, devolviendo la vitalidad natural a tu cuerpo físico, mental y espiritual.</p>
              </div>
            </div>
          </div>

          {/* Diapositiva 2 */}
          <div className="slide-panel w-full lg:w-[60vw] h-auto lg:h-[70vh] flex-shrink-0 lg:px-6">
            <div className="w-full h-full bg-white rounded-[2.5rem] lg:rounded-[3rem] shadow-sm hover:shadow-xl transition-shadow duration-500 p-8 lg:p-14 flex flex-col md:flex-row gap-10 items-center border border-black/5">
              <div className="w-full md:w-1/2 h-56 md:h-full bg-lavender/40 rounded-[2rem] relative flex items-center justify-center overflow-hidden">
                <span className="text-foreground/30 font-bold uppercase tracking-widest text-[10px] text-center px-4">[Placeholder Foto: Sesión de Terapia]</span>
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <span className="text-6xl lg:text-[6rem] font-playfair text-lavender leading-none mb-4">02</span>
                <h3 className="font-playfair text-3xl text-foreground mb-4">Biodecodificación</h3>
                <p className="text-foreground/70 leading-relaxed font-light text-sm lg:text-base">Toda dolencia tiene una raíz emocional. Encontramos el conflicto inconsciente detrás de tus síntomas, permitiendo que tu cuerpo suelte el estrés, la memoria enquistada y active su autosanación.</p>
              </div>
            </div>
          </div>

          {/* Diapositiva 3 */}
          <div className="slide-panel w-full lg:w-[60vw] h-auto lg:h-[70vh] flex-shrink-0 lg:px-6">
            <div className="w-full h-full bg-white rounded-[2.5rem] lg:rounded-[3rem] shadow-sm hover:shadow-xl transition-shadow duration-500 p-8 lg:p-14 flex flex-col md:flex-row gap-10 items-center border border-black/5">
              <div className="w-full md:w-1/2 h-56 md:h-full bg-lavender/40 rounded-[2rem] relative flex items-center justify-center overflow-hidden">
                <span className="text-foreground/30 font-bold uppercase tracking-widest text-[10px] text-center px-4">[Placeholder Foto: Esencias/Cruz de Ankh]</span>
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <span className="text-6xl lg:text-[6rem] font-playfair text-lavender leading-none mb-4">03</span>
                <h3 className="font-playfair text-3xl text-foreground mb-4">Sabiduría Ancestral</h3>
                <p className="text-foreground/70 leading-relaxed font-light text-sm lg:text-base">Incorporamos el Péndulo Hebreo, la Cruz de Ankh y Esencias de Bach como catalizadores vibracionales. Un enfoque integral para sellar la sanación en todas las capas de tu ser.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- LA BOUTIQUE (PURGADA Y ORGANIZADA) --- */}
      <section id="boutique" className="w-full py-32 px-6 lg:px-12 bg-white border-y border-foreground/5 relative z-10">
        <div className="scroll-reveal max-w-[85rem] mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="font-playfair text-4xl md:text-5xl text-foreground mb-3">La Boutique</h2>
              <p className="text-foreground/50 text-sm font-light">Piezas de luz y herramientas canalizadas para tu protección.</p>
            </div>
            
            {/* Filtros dinámicos (Se ocultan si no hay categorías) */}
            {dynamicFilters.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {dynamicFilters.map((filter) => (
                  <button
                    key={filter.id} onClick={() => setActiveFilter(filter.id)}
                    className={`px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                      activeFilter === filter.id ? 'bg-foreground text-white shadow-md' : 'bg-background text-foreground/50 border border-black/5 hover:border-gold hover:text-foreground'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <article key={product.id} className="bg-background rounded-[2rem] p-4 shadow-sm border border-black/5 flex flex-col hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
                
                <div className="relative w-full aspect-square rounded-[1.5rem] overflow-hidden bg-lavender/30 mb-5 flex items-center justify-center">
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-[1.5s]" sizes="(max-width: 768px) 100vw, 25vw" />
                  ) : (
                    <span className="text-foreground/30 text-[10px] uppercase font-bold tracking-widest">[Foto de {product.name}]</span>
                  )}
                  {/* Etiqueta de Producto (Materia Física) */}
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-foreground text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                    Materia
                  </span>
                </div>
                
                <div className="px-2 flex flex-col flex-grow">
                  <h3 className="font-playfair text-xl text-foreground mb-2 leading-tight">{product.name}</h3>
                  <p className="text-xs text-foreground/60 line-clamp-2 mb-6 flex-grow font-light leading-relaxed">{product.description}</p>
                  
                  <div className="flex items-center justify-between border-t border-black/5 pt-4">
                    <span className="font-playfair text-2xl text-foreground">{formatPrice(product.price)}</span>
                    <button 
                      onClick={() => addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || null })}
                      disabled={product.stock === 0}
                      className="w-12 h-12 bg-lavender text-foreground rounded-full flex items-center justify-center hover:bg-gold hover:text-white transition-colors duration-300 disabled:opacity-50"
                      title={product.stock === 0 ? "Agotado" : "Añadir a la cesta"}
                    >
                      {product.stock === 0 ? <span className="text-xs font-bold">✕</span> : <Plus size={18} strokeWidth={1.5} />}
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {/* Mensaje de vacío si no hay productos físicos cargados */}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-24 bg-background rounded-[2rem] border border-dashed border-foreground/10">
                <Sparkles className="text-gold/50 mx-auto mb-4" size={32} />
                <p className="text-foreground/50 italic font-playfair text-2xl">La boutique se encuentra preparando nuevas reliquias...</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}