"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ArrowRight, Sparkles, X, Star } from "lucide-react";
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
  const portalRef = useRef<HTMLDivElement>(null);
  
  const { addItem } = useCart();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    document.body.style.overflow = selectedProduct ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedProduct]);

  const dynamicFilters = useMemo(() => [{ id: 'ALL', label: 'Todo' }, ...categories.map(cat => ({ id: cat.id, label: cat.name }))], [categories]);
  const filteredProducts = useMemo(() => products.filter(product => activeFilter === 'ALL' || product.categoryId === activeFilter || product.type === activeFilter), [products, activeFilter]);
  const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // 1. Efecto Portal Zoom (Solo Desktop para evitar fallos en Safari Mobile)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero-pin-container",
          start: "top top",
          end: "+=120%",
          scrub: 1,
          pin: true,
        }
      });

      tl.to(".hero-title-wrap", { opacity: 0, y: -50, duration: 0.5 })
        .to(portalRef.current, {
          width: "100vw",
          height: "100vh",
          borderRadius: "0px",
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "power2.inOut",
          duration: 1.5
        }, "-=0.3");
    });

    // Fade in normal para los testimonios
    gsap.utils.toArray('.fade-up').forEach((el: any) => {
      gsap.fromTo(el, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" }
      });
    });

  }, { scope: container });

  return (
    <div ref={container} className="w-full relative">
      
      {/* 1. HERO: El Portal */}
      <section className="hero-pin-container relative w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-background">
        <div className="hero-title-wrap absolute top-[15%] md:top-[20%] text-center z-20 px-4">
          <span className="text-[10px] text-gold tracking-[0.4em] uppercase font-bold mb-6 block">Sanación Energética</span>
          <h1 className="font-playfair text-[12vw] md:text-[8vw] leading-[0.85] tracking-tighter text-foreground mix-blend-multiply">
            El arte de <br />
            <span className="text-outline-gold italic font-light">liberar.</span>
          </h1>
        </div>

        {banners.length > 0 ? (
          <div 
            ref={portalRef}
            className="absolute bottom-0 w-[85vw] md:w-[40vw] h-[60vh] md:h-[65vh] arch-clip overflow-hidden shadow-2xl z-10 origin-bottom"
          >
            <Image src={banners[0].imageUrl} alt="Portal" fill priority className="object-cover scale-110" sizes="(max-width: 768px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent"></div>
          </div>
        ) : (
          <div ref={portalRef} className="absolute bottom-0 w-[40vw] h-[65vh] arch-clip bg-gold z-10"></div>
        )}
      </section>

      {/* 2. TESTIMONIOS: Diseño Editorial */}
      <section className="w-full py-24 md:py-40 px-6 md:px-12 bg-white relative z-20">
        <div className="max-w-5xl mx-auto text-center fade-up">
          <Sparkles className="text-gold mx-auto mb-6" size={24} strokeWidth={1} />
          <h2 className="font-playfair text-3xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-16">
            "Hace meses que no sentía esta tranquilidad. No siento odio, ni pena, solo una paz inmensa que buscaba hace tanto tiempo."
          </h2>
          <div className="flex items-center justify-center gap-2 text-gold">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
          </div>
          <span className="block mt-4 text-[10px] tracking-widest uppercase font-bold text-gray-400">Palabras de Luz</span>
        </div>
      </section>

      {/* 3. TERAPIAS: Stacking Cards (Cartas Apiladas) */}
      <section id="terapias" className="w-full py-24 px-6 md:px-12 bg-background relative">
        <div className="max-w-[90rem] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
          
          {/* Título pegajoso a la izquierda */}
          <div className="lg:w-1/3 lg:sticky lg:top-32 h-fit mb-12 lg:mb-0">
            <h2 className="font-playfair text-5xl md:text-7xl text-foreground tracking-tight leading-[0.9] mb-6">
              Tus <br /><span className="text-gold italic">Caminos</span>
            </h2>
            <p className="text-gray-500 font-light leading-relaxed max-w-sm">
              Cada terapia es una llave distinta diseñada para abrir los candados de tu subconsciente y restaurar tu flujo vital.
            </p>
          </div>

          {/* Cartas apiladas a la derecha */}
          <div className="lg:w-2/3 flex flex-col gap-6 md:gap-8 relative pb-24">
            {[
              { title: 'Radiestesia', desc: 'Diagnóstico y limpieza del campo áurico mediante el uso del péndulo.', color: 'bg-white' },
              { title: 'Péndulo Hebreo', desc: 'Terapia de alta vibración que utiliza letras sagradas para desprogramar energías densas.', color: 'bg-lavender' },
              { title: 'Biodecodificación', desc: 'Encuentra y libera la emoción oculta detrás de tus síntomas físicos.', color: 'bg-gold text-white' }
            ].map((therapy, i) => (
              <div 
                key={therapy.title} 
                className={`sticky top-24 md:top-32 w-full min-h-[40vh] md:min-h-[50vh] p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-black/5 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 ${therapy.color}`}
                style={{ zIndex: i + 1, marginTop: i > 0 ? '10vh' : '0' }}
              >
                <span className="text-5xl md:text-7xl font-playfair opacity-20">0{i+1}</span>
                <div>
                  <h3 className="font-playfair text-3xl md:text-5xl mb-4">{therapy.title}</h3>
                  <p className={`text-sm md:text-base max-w-md leading-relaxed ${therapy.color.includes('text-white') ? 'text-white/80' : 'text-gray-600'}`}>
                    {therapy.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BOUTIQUE: Galería Horizontal Libre */}
      <section id="boutique" className="w-full py-32 bg-white relative overflow-hidden">
        <div className="px-6 md:px-12 mb-12 flex flex-col md:flex-row justify-between items-end gap-6 max-w-[100rem] mx-auto fade-up">
          <h2 className="font-playfair text-5xl md:text-7xl text-foreground">El <span className="italic text-gold">Bazar</span></h2>
          <div className="flex flex-wrap gap-2">
            {dynamicFilters.map((filter) => (
              <button
                key={filter.id} onClick={() => setActiveFilter(filter.id)}
                className={`px-5 py-2.5 rounded-full text-[9px] font-bold tracking-widest uppercase transition-all duration-300 border ${
                  activeFilter === filter.id ? 'bg-foreground text-white border-foreground' : 'bg-transparent text-gray-400 border-gray-200 hover:border-gold hover:text-foreground'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll Horizontal Nativo (Super suave en móvil y trackpad) */}
        <div className="w-full overflow-x-auto hide-scroll snap-x snap-mandatory cursor-grab active:cursor-grabbing px-6 md:px-12 pb-12">
          <div className="flex gap-6 md:gap-10 w-max">
            {filteredProducts.map((product) => (
              <article 
                key={product.id} 
                className="w-[75vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] snap-center group flex flex-col"
              >
                <div 
                  className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-background mb-6 cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" sizes="(max-width: 768px) 75vw, 30vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-background"><Sparkles className="text-gold/30" size={32} /></div>
                  )}
                  <div className="absolute inset-0 bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <h3 className="font-playfair text-xl md:text-2xl text-foreground mb-1 pr-4 leading-tight">{product.name}</h3>
                <span className="text-[10px] tracking-widest uppercase text-gray-400 mb-4 block">
                  {product.type === 'SERVICE' ? 'Terapia' : 'Objeto'}
                </span>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-playfair text-lg text-gold">{formatPrice(product.price)}</span>
                  <button 
                    onClick={() => addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || null })}
                    disabled={product.stock === 0}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-background text-foreground hover:bg-gold hover:text-white transition-colors disabled:opacity-50"
                  >
                    <ArrowRight size={16} strokeWidth={1.5} className="-rotate-45" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL DEL PRODUCTO (Glass Minimalista) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[999999] flex items-end md:items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-md transition-opacity" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-5xl bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl z-10 animate-in slide-in-from-bottom-10 duration-500 ease-out max-h-[90vh]">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 md:top-8 md:right-8 z-20 w-10 h-10 bg-white/80 backdrop-blur-md flex items-center justify-center rounded-full text-foreground hover:scale-110 transition-transform">
              <X size={20} strokeWidth={1.5} />
            </button>
            
            <div className="w-full md:w-1/2 relative h-[35vh] md:h-[70vh] bg-background">
              {selectedProduct.imageUrl && <Image src={selectedProduct.imageUrl} alt={selectedProduct.name} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />}
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col overflow-y-auto">
              <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-gold mb-4 block">
                {selectedProduct.type === 'SERVICE' ? 'Sesión Sanadora' : 'Pieza Única'}
              </span>
              <h2 className="font-playfair text-3xl md:text-5xl text-foreground mb-6 leading-tight">{selectedProduct.name}</h2>
              <p className="text-gray-500 mb-8 leading-relaxed font-light text-sm md:text-base whitespace-pre-line flex-grow">
                {selectedProduct.description}
              </p>
              <div className="flex items-center justify-between pt-8 border-t border-black/5 mt-auto">
                <span className="font-playfair text-3xl text-foreground">{formatPrice(selectedProduct.price)}</span>
                <button 
                  onClick={() => { addItem({ id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, imageUrl: selectedProduct.imageUrl || null }); setSelectedProduct(null); }}
                  disabled={selectedProduct.stock === 0}
                  className="bg-foreground text-white px-8 py-4 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-gold transition-colors disabled:opacity-50"
                >
                  {selectedProduct.stock === 0 ? 'Agotado' : 'Adquirir Obra'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}