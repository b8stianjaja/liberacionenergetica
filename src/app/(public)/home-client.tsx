"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Star, Laptop, MessageCircle, Mail, X, ArrowRight } from "lucide-react";
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
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  
  const { addItem } = useCart();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    document.body.style.overflow = selectedProduct ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedProduct]);

  const dynamicFilters = useMemo(() => [{ id: 'ALL', label: 'Compendio' }, ...categories.map(cat => ({ id: cat.id, label: cat.name }))], [categories]);
  const filteredProducts = useMemo(() => products.filter(product => activeFilter === 'ALL' || product.categoryId === activeFilter || product.type === activeFilter), [products, activeFilter]);
  const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);

  // === GSAP ANIMATIONS ===
  useGSAP(() => {
    // 1. Custom Cursor Logic (Only Desktop)
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (!isTouch && cursorRef.current && cursorDotRef.current) {
      const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.5, ease: "power3.out" });
      const xDotTo = gsap.quickTo(cursorDotRef.current, "x", { duration: 0.1, ease: "power3.out" });
      const yDotTo = gsap.quickTo(cursorDotRef.current, "y", { duration: 0.1, ease: "power3.out" });

      const moveCursor = (e: MouseEvent) => {
        xTo(e.clientX); yTo(e.clientY);
        xDotTo(e.clientX); yDotTo(e.clientY);
      };
      window.addEventListener("mousemove", moveCursor);

      // Magnetic hover states
      const hoverElements = document.querySelectorAll('.hover-trigger');
      hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => gsap.to(cursorRef.current, { scale: 2.5, backgroundColor: 'rgba(196, 154, 69, 0.1)', borderColor: 'rgba(196, 154, 69, 0.5)', duration: 0.3 }));
        el.addEventListener('mouseleave', () => gsap.to(cursorRef.current, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(196, 154, 69, 0.3)', duration: 0.3 }));
      });

      return () => window.removeEventListener("mousemove", moveCursor);
    }

    // 2. Hero Initial Reveal (Text Masking)
    const tl = gsap.timeline();
    tl.from(".hero-line", { y: 150, opacity: 0, duration: 1.5, stagger: 0.15, ease: "power4.out", delay: 0.2 })
      .from(".hero-image-wrapper", { scale: 1.1, opacity: 0, duration: 2, ease: "expo.out" }, "-=1.2")
      .from(".hero-subtitle", { y: 20, opacity: 0, duration: 1, ease: "power2.out" }, "-=1");

    // 3. Parallax Hero Image
    gsap.to(".hero-parallax-img", {
      yPercent: 20,
      ease: "none",
      scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: true }
    });

    // 4. Staggered Reveals for Elements on Scroll
    const revealSections = gsap.utils.toArray('.reveal-section');
    revealSections.forEach((section: any) => {
      gsap.from(section, { scrollTrigger: { trigger: section, start: "top 80%" }, y: 50, opacity: 0, duration: 1.2, ease: "power3.out" });
    });

    const revealCards = gsap.utils.toArray('.reveal-card');
    revealCards.forEach((card: any, i) => {
      gsap.from(card, { scrollTrigger: { trigger: card, start: "top 85%" }, y: 40, opacity: 0, duration: 1, ease: "power3.out", delay: (i % 4) * 0.1 });
    });

  }, { scope: container, dependencies: [filteredProducts] });

  return (
    <div ref={container} className="w-full relative">
      
      {/* Custom Cursor HTML */}
      <div className="hidden lg:block pointer-events-none z-[99999]">
        <div ref={cursorDotRef} className="fixed top-0 left-0 w-2 h-2 bg-gold rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div ref={cursorRef} className="fixed top-0 left-0 w-10 h-10 border border-gold/30 rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors" />
      </div>

      {/* 1. HERO SECTION (Awwwards Style) */}
      <section className="hero-section relative w-full h-[100svh] flex flex-col justify-center overflow-hidden pt-20 px-4 md:px-12">
        <div className="max-w-[90rem] w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
          
          <div className="w-full lg:w-1/2 flex flex-col z-20">
            <h1 className="font-playfair text-[3.5rem] leading-[1] md:text-[6rem] lg:text-[7.5rem] text-foreground tracking-[-0.03em] clip-text-mask pb-2">
              <div className="hero-line block">Conecta</div>
              <div className="hero-line block text-gold italic font-light">tu luz</div>
              <div className="hero-line block">interior.</div>
            </h1>
            <p className="hero-subtitle text-gray-500 mt-8 max-w-md text-sm md:text-base leading-relaxed font-light">
              Espacio dedicado a la sanación profunda a través de la radiestesia, biodecodificación y herramientas ancestrales.
            </p>
          </div>

          {banners.length > 0 && (
            <div className="hero-image-wrapper w-full lg:w-1/2 h-[50vh] lg:h-[75vh] relative rounded-[2rem] overflow-hidden shadow-2xl origin-bottom">
              <div className="absolute inset-0 z-10 bg-gradient-to-tr from-foreground/20 to-transparent mix-blend-multiply"></div>
              <Image 
                src={banners[0].imageUrl} alt="Luz Interior" fill priority sizes="(max-width: 1024px) 100vw, 50vw" 
                className="hero-parallax-img object-cover object-center scale-110" 
              />
            </div>
          )}
        </div>
      </section>

      {/* 2. TERAPIAS SECTION */}
      <section id="terapias" className="w-full bg-white py-32 rounded-t-[4rem] relative z-20 -mt-10 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12">
          <div className="reveal-section flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <h2 className="font-playfair text-5xl md:text-7xl text-foreground leading-tight tracking-tight">
              Acompaño tu <br/><span className="text-gold italic">transformación</span>
            </h2>
            <p className="max-w-sm text-gray-500 text-sm leading-relaxed pb-2">Herramientas poderosas para liberar bloqueos emocionales y recuperar el bienestar natural de tu ser.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {['Radiestesia', 'Péndulo Hebreo', 'Cruz de Ankh', 'Biodecodificación'].map((therapy, i) => (
              <div key={therapy} className="reveal-card group flex flex-col justify-between p-8 bg-background rounded-3xl h-64 border border-purple-50 hover-trigger hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer">
                <div className="text-3xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">✨</div>
                <div>
                  <div className="w-8 h-[1px] bg-gold mb-4 group-hover:w-16 transition-all duration-500"></div>
                  <span className="font-playfair text-xl md:text-2xl text-foreground block">{therapy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TESTIMONIOS (Scroller Horizontal Falso o Grid Limpio) */}
      <section id="testimonios" className="w-full bg-background py-32 overflow-hidden">
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12">
          <div className="reveal-section text-center mb-20">
            <h2 className="font-playfair text-5xl md:text-6xl text-foreground mb-4">Palabras de <span className="italic text-gold">luz</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="reveal-card bg-white p-10 lg:p-12 rounded-[2rem] shadow-sm border border-transparent hover:border-gold/20 transition-colors h-full flex flex-col hover-trigger">
                <div className="flex text-gold mb-8">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" className="mr-1" />)}
                </div>
                <p className="text-foreground/80 leading-loose mb-8 flex-grow text-sm lg:text-base italic font-light">
                  "Quiero agradecerte de corazón tu limpieza, hace meses no sentía esta tranquilidad. Estoy tan feliz, no siento odio, solo una paz inmensa."
                </p>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BOUTIQUE (Grid Premium) */}
      <section id="boutique" className="w-full bg-white py-32 rounded-[4rem] shadow-[0_-20px_50px_rgba(0,0,0,0.02)] relative z-20">
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12">
          <div className="reveal-section flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <h2 className="font-playfair text-5xl md:text-7xl text-foreground tracking-tight">La <span className="italic text-gold">Boutique</span></h2>
            
            <div className="flex flex-wrap gap-2 md:gap-4">
              {dynamicFilters.map((filter) => (
                <button
                  key={filter.id} onClick={() => setActiveFilter(filter.id)}
                  className={`px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-500 hover-trigger ${
                    activeFilter === filter.id ? 'bg-foreground text-white' : 'bg-background text-foreground/50 hover:text-foreground hover:bg-lavender'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 mt-20">
            {filteredProducts.map((product) => (
              <article key={product.id} onClick={() => setSelectedProduct(product)} className="reveal-card group cursor-pointer hover-trigger flex flex-col h-full">
                {/* Contenedor de Imagen Premium */}
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-background mb-6">
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]" sizes="(max-width: 768px) 100vw, 33vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">✨</div>
                  )}
                  {/* Etiqueta elegante */}
                  <div className="absolute top-4 left-4 overflow-hidden">
                    <span className="block px-4 py-2 bg-white/90 backdrop-blur-md text-foreground text-[9px] font-bold tracking-widest uppercase rounded-full transform translate-y-0 opacity-100 transition-all duration-500">
                      {product.type === 'SERVICE' ? 'Terapia' : 'Materia'}
                    </span>
                  </div>
                  {/* Overlay oscuro en hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold tracking-[0.3em] uppercase translate-y-4 group-hover:translate-y-0 transition-all duration-500">Ver Visión</span>
                  </div>
                </div>
                
                {/* Info del producto */}
                <h3 className="font-playfair text-2xl text-foreground mb-2 group-hover:text-gold transition-colors">{product.name}</h3>
                <p className="text-xs text-gray-400 line-clamp-2 mb-4 flex-grow font-light leading-relaxed">{product.description}</p>
                
                <div className="flex items-center justify-between mt-auto border-t border-purple-50 pt-4 relative overflow-hidden">
                  <span className="font-playfair text-xl text-foreground">{formatPrice(product.price)}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || null }); }}
                    disabled={product.stock === 0}
                    className="absolute right-0 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gold translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                  >
                    Añadir <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CONTACTO */}
      <section className="w-full bg-background py-32">
        <div className="reveal-section max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-5xl md:text-7xl text-foreground mb-16 tracking-tight">Conecta <span className="italic text-gold">conmigo</span></h2>
          <div className="glass-panel p-8 md:p-16 rounded-[3rem] shadow-xl flex flex-col md:flex-row justify-around items-center gap-12 border border-white">
            {[
              { icon: Laptop, title: "Modalidad", desc: "Online / Presencial" },
              { icon: MessageCircle, title: "WhatsApp", desc: "+56 9 XXXX XXXX" },
              { icon: Mail, title: "Email", desc: "contacto@liberacion.cl" }
            ].map((contact, i) => (
              <div key={i} className="flex flex-col items-center hover-trigger group">
                <contact.icon className="text-gold mb-6 group-hover:scale-110 transition-transform duration-500" size={36} strokeWidth={1} />
                <span className="font-playfair text-2xl text-foreground mb-2">{contact.title}</span>
                <span className="text-xs tracking-widest text-gray-500 uppercase font-bold">{contact.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MODAL DE PRODUCTO (Glassmorphism) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[999999] flex items-end md:items-center justify-center p-0 md:p-8">
          <div className="absolute inset-0 bg-foreground/90 backdrop-blur-xl transition-opacity animate-in fade-in duration-500" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-[70rem] h-[90vh] md:h-[80vh] bg-background md:rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-500 ease-out">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 z-20 p-3 bg-white/50 backdrop-blur-md rounded-full text-foreground hover:bg-white hover:rotate-90 transition-all duration-300">
              <X size={24} strokeWidth={1.5} />
            </button>
            
            <div className="w-full md:w-1/2 relative h-[40vh] md:h-full bg-lavender/30">
              {selectedProduct.imageUrl && <Image src={selectedProduct.imageUrl} alt={selectedProduct.name} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />}
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col overflow-y-auto custom-scrollbar bg-white">
              <span className="inline-block px-4 py-2 text-[9px] font-bold tracking-[0.3em] uppercase rounded-full border border-gold text-gold w-max mb-8">
                {selectedProduct.type === 'SERVICE' ? 'Sanación' : 'Herramienta'}
              </span>
              
              <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-foreground mb-8 leading-[1.1]">{selectedProduct.name}</h2>
              <div className="w-16 h-[1px] bg-gold mb-8"></div>
              
              <p className="text-gray-500 mb-12 flex-grow leading-loose font-light text-sm md:text-base whitespace-pre-line">
                {selectedProduct.description}
              </p>
              
              <div className="flex items-center justify-between pt-8 border-t border-purple-50 mt-auto">
                <span className="font-playfair text-4xl text-foreground">{formatPrice(selectedProduct.price)}</span>
                <button 
                  onClick={() => { addItem({ id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, imageUrl: selectedProduct.imageUrl || null }); setSelectedProduct(null); }}
                  disabled={selectedProduct.stock === 0}
                  className="bg-foreground text-white px-10 py-5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gold transition-colors duration-500 disabled:opacity-50"
                >
                  {selectedProduct.stock === 0 ? 'Agotado' : 'Adquirir obra'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}