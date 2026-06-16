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

  // Filtramos las categorías y productos
  const dynamicFilters = useMemo(() => [{ id: 'ALL', label: 'El Compendio' }, ...categories.map(cat => ({ id: cat.id, label: cat.name }))], [categories]);
  const filteredProducts = useMemo(() => products.filter(product => activeFilter === 'ALL' || product.categoryId === activeFilter || product.type === activeFilter), [products, activeFilter]);
  
  // PURGA: La Boutique SOLO muestra productos, no servicios ni agendas.
  const boutiqueProducts = useMemo(() => filteredProducts.filter(p => p.type !== 'SERVICE'), [filteredProducts]);
  
  const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. PANTALLA DE CARGA (PRELOADER - 3 Segundos exactos)
    tl.fromTo(".loader-content", 
      { opacity: 0, scale: 0.95 }, 
      { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
    )
    .to(".loader-content", { scale: 1.05, duration: 1.5, ease: "sine.inOut" }) // Mantenemos la pantalla visible
    .to(".loader-bg", { yPercent: -100, duration: 1.2, ease: "expo.inOut" }, "+=0.5") // Salida elegante hacia arriba
    
    // 2. HERO REVEAL (Inicia justo cuando el loader se está yendo)
    .fromTo(".breathe-reveal", 
      { y: 100, opacity: 0, filter: "blur(12px)", scale: 0.95 }, 
      { y: 0, opacity: 1, filter: "blur(0px)", scale: 1, duration: 2, stagger: 0.15, ease: "expo.out" },
      "-=0.6"
    )
    .fromTo(".hero-image", 
      { scale: 1.2, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 2.5, ease: "power3.out" }, 
      "-=1.5"
    );

    // 3. FLOTACIÓN ORGÁNICA (Elementos de fondo)
    gsap.to(".floating-element", {
      y: -25, rotation: 2, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.5
    });

    // 4. REVELADOS EN SCROLL (Aparición limpia de secciones)
    gsap.utils.toArray('.scroll-reveal').forEach((section: any) => {
      gsap.fromTo(section.children, 
        { y: 60, opacity: 0 }, 
        { scrollTrigger: { trigger: section, start: "top 80%" }, y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: "power3.out" }
      );
    });

    // 5. DIAPOSITIVA INTERACTIVA (Terapias)
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
      
      {/* --- PANTALLA DE CARGA (PRELOADER) --- */}
      <div className="loader-bg fixed inset-0 z-[999999] bg-background flex items-center justify-center">
        <div className="loader-content flex flex-col items-center text-center">
          <Sparkles size={40} className="text-gold mb-6 animate-pulse" strokeWidth={1} />
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-foreground tracking-wider mb-4">
            Johanna Grandón
          </h1>
          <p className="golden-rainbow-text text-[10px] tracking-[0.4em] uppercase font-bold">
            Armonizando tu energía...
          </p>
        </div>
      </div>

      {/* 🖼️ PLACEHOLDER: Imagen de Lavanda en el fondo */}
      <div className="floating-element absolute top-[5%] right-[-5%] w-[40vw] h-[40vw] opacity-30 pointer-events-none -z-10 mix-blend-multiply">
        {/* Descomentar cuando subas tu lavanda.png a la carpeta public/images/ */}
        {/* <Image src="/images/lavanda.png" alt="Lavanda" fill className="object-contain" /> */}
        <div className="absolute inset-0 bg-lavender rounded-full blur-[80px]"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="w-full min-h-[100svh] flex flex-col justify-center pt-32 pb-16 px-6 lg:px-12">
        <div className="max-w-[90rem] mx-auto w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          <div className="w-full lg:w-1/2 flex flex-col z-10">
            <span className="breathe-reveal text-gold font-bold tracking-[0.4em] uppercase text-[10px] mb-8 block">
              <Sparkles size={16} className="inline mr-3 mb-1"/> Espacio Holístico
            </span>
            <h1 className="font-playfair text-[13vw] md:text-[8vw] lg:text-[6rem] leading-[0.9] tracking-tighter text-foreground mb-8">
              <div className="breathe-reveal">Eleva tu</div>
              <div className="breathe-reveal golden-rainbow-text italic font-light pb-2">frecuencia.</div>
            </h1>
            <p className="breathe-reveal text-foreground/70 text-lg md:text-xl leading-relaxed mb-12 max-w-lg font-light">
              La sanación comienza cuando dejas de pelear con tu origen. Liberamos bloqueos emocionales para que vuelvas a tu paz natural.
            </p>
            <div className="breathe-reveal flex gap-6">
              <button onClick={() => document.getElementById('terapias')?.scrollIntoView({behavior: 'smooth'})} className="bg-foreground text-white px-10 py-5 rounded-full text-[11px] font-bold tracking-widest uppercase hover:bg-gold hover:shadow-xl hover:shadow-gold/20 hover:-translate-y-1 transition-all duration-500">
                Iniciar el Viaje
              </button>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative h-[60vh] lg:h-[80vh] overflow-visible">
            <div className="breathe-reveal absolute inset-0 golden-rainbow-bg rounded-[4rem] blur-3xl opacity-50"></div>
            <div className="breathe-reveal absolute inset-4 w-full h-full rounded-[4rem] overflow-hidden shadow-2xl border-[8px] border-white z-10 bg-lavender/50">
              {banners.length > 0 ? (
                <Image src={banners[0].imageUrl} alt="Paz Interior" fill priority className="hero-image object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-foreground/40 font-bold uppercase tracking-widest text-[10px]">
                  [Placeholder: Imagen Hero]
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIOS --- */}
      <section id="testimonios" className="w-full py-32 px-6 lg:px-12 bg-white relative">
        <div className="scroll-reveal max-w-[90rem] mx-auto text-center">
          <h2 className="font-playfair text-5xl md:text-6xl text-foreground mb-4">
            Testimonios <span className="italic font-light text-gold">de corazón</span>
          </h2>
          <div className="w-24 h-[1px] bg-gold mx-auto mb-6"></div>
          <p className="text-foreground/60 max-w-xl mx-auto text-lg mb-20 leading-relaxed font-light">
            Historias de transformación que nos recuerdan que volver a la luz es siempre posible.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            {[
              "Hola Johana, buenos días. Quiero agradecerte de corazón tu limpieza, hace muchos meses que no sentía esta tranquilidad en mi cabeza y corazón. Estoy tan feliz.",
              "El finde estuve muy cansada fisicamente, pero hoy me levanté como si fuera otra persona, la de antes... mi cabeza ya no piensa cosas malas ni negativamente.",
              "Quiero agradecerte tu limpieza, hace muchos meses que no sentía esta tranquilidad. No siento odio, no siento pena. Te vuelvo agradecer esta paz que buscaba hace tanto tiempo. 💜"
            ].map((text, i) => (
              <div key={i} className="bg-background p-10 lg:p-12 rounded-[3rem] shadow-sm border border-foreground/5 flex flex-col relative hover:-translate-y-2 hover:shadow-xl transition-all duration-500 group">
                <div className="absolute -top-8 left-10 w-16 h-16 bg-lavender rounded-full flex items-center justify-center text-foreground group-hover:bg-gold group-hover:text-white transition-colors duration-500 shadow-md">
                  <Quote size={24} fill="currentColor" />
                </div>
                <div className="flex text-gold mt-4 mb-8">
                  {[...Array(5)].map((_, index) => <Star key={index} size={18} fill="currentColor" className="mr-1" />)}
                </div>
                <p className="text-foreground/80 leading-relaxed text-base flex-grow">"{text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TERAPIAS (Diapositivas Horizontales) --- */}
      <section id="terapias" className="slider-container w-full h-[100vh] bg-lavender/30 flex items-center overflow-hidden border-y border-white relative z-20">
        <div className="absolute top-16 left-6 lg:left-12 z-20">
          <h2 className="font-playfair text-4xl md:text-5xl text-foreground">El Proceso</h2>
          <p className="text-foreground/50 text-[10px] mt-2 uppercase tracking-[0.2em] font-bold">Desliza para explorar</p>
        </div>

        <div ref={sliderRef} className="flex h-full items-center w-[300vw] lg:w-[200vw] pt-24 pb-12">
          
          {/* Diapositiva 1 */}
          <div className="slide-panel w-[100vw] lg:w-[60vw] h-[70vh] flex-shrink-0 px-6 lg:px-12">
            <div className="w-full h-full bg-white rounded-[3rem] shadow-lg p-8 lg:p-16 flex flex-col md:flex-row gap-12 items-center border border-white">
              <div className="w-full md:w-1/2 h-64 md:h-full rounded-[2rem] relative flex items-center justify-center overflow-hidden bg-background">
                <span className="text-foreground/30 font-bold uppercase tracking-widest text-[10px]">[Placeholder: Radiestesia]</span>
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <span className="text-[5rem] lg:text-[7rem] font-playfair text-lavender leading-none mb-6">01</span>
                <h3 className="font-playfair text-4xl text-foreground mb-6">Radiestesia</h3>
                <p className="text-foreground/70 leading-relaxed text-lg font-light">Diagnóstico y limpieza del campo áurico mediante el uso de péndulos. Detectamos y transmutamos bloqueos para devolver la vitalidad natural a tu cuerpo físico y mental.</p>
              </div>
            </div>
          </div>

          {/* Diapositiva 2 */}
          <div className="slide-panel w-[100vw] lg:w-[60vw] h-[70vh] flex-shrink-0 px-6 lg:px-12">
            <div className="w-full h-full bg-white rounded-[3rem] shadow-lg p-8 lg:p-16 flex flex-col md:flex-row gap-12 items-center border border-white">
              <div className="w-full md:w-1/2 h-64 md:h-full rounded-[2rem] relative flex items-center justify-center overflow-hidden bg-background">
                <span className="text-foreground/30 font-bold uppercase tracking-widest text-[10px]">[Placeholder: Biodecodificación]</span>
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <span className="text-[5rem] lg:text-[7rem] font-playfair text-lavender leading-none mb-6">02</span>
                <h3 className="font-playfair text-4xl text-foreground mb-6">Biodecodificación</h3>
                <p className="text-foreground/70 leading-relaxed text-lg font-light">Toda dolencia tiene una raíz emocional. Encontramos el conflicto inconsciente detrás de tus síntomas, permitiendo que tu cuerpo suelte el estrés y active su autosanación.</p>
              </div>
            </div>
          </div>

          {/* Diapositiva 3 */}
          <div className="slide-panel w-[100vw] lg:w-[60vw] h-[70vh] flex-shrink-0 px-6 lg:px-12">
            <div className="w-full h-full bg-white rounded-[3rem] shadow-lg p-8 lg:p-16 flex flex-col md:flex-row gap-12 items-center border border-white">
              <div className="w-full md:w-1/2 h-64 md:h-full rounded-[2rem] relative flex items-center justify-center overflow-hidden bg-background">
                <span className="text-foreground/30 font-bold uppercase tracking-widest text-[10px]">[Placeholder: Herramientas]</span>
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <span className="text-[5rem] lg:text-[7rem] font-playfair text-lavender leading-none mb-6">03</span>
                <h3 className="font-playfair text-4xl text-foreground mb-6">Sabiduría Ancestral</h3>
                <p className="text-foreground/70 leading-relaxed text-lg font-light">Incorporamos el Péndulo Hebreo, la Cruz de Ankh y Esencias de Bach como catalizadores vibracionales para sellar la sanación en todas las capas de tu ser.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- LA BOUTIQUE (Purgada: Solo productos físicos/digitales, sin agenda) --- */}
      <section id="boutique" className="w-full py-32 px-6 lg:px-12 bg-background relative z-10">
        <div className="scroll-reveal max-w-[90rem] mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
            <div>
              <h2 className="font-playfair text-5xl md:text-7xl text-foreground mb-4">Boutique Holística</h2>
              <p className="text-foreground/50 text-xl font-light">Piezas de luz y herramientas físicas para tu día a día.</p>
            </div>
            {/* Si no tienes categorías aparte de servicios, estos filtros se ocultarán si están vacíos */}
            {dynamicFilters.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {dynamicFilters.map((filter) => (
                  <button
                    key={filter.id} onClick={() => setActiveFilter(filter.id)}
                    className={`px-8 py-4 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 ${
                      activeFilter === filter.id ? 'bg-foreground text-white shadow-lg' : 'bg-white text-foreground/50 border border-foreground/5 hover:border-gold hover:text-foreground'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {boutiqueProducts.map((product) => (
              <article key={product.id} className="group flex flex-col">
                
                <div className="relative w-full aspect-[4/5] rounded-[2.5rem] bg-white border border-white shadow-sm overflow-hidden mb-8 p-3 hover:shadow-2xl transition-all duration-700">
                  <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden bg-background flex items-center justify-center">
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)]" sizes="(max-width: 768px) 100vw, 25vw" />
                    ) : (
                      <span className="text-foreground/30 text-[10px] uppercase font-bold tracking-widest">[Sube foto del producto]</span>
                    )}
                  </div>
                  <span className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm text-foreground text-[9px] font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
                    Materia
                  </span>
                </div>
                
                <h3 className="font-playfair text-2xl text-foreground mb-3 leading-tight pr-4 group-hover:text-gold transition-colors duration-300">{product.name}</h3>
                <p className="text-sm text-foreground/60 line-clamp-2 mb-8 flex-grow font-light leading-relaxed">{product.description}</p>
                
                <div className="flex items-center justify-between border-t border-black/5 pt-6">
                  <span className="font-playfair text-3xl text-foreground">{formatPrice(product.price)}</span>
                  <button 
                    onClick={() => addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || null })}
                    disabled={product.stock === 0}
                    className="w-12 h-12 bg-foreground text-white rounded-full flex items-center justify-center hover:bg-gold transition-colors disabled:opacity-50"
                  >
                    <Plus size={20} strokeWidth={1.5} />
                  </button>
                </div>
              </article>
            ))}
            
            {boutiqueProducts.length === 0 && (
              <div className="col-span-full text-center py-20">
                <p className="text-foreground/50 italic font-playfair text-xl">Nuestra boutique se encuentra preparando nuevas reliquias...</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}