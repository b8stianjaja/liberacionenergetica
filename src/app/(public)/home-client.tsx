"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Star, Laptop, MessageCircle, Mail, X, Plus, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export type Category = { id: string; name: string; };
export type Banner = { id: string; title: string; subtitle: string; imageUrl: string; };
export type Product = { id: string; name: string; description: string; price: number; type: string; categoryId: string | null; duration: number | null; stock: number; imageUrl: string | null; };

interface HomeClientProps { products: Product[]; categories: Category[]; banners: Banner[]; }

export default function HomeClient({ products, categories, banners }: HomeClientProps) {
  const container = useRef<HTMLDivElement>(null);
  const cursorDot = useRef<HTMLDivElement>(null);
  const cursorAura = useRef<HTMLDivElement>(null);
  
  const { addItem } = useCart();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filtros
  const dynamicFilters = useMemo(() => [{ id: 'ALL', label: 'El Compendio' }, ...categories.map(cat => ({ id: cat.id, label: cat.name }))], [categories]);
  const filteredProducts = useMemo(() => products.filter(product => activeFilter === 'ALL' || product.categoryId === activeFilter || product.type === activeFilter), [products, activeFilter]);
  const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);

  // Lógica del Scroll Modal
  useEffect(() => {
    if (selectedProduct) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedProduct]);

  // ANIMACIONES GSAP (LA MAGIA)
  useGSAP(() => {
    // 1. Cursor Mágico (Solo en Desktop)
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isDesktop && cursorDot.current && cursorAura.current) {
      gsap.set([cursorDot.current, cursorAura.current], { xPercent: -50, yPercent: -50 });
      const xDot = gsap.quickTo(cursorDot.current, "x", { duration: 0.1, ease: "power3" });
      const yDot = gsap.quickTo(cursorDot.current, "y", { duration: 0.1, ease: "power3" });
      const xAura = gsap.quickTo(cursorAura.current, "x", { duration: 0.5, ease: "power3.out" });
      const yAura = gsap.quickTo(cursorAura.current, "y", { duration: 0.5, ease: "power3.out" });

      window.addEventListener("mousemove", (e) => {
        xDot(e.clientX); yDot(e.clientY);
        xAura(e.clientX); yAura(e.clientY);
      });
    }

    // 2. Parallax del Hero
    gsap.to(".hero-image", {
      yPercent: 20,
      ease: "none",
      scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: true }
    });

    // 3. Revelado Suave de Secciones (Fade Up)
    const sections = gsap.utils.toArray('.gsap-reveal');
    sections.forEach((sec: any) => {
      gsap.fromTo(sec, 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: sec, start: "top 80%", toggleActions: "play none none reverse" } }
      );
    });

    // 4. Stagger de Tarjetas y Productos (Aparición en cascada)
    const staggerContainers = gsap.utils.toArray('.gsap-stagger-container');
    staggerContainers.forEach((container: any) => {
      const items = container.querySelectorAll('.gsap-stagger-item');
      gsap.fromTo(items,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)", scrollTrigger: { trigger: container, start: "top 75%" } }
      );
    });
  }, { scope: container, dependencies: [filteredProducts] });

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || null });
    // Pequeño pulso en el botón al añadir
    if (e?.currentTarget) {
      gsap.fromTo(e.currentTarget, { scale: 0.8 }, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
    }
  };

  return (
    <div ref={container} className="w-full relative md:cursor-none">
      
      {/* CURSOR MÁGICO */}
      <div className="hidden md:block pointer-events-none z-[9999]">
        <div ref={cursorDot} className="fixed top-0 left-0 w-2 h-2 bg-gold rounded-full mix-blend-difference" />
        <div ref={cursorAura} className="fixed top-0 left-0 w-10 h-10 border border-gold/50 bg-gold/10 rounded-full" />
      </div>

      {/* 1. HERO CON PARALLAX */}
      {banners.length > 0 && (
        <section className="hero-section w-full max-w-[90rem] mx-auto px-4 mt-6 overflow-hidden rounded-[2.5rem] h-[50vh] sm:h-[70vh] relative gsap-reveal">
          <div className="absolute inset-0 w-full h-[120%] -top-[10%]">
             <Image src={banners[0].imageUrl} alt={banners[0].title} fill className="hero-image object-cover" priority sizes="100vw" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent flex flex-col justify-end p-8 sm:p-20 text-white">
            <h2 className="font-playfair text-5xl sm:text-7xl mb-4 drop-shadow-lg">{banners[0].title}</h2>
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] font-bold text-gold drop-shadow-md">{banners[0].subtitle}</p>
          </div>
        </section>
      )}

      {/* 2. TESTIMONIOS */}
      <section id="testimonios" className="w-full max-w-6xl mx-auto px-4 py-32 text-center gsap-reveal">
        <Sparkles className="w-8 h-8 text-gold mx-auto mb-6 animate-float" />
        <h1 className="font-playfair text-5xl md:text-7xl text-foreground mb-4">
          Testimonios <br/><span className="text-gradient-gold italic font-light">de corazón</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base mb-20 tracking-wide">
          Cada testimonio es una historia de transformación y un recordatorio de que sanar es posible.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left gsap-stagger-container">
          {[1, 2, 3].map((item) => (
            <div key={item} className="gsap-stagger-item glass-panel p-10 rounded-[2rem] hover:shadow-2xl hover:shadow-gold/10 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold/0 via-gold/50 to-gold/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              <div className="flex text-gold mb-8">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" className="mr-1" />)}
              </div>
              <p className="text-[15px] text-gray-600 leading-loose mb-8 flex-grow font-light">
                "Hola Johana, buenos días. Quiero agradecerte de corazón tu limpieza, hace muchos meses que no sentía esta tranquilidad... Estoy tan feliz, no siento odio, solo tranquilidad."
              </p>
              <div className="text-center text-gold/30 text-2xl font-serif">❦</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TERAPIAS */}
      <section id="terapias" className="w-full bg-white/50 backdrop-blur-md py-32 border-y border-gold/10 relative gsap-reveal">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-playfair text-4xl sm:text-5xl text-foreground mb-3">Acompaño tu proceso</h2>
          <h3 className="font-playfair text-3xl sm:text-4xl text-gold italic mb-12">de transformación</h3>
          
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 mt-16 gsap-stagger-container">
            {['Radiestesia', 'Péndulo Hebreo', 'Cruz de Ankh', 'Esencias de Bach', 'Biodecodificación'].map((therapy) => (
              <div key={therapy} className="gsap-stagger-item flex flex-col items-center group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-background border border-gold/20 flex items-center justify-center mb-6 group-hover:bg-foreground group-hover:border-foreground transition-colors duration-500 shadow-lg shadow-gold/5 relative">
                  <div className="absolute inset-0 rounded-full border border-gold/40 scale-[1.15] opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500"></div>
                  <span className="text-3xl animate-float" style={{ animationDelay: `${Math.random() * 2}s` }}>✨</span>
                </div>
                <span className="text-sm font-bold tracking-widest uppercase text-foreground/80 group-hover:text-gold transition-colors">{therapy}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BOUTIQUE */}
      <section id="boutique" className="w-full max-w-[90rem] mx-auto px-4 py-32 gsap-reveal">
        <div className="text-center mb-20">
          <h2 className="font-playfair text-5xl text-foreground mb-4">Boutique Holística</h2>
          <div className="w-12 h-1 bg-gold mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {dynamicFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-8 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${
                activeFilter === filter.id 
                  ? 'bg-foreground text-white shadow-lg shadow-purple-900/20 scale-105' 
                  : 'bg-white text-gray-400 border border-gray-100 hover:border-gold/50 hover:text-foreground'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 gsap-stagger-container">
          {filteredProducts.map((product) => (
            <article 
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="gsap-stagger-item glass-panel rounded-[2.5rem] p-5 hover:shadow-2xl hover:shadow-gold/15 transition-all duration-500 cursor-pointer flex flex-col group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-[40px] group-hover:bg-gold/20 transition-colors pointer-events-none"></div>
              
              <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-background mb-6">
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" sizes="(max-width: 768px) 100vw, 25vw" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300 bg-lavender/30">✨</div>
                )}
                <span className="absolute top-4 left-4 glass-panel text-foreground text-[9px] font-bold px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-sm">
                  {product.type === 'SERVICE' ? 'Terapia' : 'Artefacto'}
                </span>
              </div>
              
              <div className="px-2 pb-2 flex flex-col flex-grow">
                <h3 className="font-playfair text-2xl text-foreground mb-3 line-clamp-1">{product.name}</h3>
                <p className="text-[13px] text-gray-500 line-clamp-2 mb-6 flex-grow leading-relaxed font-light">{product.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gold/10">
                  <span className="font-playfair text-2xl font-medium text-foreground">{formatPrice(product.price)}</span>
                  <button 
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={product.stock === 0}
                    className="w-12 h-12 rounded-full bg-lavender text-foreground flex items-center justify-center hover:bg-gold hover:text-white transition-all duration-300 disabled:opacity-50 hover:rotate-90"
                  >
                    <Plus size={20} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. CONTACTO */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-32 text-center gsap-reveal">
        <h2 className="font-playfair text-4xl sm:text-5xl text-foreground mb-3">Estoy aquí para ti</h2>
        <h3 className="font-playfair text-2xl sm:text-3xl text-gold italic mb-16">Agenda tu sesión</h3>
        
        <div className="glass-panel p-8 md:p-16 rounded-[3rem] shadow-xl shadow-purple-900/5 border border-white flex flex-col md:flex-row justify-around items-center gap-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none"></div>
          
          <div className="flex flex-col items-center z-10 group cursor-pointer">
            <div className="w-20 h-20 bg-background rounded-[2rem] flex items-center justify-center mb-6 text-gold group-hover:bg-gold group-hover:text-white transition-colors duration-500 shadow-sm rotate-3 group-hover:rotate-0">
              <Laptop size={32} strokeWidth={1.5} />
            </div>
            <span className="font-medium text-foreground text-lg">Modalidad</span>
            <span className="text-sm text-gray-500 mt-2 font-light">Online / Presencial</span>
          </div>
          
          <div className="flex flex-col items-center z-10 group cursor-pointer">
            <div className="w-20 h-20 bg-background rounded-[2rem] flex items-center justify-center mb-6 text-gold group-hover:bg-gold group-hover:text-white transition-colors duration-500 shadow-sm -rotate-3 group-hover:rotate-0">
              <MessageCircle size={32} strokeWidth={1.5} />
            </div>
            <span className="font-medium text-foreground text-lg">WhatsApp</span>
            <span className="text-sm text-gray-500 mt-2 font-light">+56 9 XXXX XXXX</span>
          </div>
        </div>
      </section>

      {/* 6. MODAL DE PRODUCTO (Glassmorphism Mágico) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-xl transition-opacity animate-in fade-in duration-500" onClick={() => setSelectedProduct(null)} />
          
          <div className="relative w-full max-w-6xl glass-panel bg-white/80 rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-gold/20 z-10 max-h-[90vh] animate-in slide-in-from-bottom-8 duration-500">
            
            <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 z-20 p-3 bg-white/50 backdrop-blur-md rounded-full text-foreground hover:bg-gold hover:text-white transition-colors duration-300">
              <X size={20} />
            </button>
            
            <div className="w-full md:w-1/2 relative min-h-[40vh] md:min-h-full bg-background/50">
              {selectedProduct.imageUrl ? (
                <Image src={selectedProduct.imageUrl} alt={selectedProduct.name} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl text-gold animate-pulse">✨</div>
              )}
            </div>
            
            <div className="w-full md:w-1/2 p-10 sm:p-16 flex flex-col overflow-y-auto custom-scrollbar">
              <span className="inline-block px-5 py-2 text-[10px] font-bold tracking-[0.3em] uppercase rounded-full bg-gold/10 text-gold w-max mb-8 border border-gold/20">
                {selectedProduct.type === 'SERVICE' ? 'Terapia' : 'Materia Fija'}
              </span>
              
              <h2 className="font-playfair text-4xl sm:text-6xl text-foreground mb-6 leading-tight">{selectedProduct.name}</h2>
              <div className="w-16 h-[1px] bg-gradient-to-r from-gold to-transparent mb-8"></div>
              
              <p className="text-gray-600 mb-8 flex-grow leading-loose font-light text-[15px] whitespace-pre-line">
                {selectedProduct.description}
              </p>

              {selectedProduct.duration && (
                <p className="text-[11px] font-bold tracking-[0.2em] text-gold uppercase mb-8 flex items-center">
                  <Sparkles size={14} className="mr-2" />
                  Duración: {selectedProduct.duration} minutos
                </p>
              )}
              
              <div className="flex items-center justify-between pt-8 border-t border-gold/10 mt-auto">
                <span className="font-playfair text-4xl text-foreground">{formatPrice(selectedProduct.price)}</span>
                <button 
                  onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}
                  disabled={selectedProduct.stock === 0}
                  className="relative overflow-hidden group bg-foreground text-white px-10 py-5 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-gold/30 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/30 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                  <span className="relative">{selectedProduct.stock === 0 ? 'Agotado' : 'Adquirir al compendio'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}