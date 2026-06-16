"use client";

import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Star, ArrowRight, HeartHandshake, X, Sparkles } from "lucide-react";
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Manejo de scroll para el modal
  if (typeof document !== "undefined") {
    document.body.style.overflow = selectedProduct ? 'hidden' : '';
  }

  const dynamicFilters = useMemo(() => [{ id: 'ALL', label: 'Ver Todo' }, ...categories.map(cat => ({ id: cat.id, label: cat.name }))], [categories]);
  const filteredProducts = useMemo(() => products.filter(product => activeFilter === 'ALL' || product.categoryId === activeFilter || product.type === activeFilter), [products, activeFilter]);
  const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);

  useGSAP(() => {
    // 1. HERO REVEAL EXAGERADO PERO ELEGANTE
    const tl = gsap.timeline();
    
    // Títulos emergiendo desde abajo con ligero ángulo
    tl.fromTo(".hero-title-line", 
      { y: 150, opacity: 0, rotateZ: 5 }, 
      { y: 0, opacity: 1, rotateZ: 0, duration: 1.5, stagger: 0.15, ease: "power4.out", delay: 0.2 }
    )
    // Descripción y botones
    .fromTo(".hero-desc", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, "-=1")
    // Zoom extremo y suavizado de la imagen
    .fromTo(".hero-img-wrap", 
      { scale: 1.4, opacity: 0, borderRadius: "100%" }, 
      { scale: 1, opacity: 1, borderRadius: "3rem", duration: 2.5, ease: "expo.out" }, "-=1.5"
    );

    // 2. ELEMENTOS FLOTANTES CONTINUOS (ENERGÍA VIVA)
    gsap.to(".float-icon", {
      y: -15,
      duration: 2.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.2
    });

    // 3. APARICIÓN EN CASCADA CON EFECTO RESORTE (BOUTIQUE & TERAPIAS)
    const staggerSections = gsap.utils.toArray('.stagger-section');
    staggerSections.forEach((section: any) => {
      gsap.fromTo(section.querySelectorAll('.stagger-card'), 
        { y: 100, opacity: 0, scale: 0.95 }, 
        { 
          y: 0, opacity: 1, scale: 1, 
          duration: 1.2, 
          stagger: 0.15, 
          ease: "back.out(1.2)", // Efecto rebote sutil y exagerado
          scrollTrigger: { trigger: section, start: "top 80%" } 
        }
      );
    });

    // 4. PARALLAX EN IMÁGENES DE PRODUCTOS (Profundidad)
    const parallaxImgs = gsap.utils.toArray('.img-parallax');
    parallaxImgs.forEach((img: any) => {
      gsap.fromTo(img, 
        { yPercent: -15 }, 
        { 
          yPercent: 15, 
          ease: "none", 
          scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } 
        }
      );
    });

  }, { scope: container, dependencies: [filteredProducts] });

  return (
    <div ref={container} className="w-full">
      
      {/* --- HERO SECTION --- */}
      <section className="w-full pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div className="max-w-[85rem] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          
          <div className="w-full lg:w-1/2 flex flex-col z-10">
            <span className="hero-desc text-gold font-bold tracking-widest uppercase text-xs mb-8 flex items-center gap-3">
              <HeartHandshake size={18} className="float-icon" /> Bienvenida a tu espacio seguro
            </span>
            
            <h1 className="font-playfair text-6xl md:text-7xl lg:text-[5rem] text-foreground leading-[1.1] mb-8">
              <div className="overflow-hidden"><div className="hero-title-line">Sanación</div></div>
              <div className="overflow-hidden"><div className="hero-title-line italic text-gold font-light">energética</div></div>
              <div className="overflow-hidden"><div className="hero-title-line">para el alma.</div></div>
            </h1>
            
            <div className="hero-desc">
              <p className="text-lg text-foreground/70 leading-relaxed mb-10 max-w-lg">
                Te acompaño a ti y a tu familia a liberar bloqueos emocionales, restaurando el equilibrio natural desde la raíz con herramientas compasivas y efectivas.
              </p>
              <div className="flex gap-4">
                <a href="#terapias" className="bg-foreground text-white px-10 py-5 rounded-full text-sm font-bold tracking-wider hover:bg-gold hover:scale-105 hover:shadow-lg transition-all duration-500">
                  Comenzar el viaje
                </a>
              </div>
            </div>
          </div>

          {/* Imagen Cálida y Armoniosa con Zoom Exagerado */}
          <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-[70vh]">
            {banners.length > 0 ? (
              <div className="hero-img-wrap absolute inset-0 w-full h-full overflow-hidden shadow-2xl border-8 border-white">
                <Image src={banners[0].imageUrl} alt="Armonía" fill priority className="object-cover scale-110" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
            ) : (
              <div className="hero-img-wrap absolute inset-0 w-full h-full bg-gold/20 flex items-center justify-center shadow-2xl border-8 border-white">
                <Sparkles className="text-gold float-icon" size={64} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- TERAPIAS --- */}
      <section id="terapias" className="stagger-section w-full bg-white py-32 px-6 border-y border-foreground/5 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <div className="max-w-[85rem] mx-auto">
          <div className="stagger-card text-center mb-20">
            <h2 className="font-playfair text-5xl md:text-6xl text-foreground mb-6">Mis Herramientas</h2>
            <div className="w-16 h-1 bg-gold mx-auto mb-6 rounded-full"></div>
            <p className="text-foreground/60 text-lg md:text-xl max-w-2xl mx-auto">Técnicas nobles y adaptables diseñadas para sanar en cada etapa de la vida.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Radiestesia', desc: 'Evaluación y armonización del campo electromagnético (Aura y Chakras). Ideal para devolver la vitalidad profunda.' },
              { title: 'Péndulo Hebreo', desc: 'Desprogramación de energías densas y memorias de dolor a través de letras sagradas. Una limpieza transformadora.' },
              { title: 'Biodecodificación', desc: 'Encuentra el origen emocional oculto detrás de tus molestias físicas para soltarlas de manera consciente y amorosa.' }
            ].map((therapy, i) => (
              <div key={i} className="stagger-card group bg-background p-12 rounded-[2.5rem] shadow-sm border border-black/5 hover:shadow-xl hover:-translate-y-3 transition-all duration-500">
                <div className="w-16 h-16 bg-lavender text-foreground flex items-center justify-center rounded-[1.5rem] mb-8 text-3xl group-hover:bg-gold group-hover:text-white transition-colors duration-500">
                  <span className="float-icon">✨</span>
                </div>
                <h3 className="font-playfair text-3xl text-foreground mb-4 group-hover:text-gold transition-colors duration-500">{therapy.title}</h3>
                <p className="text-foreground/70 leading-relaxed text-base">{therapy.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BOUTIQUE --- */}
      <section id="boutique" className="stagger-section w-full py-32 px-6 bg-background">
        <div className="max-w-[85rem] mx-auto">
          <div className="stagger-card flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
            <h2 className="font-playfair text-5xl md:text-6xl text-foreground">Boutique Holística</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {dynamicFilters.map((filter) => (
                <button
                  key={filter.id} onClick={() => setActiveFilter(filter.id)}
                  className={`px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                    activeFilter === filter.id ? 'bg-foreground text-white shadow-md' : 'bg-white text-foreground/50 border border-foreground/10 hover:border-gold hover:text-foreground'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {filteredProducts.map((product) => (
              <article key={product.id} className="stagger-card bg-white rounded-[2.5rem] p-5 shadow-sm border border-foreground/5 flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                
                {/* Imagen del Producto con Parallax Interno */}
                <div 
                  className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-background mb-6 cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} fill className="img-parallax object-cover scale-125" sizes="(max-width: 768px) 100vw, 25vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gold/30"><Star size={40} className="float-icon" /></div>
                  )}
                  {/* Overlay sutil al hacer hover */}
                  <div className="absolute inset-0 bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-foreground text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
                    {product.type === 'SERVICE' ? 'Terapia' : 'Objeto'}
                  </span>
                </div>
                
                <h3 className="font-playfair text-2xl text-foreground mb-3 leading-tight px-2">{product.name}</h3>
                <p className="text-sm text-foreground/60 line-clamp-2 mb-8 flex-grow px-2">{product.description}</p>
                
                {/* Acción de Compra */}
                <div className="pt-5 border-t border-foreground/5 mt-auto flex flex-col gap-4 px-2">
                  <span className="font-playfair text-3xl text-foreground font-medium">{formatPrice(product.price)}</span>
                  <button 
                    onClick={() => addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || null })}
                    disabled={product.stock === 0}
                    className="w-full bg-lavender text-foreground hover:bg-gold hover:text-white py-4 rounded-2xl text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
                  >
                    {product.stock === 0 ? 'Agotado' : <>Agregar al Carrito <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIOS --- */}
      <section id="testimonios" className="stagger-section w-full bg-lavender/40 py-32 px-6">
        <div className="max-w-[85rem] mx-auto text-center">
          <div className="stagger-card mb-20">
            <Sparkles className="text-gold mx-auto mb-6 float-icon" size={32} />
            <h2 className="font-playfair text-5xl md:text-6xl text-foreground">Experiencias de corazón</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              "Gracias a la sesión de péndulo, mi hijo ha vuelto a dormir tranquilo. Johanna tiene una energía maternal y muy cálida que nos dio mucha confianza desde el primer minuto.",
              "Llevaba meses sintiendo un peso en el pecho. La biodecodificación me ayudó a entender el origen. Hoy me siento más ligera, en paz y feliz. Totalmente recomendada.",
              "Una experiencia maravillosa. Su consulta transmite mucha paz y profesionalidad. Me explicó cada paso con paciencia. Un antes y un después en mi bienestar."
            ].map((text, i) => (
              <div key={i} className="stagger-card bg-white p-10 lg:p-12 rounded-[2.5rem] shadow-md flex flex-col hover:-translate-y-2 transition-transform duration-500">
                <div className="flex text-gold mb-8">
                  {[...Array(5)].map((_, index) => <Star key={index} size={18} fill="currentColor" className="mr-1" />)}
                </div>
                <p className="text-foreground/80 leading-relaxed italic text-lg flex-grow">"{text}"</p>
                <div className="mt-10 pt-6 border-t border-background font-playfair text-gold text-xl">
                  Consultante
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL DEL PRODUCTO (Zoom in orgánico) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-foreground/60 backdrop-blur-md transition-opacity" onClick={() => setSelectedProduct(null)} />
          
          {/* El modal aparece haciendo un "bloom" o florecimiento */}
          <div className="relative w-full max-w-6xl bg-white rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl z-10 animate-in zoom-in-95 duration-500 ease-out max-h-[90vh]">
            
            <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 z-20 w-14 h-14 bg-white/90 border border-foreground/10 flex items-center justify-center rounded-full text-foreground hover:bg-background hover:scale-110 transition-all duration-300 shadow-lg">
              <X size={28} strokeWidth={2} />
            </button>
            
            <div className="w-full md:w-1/2 relative h-[40vh] md:h-auto bg-background overflow-hidden">
              {selectedProduct.imageUrl && <Image src={selectedProduct.imageUrl} alt={selectedProduct.name} fill className="object-cover scale-105" sizes="(max-width: 768px) 100vw, 50vw" />}
            </div>
            
            <div className="w-full md:w-1/2 p-10 md:p-16 lg:p-20 flex flex-col overflow-y-auto">
              <h2 className="font-playfair text-4xl md:text-5xl text-foreground mb-6">{selectedProduct.name}</h2>
              <div className="w-20 h-1.5 bg-gold rounded-full mb-8"></div>
              
              <p className="text-foreground/70 mb-10 leading-relaxed text-lg whitespace-pre-line flex-grow">
                {selectedProduct.description}
              </p>

              {selectedProduct.duration && (
                <div className="bg-lavender/50 p-6 rounded-2xl mb-10 flex items-center gap-4">
                  <span className="text-foreground font-bold uppercase tracking-widest text-xs">Duración:</span>
                  <span className="text-foreground/80 font-playfair text-xl">{selectedProduct.duration} minutos</span>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-10 border-t border-black/5 mt-auto gap-8">
                <span className="font-playfair text-5xl text-foreground">{formatPrice(selectedProduct.price)}</span>
                <button 
                  onClick={() => { addItem({ id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, imageUrl: selectedProduct.imageUrl || null }); setSelectedProduct(null); }}
                  disabled={selectedProduct.stock === 0}
                  className="w-full sm:w-auto bg-foreground text-white px-10 py-5 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-gold hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:scale-100"
                >
                  {selectedProduct.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}