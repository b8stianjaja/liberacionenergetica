"use client";

import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Star, ArrowRight, X, Sparkles } from "lucide-react";
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

  if (typeof document !== "undefined") {
    document.body.style.overflow = selectedProduct ? 'hidden' : '';
  }

  const dynamicFilters = useMemo(() => [{ id: 'ALL', label: 'Ver Todo' }, ...categories.map(cat => ({ id: cat.id, label: cat.name }))], [categories]);
  const filteredProducts = useMemo(() => products.filter(product => activeFilter === 'ALL' || product.categoryId === activeFilter || product.type === activeFilter), [products, activeFilter]);
  const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(".hero-title-line", 
      { y: 60, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.5, stagger: 0.15, ease: "power4.out", delay: 0.2 }
    )
    .fromTo(".hero-desc", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, "-=1")
    .fromTo(".hero-img-wrap", 
      { scale: 1.1, opacity: 0, filter: "blur(10px)" }, 
      { scale: 1, opacity: 1, filter: "blur(0px)", duration: 2, ease: "expo.out" }, "-=1.5"
    );

    gsap.to(".float-icon", { y: -10, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.3 });

    const staggerSections = gsap.utils.toArray('.stagger-section');
    staggerSections.forEach((section: any) => {
      gsap.fromTo(section.querySelectorAll('.stagger-card'), 
        { y: 60, opacity: 0 }, 
        { 
          y: 0, opacity: 1, 
          duration: 1.2, 
          stagger: 0.1, 
          ease: "back.out(1.2)", 
          scrollTrigger: { trigger: section, start: "top 85%" } 
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
            <span className="hero-desc text-gold font-bold tracking-[0.2em] uppercase text-[10px] mb-8 flex items-center gap-3">
              <Sparkles size={16} className="float-icon" /> Bienvenida a tu espacio seguro
            </span>
            
            <h1 className="font-playfair text-6xl md:text-7xl lg:text-[5rem] text-foreground leading-[1.1] mb-8">
              <div className="overflow-hidden"><div className="hero-title-line">Sanación</div></div>
              <div className="overflow-hidden"><div className="hero-title-line golden-rainbow-text italic font-light pb-2">energética</div></div>
              <div className="overflow-hidden"><div className="hero-title-line">para el alma.</div></div>
            </h1>
            
            <div className="hero-desc">
              <p className="text-lg text-foreground/70 leading-relaxed mb-10 max-w-md">
                Te acompaño a ti y a tu familia a liberar bloqueos emocionales, restaurando el equilibrio natural desde la raíz con herramientas compasivas.
              </p>
              <div className="flex gap-4">
                <a href="#terapias" className="bg-foreground text-white px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-gold hover:scale-105 hover:shadow-xl hover:shadow-gold/20 transition-all duration-500">
                  Comenzar el viaje
                </a>
              </div>
            </div>
          </div>

          {/* Imagen con Aura "Golden Rainbow" */}
          <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-[70vh]">
            <div className="absolute inset-4 md:inset-8 golden-rainbow-bg rounded-[3rem] blur-2xl opacity-60 float-icon"></div>
            {banners.length > 0 ? (
              <div className="hero-img-wrap absolute inset-0 w-full h-full overflow-hidden shadow-sm border-4 border-white rounded-[3rem] bg-lavender/30">
                <Image src={banners[0].imageUrl} alt="Armonía" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
            ) : (
              <div className="hero-img-wrap absolute inset-0 w-full h-full bg-lavender flex items-center justify-center border-4 border-white rounded-[3rem]">
                <Sparkles className="text-gold float-icon" size={64} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- TERAPIAS --- */}
      <section id="terapias" className="stagger-section w-full bg-white py-32 px-6 shadow-[0_-10px_40px_rgba(56,42,79,0.02)] relative z-10 rounded-t-[3rem] md:rounded-t-[5rem]">
        <div className="max-w-[85rem] mx-auto">
          <div className="stagger-card text-center mb-20">
            <h2 className="font-playfair text-4xl md:text-5xl text-foreground mb-6">Mis Herramientas</h2>
            <p className="text-foreground/60 text-lg md:text-xl max-w-2xl mx-auto">Técnicas nobles diseñadas para sanar en cada etapa de la vida.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Radiestesia', desc: 'Evaluación y armonización del campo electromagnético (Aura y Chakras). Ideal para devolver la vitalidad.' },
              { title: 'Péndulo Hebreo', desc: 'Desprogramación de energías densas y memorias de dolor a través de letras sagradas. Una limpieza profunda.' },
              { title: 'Biodecodificación', desc: 'Encuentra el origen emocional oculto detrás de tus molestias físicas para soltarlas de manera consciente.' }
            ].map((therapy, i) => (
              <div key={i} className="stagger-card group bg-background p-10 md:p-12 rounded-[2.5rem] border border-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-lavender text-foreground flex items-center justify-center rounded-[1.5rem] mb-8 text-3xl group-hover:golden-rainbow-bg group-hover:text-white transition-all duration-500">
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
      <section id="boutique" className="stagger-section w-full py-32 px-6 bg-lavender/30">
        <div className="max-w-[85rem] mx-auto">
          <div className="stagger-card flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
            <h2 className="font-playfair text-4xl md:text-5xl text-foreground">Boutique Holística</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {dynamicFilters.map((filter) => (
                <button
                  key={filter.id} onClick={() => setActiveFilter(filter.id)}
                  className={`px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase btn-transition ${
                    activeFilter === filter.id ? 'bg-foreground text-white shadow-md' : 'bg-white text-foreground/50 border border-transparent hover:border-gold hover:text-foreground'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <article key={product.id} className="stagger-card bg-white rounded-[2.5rem] p-4 shadow-sm border border-transparent hover:border-gold/20 flex flex-col hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
                <div 
                  className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-background mb-6 cursor-pointer border border-white"
                  onClick={() => setSelectedProduct(product)}
                >
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 25vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Sparkles size={40} className="text-gold/30 float-icon" /></div>
                  )}
                  <span className="absolute top-4 left-4 bg-white/95 text-foreground text-[9px] font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
                    {product.type === 'SERVICE' ? 'Terapia' : 'Objeto'}
                  </span>
                </div>
                
                <h3 className="font-playfair text-xl text-foreground mb-2 leading-tight px-2 group-hover:text-gold transition-colors">{product.name}</h3>
                <p className="text-sm text-foreground/60 line-clamp-2 mb-6 flex-grow px-2 font-light">{product.description}</p>
                
                <div className="pt-4 mt-auto flex flex-col gap-3 px-2">
                  <span className="font-playfair text-2xl text-foreground">{formatPrice(product.price)}</span>
                  <button 
                    onClick={() => addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || null })}
                    disabled={product.stock === 0}
                    className="w-full bg-lavender text-foreground hover:bg-gold hover:text-white py-4 rounded-[1rem] text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 btn-transition disabled:opacity-50"
                  >
                    {product.stock === 0 ? 'Agotado' : <>Agregar <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIOS --- */}
      <section id="testimonios" className="stagger-section w-full bg-white py-32 px-6 rounded-b-[3rem] md:rounded-b-[5rem] shadow-[0_10px_40px_rgba(56,42,79,0.02)] relative z-10">
        <div className="max-w-[85rem] mx-auto text-center">
          <div className="stagger-card mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl text-foreground">Experiencias de <span className="golden-rainbow-text">corazón</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              "Gracias a la sesión de péndulo, mi hijo ha vuelto a dormir tranquilo. Johanna tiene una energía maternal y muy cálida que nos dio mucha confianza desde el primer minuto.",
              "Llevaba meses sintiendo un peso en el pecho. La biodecodificación me ayudó a entender el origen. Hoy me siento más ligera, en paz y feliz. Totalmente recomendada.",
              "Una experiencia maravillosa. Su consulta transmite mucha paz y profesionalidad. Me explicó cada paso con paciencia. Un antes y un después en mi bienestar."
            ].map((text, i) => (
              <div key={i} className="stagger-card bg-background p-10 lg:p-12 rounded-[2.5rem] border border-white shadow-sm flex flex-col hover:-translate-y-2 transition-transform duration-500">
                <div className="flex text-gold mb-8">
                  {[...Array(5)].map((_, index) => <Star key={index} size={16} fill="currentColor" className="mr-1" />)}
                </div>
                <p className="text-foreground/70 leading-relaxed italic text-base flex-grow">"{text}"</p>
                <div className="mt-8 pt-6 border-t border-lavender font-playfair text-gold text-lg">
                  Consultante
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL DEL PRODUCTO (Aura Mágica y Amigable) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-md transition-opacity" onClick={() => setSelectedProduct(null)} />
          
          <div className="relative w-full max-w-5xl bg-white rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl z-10 animate-in zoom-in-95 duration-500 ease-out max-h-[90vh] border-4 border-white">
            {/* Aura de fondo en el modal */}
            <div className="absolute -top-40 -right-40 w-96 h-96 golden-rainbow-bg rounded-full blur-3xl opacity-50 pointer-events-none"></div>

            <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/90 shadow-sm flex items-center justify-center rounded-full text-foreground hover:bg-lavender hover:rotate-90 transition-all duration-300">
              <X size={24} strokeWidth={1.5} />
            </button>
            
            <div className="w-full md:w-1/2 relative h-[35vh] md:h-auto bg-lavender/30">
              {selectedProduct.imageUrl && <Image src={selectedProduct.imageUrl} alt={selectedProduct.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />}
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col overflow-y-auto relative z-10">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-4 block">
                {selectedProduct.type === 'SERVICE' ? 'Terapia Presencial / Online' : 'Objeto Sanador'}
              </span>
              <h2 className="font-playfair text-4xl md:text-5xl text-foreground mb-6 leading-tight">{selectedProduct.name}</h2>
              <div className="w-16 h-1 bg-gold rounded-full mb-8"></div>
              
              <p className="text-foreground/70 mb-8 leading-relaxed text-base whitespace-pre-line flex-grow">
                {selectedProduct.description}
              </p>

              {selectedProduct.duration && (
                <div className="bg-lavender/50 p-5 rounded-2xl mb-8 flex items-center gap-4">
                  <span className="text-foreground font-bold uppercase tracking-widest text-[10px]">Duración:</span>
                  <span className="text-foreground/90 font-playfair text-xl">{selectedProduct.duration} minutos</span>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-8 border-t border-black/5 mt-auto gap-6">
                <span className="font-playfair text-4xl text-foreground">{formatPrice(selectedProduct.price)}</span>
                <button 
                  onClick={() => { addItem({ id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, imageUrl: selectedProduct.imageUrl || null }); setSelectedProduct(null); }}
                  disabled={selectedProduct.stock === 0}
                  className="w-full sm:w-auto bg-foreground text-white px-8 py-4 rounded-full text-[11px] font-bold tracking-widest uppercase hover:bg-gold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {selectedProduct.stock === 0 ? 'Agotado' : 'Añadir al carrito'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}