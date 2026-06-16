"use client";

import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Star, ArrowRight, HeartHandshake, X } from "lucide-react";
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

  const dynamicFilters = useMemo(() => [{ id: 'ALL', label: 'Ver Todo' }, ...categories.map(cat => ({ id: cat.id, label: cat.name }))], [categories]);
  const filteredProducts = useMemo(() => products.filter(product => activeFilter === 'ALL' || product.categoryId === activeFilter || product.type === activeFilter), [products, activeFilter]);
  const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);

  useGSAP(() => {
    // Animación muy suave y respetuosa
    const fadeElements = gsap.utils.toArray('.fade-up');
    fadeElements.forEach((el: any) => {
      gsap.fromTo(el, 
        { y: 30, opacity: 0 }, 
        { scrollTrigger: { trigger: el, start: "top 85%" }, y: 0, opacity: 1, duration: 1, ease: "power2.out" }
      );
    });
  }, { scope: container });

  return (
    <div ref={container} className="w-full">
      
      {/* --- HERO SECTION --- */}
      <section className="w-full pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-[85rem] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2 flex flex-col fade-up">
            <span className="text-gold font-bold tracking-widest uppercase text-xs mb-6 flex items-center gap-2">
              <HeartHandshake size={16} /> Bienvenida a tu espacio seguro
            </span>
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight mb-8">
              Sanación <br/>
              <span className="italic text-gold font-light">energética</span> para el alma.
            </h1>
            <p className="text-lg text-foreground/70 leading-relaxed mb-10 max-w-lg">
              Te acompaño a ti y a tu familia a liberar bloqueos emocionales, restaurando el equilibrio natural desde la raíz con herramientas compasivas y efectivas.
            </p>
            <div className="flex gap-4">
              <a href="#terapias" className="bg-foreground text-white px-8 py-4 rounded-full text-sm font-bold tracking-wider hover:bg-gold btn-transition">
                Conocer Terapias
              </a>
            </div>
          </div>

          {/* Imagen Cálida y Armoniosa */}
          {banners.length > 0 && (
            <div className="w-full lg:w-1/2 fade-up">
              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-lg border-4 border-white">
                <Image src={banners[0].imageUrl} alt="Armonía" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --- TERAPIAS --- */}
      <section id="terapias" className="w-full bg-white py-24 px-6 border-y border-foreground/5">
        <div className="max-w-[85rem] mx-auto">
          <div className="text-center mb-16 fade-up">
            <h2 className="font-playfair text-4xl md:text-5xl text-foreground mb-4">Mis Herramientas</h2>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">Técnicas nobles y adaptables para cada etapa de la vida.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Radiestesia', desc: 'Evaluación y armonización del campo electromagnético (Aura y Chakras). Ideal para devolver la vitalidad.' },
              { title: 'Péndulo Hebreo', desc: 'Desprogramación de energías densas y memorias de dolor a través de letras sagradas. Una limpieza profunda y liberadora.' },
              { title: 'Biodecodificación', desc: 'Encuentra el origen emocional oculto detrás de tus molestias físicas para soltarlas de manera consciente.' }
            ].map((therapy, i) => (
              <div key={i} className="bg-background p-10 rounded-[2rem] shadow-sm border border-black/5 hover:shadow-md btn-transition fade-up">
                <div className="w-14 h-14 bg-lavender text-foreground flex items-center justify-center rounded-2xl mb-6 text-2xl">✨</div>
                <h3 className="font-playfair text-2xl text-foreground mb-4">{therapy.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{therapy.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BOUTIQUE (Directa, Clara y Accesible) --- */}
      <section id="boutique" className="w-full py-24 px-6">
        <div className="max-w-[85rem] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 fade-up">
            <h2 className="font-playfair text-4xl md:text-5xl text-foreground">Boutique Holística</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {dynamicFilters.map((filter) => (
                <button
                  key={filter.id} onClick={() => setActiveFilter(filter.id)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase btn-transition ${
                    activeFilter === filter.id ? 'bg-foreground text-white' : 'bg-white text-foreground/60 border border-foreground/10 hover:border-gold hover:text-foreground'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <article key={product.id} className="bg-white rounded-[2rem] p-5 shadow-sm border border-foreground/5 flex flex-col fade-up">
                {/* Imagen del Producto */}
                <div 
                  className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-background mb-5 cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 25vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gold/30"><Star size={32} /></div>
                  )}
                  <span className="absolute top-3 left-3 bg-white/95 text-foreground text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                    {product.type === 'SERVICE' ? 'Terapia' : 'Objeto'}
                  </span>
                </div>
                
                {/* Textos Claros */}
                <h3 className="font-playfair text-xl text-foreground mb-2 leading-tight">{product.name}</h3>
                <p className="text-sm text-foreground/60 line-clamp-2 mb-6 flex-grow">{product.description}</p>
                
                {/* Acción de Compra Explícita (No oculta) */}
                <div className="pt-4 border-t border-foreground/5 mt-auto flex flex-col gap-4">
                  <span className="font-playfair text-2xl text-foreground font-medium">{formatPrice(product.price)}</span>
                  <button 
                    onClick={() => addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || null })}
                    disabled={product.stock === 0}
                    className="w-full bg-lavender text-foreground hover:bg-gold hover:text-white py-3 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2 btn-transition disabled:opacity-50"
                  >
                    {product.stock === 0 ? 'Agotado' : <>Agregar <ArrowRight size={16} /></>}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIOS (Calidez y Prueba Social) --- */}
      <section id="testimonios" className="w-full bg-lavender/30 py-24 px-6">
        <div className="max-w-[85rem] mx-auto text-center fade-up">
          <h2 className="font-playfair text-4xl md:text-5xl text-foreground mb-16">Experiencias de corazón</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              "Gracias a la sesión de péndulo, mi hijo ha vuelto a dormir tranquilo. Johanna tiene una energía maternal y muy cálida que nos dio mucha confianza desde el primer minuto.",
              "Llevaba meses sintiendo un peso en el pecho. La biodecodificación me ayudó a entender el origen. Hoy me siento más ligera, en paz y feliz. Totalmente recomendada.",
              "Una experiencia maravillosa. Su consulta transmite mucha paz y profesionalidad. Me explicó cada paso con mucha paciencia. Un antes y un después en mi bienestar."
            ].map((text, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm flex flex-col">
                <div className="flex text-gold mb-6">
                  {[...Array(5)].map((_, index) => <Star key={index} size={16} fill="currentColor" className="mr-1" />)}
                </div>
                <p className="text-foreground/70 leading-relaxed italic text-base flex-grow">"{text}"</p>
                <div className="mt-8 pt-6 border-t border-background font-playfair text-gold text-lg">
                  Consultante
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL DEL PRODUCTO (Detalle Claro) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-5xl bg-white rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl z-10 max-h-[90vh]">
            {/* Botón de cerrar grande y claro */}
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-20 w-12 h-12 bg-white/90 border border-foreground/10 flex items-center justify-center rounded-full text-foreground hover:bg-background btn-transition shadow-sm">
              <X size={24} strokeWidth={2} />
            </button>
            
            <div className="w-full md:w-1/2 relative h-[35vh] md:h-auto bg-background">
              {selectedProduct.imageUrl && <Image src={selectedProduct.imageUrl} alt={selectedProduct.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />}
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col overflow-y-auto">
              <h2 className="font-playfair text-3xl md:text-4xl text-foreground mb-4">{selectedProduct.name}</h2>
              <div className="w-16 h-1 bg-gold rounded-full mb-6"></div>
              
              <p className="text-foreground/70 mb-8 leading-relaxed text-base whitespace-pre-line flex-grow">
                {selectedProduct.description}
              </p>

              {selectedProduct.duration && (
                <div className="bg-lavender/50 p-4 rounded-xl mb-8 flex items-center gap-3">
                  <span className="text-foreground font-bold">Duración estimada:</span>
                  <span className="text-foreground/80">{selectedProduct.duration} minutos</span>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-8 border-t border-black/5 mt-auto gap-6">
                <span className="font-playfair text-4xl text-foreground">{formatPrice(selectedProduct.price)}</span>
                <button 
                  onClick={() => { addItem({ id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, imageUrl: selectedProduct.imageUrl || null }); setSelectedProduct(null); }}
                  disabled={selectedProduct.stock === 0}
                  className="w-full sm:w-auto bg-foreground text-white px-8 py-4 rounded-xl text-sm font-bold tracking-wider hover:bg-gold btn-transition disabled:opacity-50"
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