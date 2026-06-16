"use client";

import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ArrowRight, Star, X, Sparkles } from "lucide-react";
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

  const dynamicFilters = useMemo(() => [{ id: 'ALL', label: 'Compendio' }, ...categories.map(cat => ({ id: cat.id, label: cat.name }))], [categories]);
  const filteredProducts = useMemo(() => products.filter(product => activeFilter === 'ALL' || product.categoryId === activeFilter || product.type === activeFilter), [products, activeFilter]);
  const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);

  useGSAP(() => {
    // 1. Efecto "Respiro" (Breathe Reveal) - Altamente premium y relajante
    const tl = gsap.timeline();
    tl.fromTo(".breathe-text", 
      { filter: "blur(12px)", opacity: 0, y: 40, scale: 0.95 }, 
      { filter: "blur(0px)", opacity: 1, y: 0, scale: 1, duration: 2, stagger: 0.15, ease: "expo.out", delay: 0.2 }
    )
    .fromTo(".breathe-img", 
      { opacity: 0, scale: 1.1, filter: "blur(20px)" }, 
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 2.5, ease: "power2.out" }, "-=1.5"
    );

    // 2. Revelado en Scroll (Staggered Cards)
    const sections = gsap.utils.toArray('.awwwards-section');
    sections.forEach((section: any) => {
      gsap.fromTo(section.querySelectorAll('.awwwards-card'), 
        { y: 80, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.5, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: section, start: "top 80%" } }
      );
    });

  }, { scope: container, dependencies: [filteredProducts] });

  return (
    <div ref={container} className="w-full relative">
      
      {/* --- AURA DE FONDO (MAGIA PURA) --- */}
      <div className="absolute top-0 left-0 w-full h-[100vh] overflow-hidden pointer-events-none">
        <div className="energy-blob w-[60vw] h-[60vw] bg-lavender top-[-10%] left-[-10%] mix-blend-multiply"></div>
        <div className="energy-blob w-[40vw] h-[40vw] bg-gold/10 bottom-[20%] right-[-5%] mix-blend-multiply" style={{ animationDelay: '-5s' }}></div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-[100svh] flex flex-col justify-center pt-32 pb-20 px-6 lg:px-12 z-10">
        <div className="max-w-[90rem] mx-auto w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          <div className="w-full lg:w-1/2 flex flex-col">
            <span className="breathe-text text-[10px] font-bold tracking-[0.4em] uppercase text-gold mb-8 block">
              Bienvenida al origen
            </span>
            <h1 className="font-playfair text-[14vw] md:text-[7vw] lg:text-[6.5rem] leading-[0.9] tracking-tighter text-foreground mb-8">
              <div className="breathe-text">Tu energía,</div>
              <div className="breathe-text iridescent-text italic font-light">liberada.</div>
            </h1>
            <p className="breathe-text text-foreground/60 text-lg leading-relaxed max-w-md font-light mb-12">
              Un espacio sagrado para ti y tu familia. A través de la radiestesia y la decodificación, sanamos la raíz emocional para florecer en el presente.
            </p>
          </div>

          <div className="w-full lg:w-1/2 relative h-[55vh] lg:h-[75vh]">
            {banners.length > 0 ? (
              <div className="breathe-img absolute inset-0 w-full h-full rounded-t-full rounded-b-full overflow-hidden shadow-2xl border-[12px] border-white/50">
                <Image src={banners[0].imageUrl} alt="Armonía" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
            ) : (
              <div className="breathe-img absolute inset-0 w-full h-full rounded-t-full rounded-b-full border border-lavender flex items-center justify-center bg-white/50 backdrop-blur-md">
                <Sparkles size={64} className="text-gold/30" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- LA BOUTIQUE (EXPOSICIÓN DE RELIQUIAS) --- */}
      {/* La ponemos de primero o segundo para fomentar la conversión inmediata */}
      <section id="boutique" className="awwwards-section relative w-full py-32 px-6 lg:px-12 z-20">
        <div className="max-w-[90rem] mx-auto">
          
          <div className="awwwards-card flex flex-col md:flex-row justify-between items-end mb-24 gap-8 border-b border-foreground/5 pb-12">
            <div>
              <h2 className="font-playfair text-5xl md:text-7xl tracking-tighter text-foreground mb-4">La Boutique</h2>
              <p className="text-foreground/50 font-light text-lg">Herramientas físicas cargadas de intención vibracional.</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {dynamicFilters.map((filter) => (
                <button
                  key={filter.id} onClick={() => setActiveFilter(filter.id)}
                  className={`px-7 py-3.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-500 ${
                    activeFilter === filter.id ? 'bg-foreground text-white shadow-lg' : 'bg-white text-foreground/50 hover:bg-lavender hover:text-foreground'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grilla Editorial Lujosa */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {filteredProducts.map((product) => (
              <article key={product.id} className="awwwards-card group flex flex-col relative">
                
                {/* Iridescent Glass Container */}
                <div 
                  className="iridescent-border w-full aspect-[4/5] p-3 md:p-4 mb-8 cursor-pointer shadow-sm group-hover:shadow-[0_20px_60px_rgba(212,184,114,0.15)] transition-shadow duration-700"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-background">
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]" sizes="(max-width: 768px) 100vw, 33vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Sparkles size={40} className="text-gold/20" /></div>
                    )}
                    
                    {/* Badge Elegante */}
                    <span className="absolute top-5 left-5 bg-white/90 backdrop-blur-md text-foreground text-[9px] font-bold px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-sm">
                      {product.type === 'SERVICE' ? 'Sanación' : 'Materia'}
                    </span>

                    {/* Overlay y Botón "Ver" oculto en Desktop */}
                    <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <span className="bg-white/90 text-foreground px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold translate-y-4 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100 hidden md:block">
                        Detalles
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Textos y Acción Directa */}
                <div className="px-4 flex flex-col flex-grow">
                  <h3 className="font-playfair text-2xl md:text-3xl text-foreground mb-3 leading-tight">{product.name}</h3>
                  <p className="text-sm text-foreground/50 line-clamp-2 mb-8 font-light flex-grow leading-relaxed">{product.description}</p>
                  
                  <div className="flex items-end justify-between border-t border-black/5 pt-6">
                    <span className="font-playfair text-3xl text-foreground">{formatPrice(product.price)}</span>
                    <button 
                      onClick={() => addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || null })}
                      disabled={product.stock === 0}
                      className="w-14 h-14 bg-foreground text-white rounded-full flex items-center justify-center hover:bg-gold transition-colors duration-500 disabled:opacity-50 group/btn"
                    >
                      {product.stock === 0 ? <X size={20} /> : <ArrowRight size={20} className="group-hover/btn:-rotate-45 transition-transform duration-500" />}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --- TERAPIAS (Cajas amplias y legibles) --- */}
      <section id="terapias" className="awwwards-section relative w-full bg-white py-32 px-6 lg:px-12 rounded-[3rem] md:rounded-[4rem] shadow-[0_-20px_60px_rgba(0,0,0,0.02)] z-10">
        <div className="max-w-[90rem] mx-auto">
          <div className="awwwards-card mb-24 max-w-2xl">
            <h2 className="font-playfair text-5xl md:text-6xl text-foreground mb-6">Mis Caminos</h2>
            <p className="text-foreground/50 text-xl font-light leading-relaxed">Terapias compasivas diseñadas para identificar la raíz de tu malestar y devolverte a tu estado de flujo natural.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { title: 'Radiestesia', desc: 'Diagnóstico energético a través de péndulos para limpiar y alinear tus chakras, devolviendo la vitalidad a tu cuerpo físico y mental.' },
              { title: 'Péndulo Hebreo', desc: 'Terapia milenaria que utiliza la vibración de las letras sagradas para desprogramar energías estancadas y memorias profundas.' },
              { title: 'Biodecodificación', desc: 'Encuentra el origen emocional detrás del síntoma físico. Comprendemos la enfermedad como un programa que puede ser desactivado.' }
            ].map((therapy, i) => (
              <div key={i} className="awwwards-card group bg-background p-10 md:p-14 rounded-[2.5rem] border border-black/5 hover:bg-foreground transition-colors duration-700 flex flex-col justify-between h-full">
                <div className="mb-16">
                  <span className="text-6xl font-playfair text-gold opacity-30 group-hover:opacity-100 transition-opacity duration-700 block mb-8">0{i+1}</span>
                  <h3 className="font-playfair text-3xl text-foreground group-hover:text-white transition-colors duration-700 mb-6">{therapy.title}</h3>
                  <p className="text-foreground/60 group-hover:text-white/70 transition-colors duration-700 font-light leading-relaxed">{therapy.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MODAL DEL PRODUCTO (Zoom Inmersivo y Limpio) --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-md transition-opacity" onClick={() => setSelectedProduct(null)} />
          
          <div className="relative w-full max-w-[75rem] bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl z-10 animate-in zoom-in-95 duration-500 ease-out max-h-[90vh] md:max-h-[85vh]">
            
            <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 z-20 w-14 h-14 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center rounded-full text-foreground hover:bg-gold hover:text-white transition-colors duration-300">
              <X size={24} strokeWidth={1.5} />
            </button>
            
            <div className="w-full md:w-[45%] relative min-h-[40vh] md:min-h-full bg-background p-4 md:p-8">
              <div className="relative w-full h-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
                {selectedProduct.imageUrl && <Image src={selectedProduct.imageUrl} alt={selectedProduct.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 45vw" />}
              </div>
            </div>
            
            <div className="w-full md:w-[55%] p-8 md:p-16 lg:p-20 flex flex-col overflow-y-auto">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-6 block">
                {selectedProduct.type === 'SERVICE' ? 'Reserva de Terapia' : 'Pieza de Colección'}
              </span>
              
              <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-foreground mb-8 leading-[1.1]">{selectedProduct.name}</h2>
              
              <p className="text-foreground/60 mb-10 leading-relaxed text-base md:text-lg whitespace-pre-line flex-grow font-light">
                {selectedProduct.description}
              </p>

              {selectedProduct.duration && (
                <div className="bg-lavender/40 border border-lavender p-6 rounded-2xl mb-12 flex items-center justify-between">
                  <span className="text-foreground font-bold uppercase tracking-[0.2em] text-[10px]">Tiempo Estimado</span>
                  <span className="text-foreground font-playfair text-2xl">{selectedProduct.duration} min</span>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-10 border-t border-black/5 mt-auto gap-8">
                <span className="font-playfair text-5xl text-foreground">{formatPrice(selectedProduct.price)}</span>
                <button 
                  onClick={() => { addItem({ id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, imageUrl: selectedProduct.imageUrl || null }); setSelectedProduct(null); }}
                  disabled={selectedProduct.stock === 0}
                  className="w-full sm:w-auto bg-foreground text-white px-10 py-5 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gold hover:shadow-[0_10px_30px_rgba(212,184,114,0.3)] transition-all duration-500 disabled:opacity-50"
                >
                  {selectedProduct.stock === 0 ? 'Agotado' : 'Adquirir / Reservar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}