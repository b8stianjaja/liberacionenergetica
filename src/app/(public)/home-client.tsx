"use client";

import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Star, MessageCircle, Mail, MapPin, Plus, Quote, Sparkles } from "lucide-react";
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

  const dynamicFilters = useMemo(() => [{ id: 'ALL', label: 'Ver Todo' }, ...categories.map(cat => ({ id: cat.id, label: cat.name }))], [categories]);
  const filteredProducts = useMemo(() => products.filter(product => activeFilter === 'ALL' || product.categoryId === activeFilter || product.type === activeFilter), [products, activeFilter]);
  const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);

  useGSAP(() => {
    // Animaciones Awwwards sutiles y elegantes (Fade-up suave con ligera escala)
    gsap.utils.toArray('.gsap-fade').forEach((el: any) => {
      gsap.fromTo(el, 
        { y: 40, opacity: 0 }, 
        { scrollTrigger: { trigger: el, start: "top 85%" }, y: 0, opacity: 1, duration: 1.2, ease: "power2.out" }
      );
    });

    // Stagger para las tarjetas (aparecen una tras otra suavemente)
    gsap.utils.toArray('.gsap-stagger-container').forEach((container: any) => {
      gsap.fromTo(container.children, 
        { y: 30, opacity: 0 }, 
        { scrollTrigger: { trigger: container, start: "top 80%" }, y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power2.out" }
      );
    });
  }, { scope: container, dependencies: [filteredProducts] });

  return (
    <div ref={container} className="w-full">
      
      {/* 1. SECCIÓN HERO / TESTIMONIOS (Idéntica a la imagen superior) */}
      <section id="testimonios" className="w-full pt-32 pb-24 px-6 relative bg-gradient-to-b from-lavender/40 via-lavender to-background">
        <div className="max-w-[85rem] mx-auto text-center relative z-10">
          
          <div className="gsap-fade mb-16">
            <h1 className="font-playfair text-5xl md:text-6xl text-foreground mb-4">
              Testimonios <br/>
              <span className="italic font-light text-gold">de corazón</span>
              <span className="inline-block ml-2 text-gold">♡</span>
            </h1>
            <div className="heart-divider max-w-xs mx-auto text-gold mb-6"><Star size={12} className="mx-2 fill-gold" /></div>
            <p className="text-foreground/80 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
              Cada testimonio es una historia de transformación<br/>y un recordatorio de que sanar es posible.
            </p>
          </div>

          <div className="gsap-stagger-container grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              "Hola Johana, buenos días. Quiero agradecerte de corazón tu limpieza, hace muchos meses que no sentía esta tranquilidad en mi cabeza y corazón. Estoy tan feliz no siento odio, no siento pena, no siento nada malo solo tranquilidad.",
              "El finde estuve muy cansada fisicamente, pero hoy me levanté como si fuera otra persona, la de antes... la que quería comerse al mundo esa volvió y mi cabeza ya no piensa cosas malas ni negativamente. Te deseo lo mejor de este mundo.",
              "Quiero agradecerte tu limpieza, hace muchos meses que no sentía esta tranquilidad. Estoy tan feliz, no siento odio, no siento pena. Te vuelvo agradecer esta paz que buscaba hace tanto tiempo. 💜"
            ].map((text, i) => (
              <div key={i} className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-black/5 flex flex-col relative mt-6">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-foreground rounded-full flex items-center justify-center text-white shadow-md">
                  <Quote size={20} fill="currentColor" />
                </div>
                <div className="flex text-gold mt-2 mb-6">
                  {[...Array(5)].map((_, index) => <Star key={index} size={14} fill="currentColor" className="mr-1" />)}
                </div>
                <p className="text-foreground/80 leading-relaxed text-sm flex-grow">
                  "{text}"
                </p>
                <div className="mt-6 text-center text-foreground">💜</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ilustraciones flotantes sutiles (Si tienes las imágenes, puedes reemplazar estos div por <Image />) */}
        <div className="absolute top-20 left-10 opacity-20 hidden lg:block"><Sparkles size={40} className="text-gold" /></div>
        <div className="absolute bottom-20 right-10 opacity-20 hidden lg:block"><Sparkles size={60} className="text-foreground" /></div>
      </section>

      {/* 2. SECCIÓN TERAPIAS E IMÁGENES INSPIRADORAS */}
      <section id="terapias" className="w-full py-20 px-6">
        <div className="max-w-[85rem] mx-auto flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Imágenes Placeholder de tu diseño (Collar de amatista, vela) */}
          <div className="w-full lg:w-1/2 flex gap-4 h-[500px] gsap-fade">
            <div className="w-1/2 h-full bg-lavender/50 rounded-3xl overflow-hidden relative border border-foreground/5 flex items-center justify-center flex-col">
               <span className="text-foreground/30 text-sm mb-2">[Imagen: Amatista]</span>
               <Image src="/placeholder-amatista.jpg" alt="Amatista" fill className="object-cover opacity-0" />
            </div>
            <div className="w-1/2 h-full flex flex-col gap-4">
              <div className="w-full h-1/2 bg-gold/10 rounded-3xl overflow-hidden relative border border-foreground/5 flex items-center justify-center flex-col">
                <span className="text-foreground/30 text-sm">[Imagen: Vela Lavanda]</span>
                <Image src="/placeholder-vela.jpg" alt="Vela" fill className="object-cover opacity-0" />
              </div>
              <div className="w-full h-1/2 bg-foreground/5 rounded-3xl overflow-hidden relative border border-foreground/5 flex items-center justify-center flex-col">
                <span className="text-foreground/30 text-sm">[Imagen: Flores]</span>
                <Image src="/placeholder-flores.jpg" alt="Flores" fill className="object-cover opacity-0" />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 text-center lg:text-left gsap-fade">
            <h2 className="font-playfair text-4xl md:text-5xl text-foreground mb-2">Acompaño tu proceso</h2>
            <h3 className="font-playfair text-3xl md:text-4xl italic text-gold font-light mb-6">de transformación</h3>
            <div className="heart-divider max-w-[200px] mx-auto lg:mx-0 mb-8"><Sparkles size={16} className="mx-2 text-gold" /></div>
            
            <p className="text-foreground/80 leading-relaxed mb-12 max-w-lg mx-auto lg:mx-0">
              A través de la Radiestesia, la Biodecodificación Emocional, el Péndulo Hebreo, la Cruz de Ankh y las Esencias de Bach, te brindo herramientas poderosas para liberar bloqueos emocionales, recuperar tu bienestar y reconectar con tu verdadera esencia.
            </p>

            {/* Iconos de terapias alineados como en tu imagen */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8">
              {[
                { name: 'Radiestesia', icon: '✨' },
                { name: 'Péndulo Hebreo', icon: '⚱️' },
                { name: 'Cruz de Ankh', icon: '☥' },
                { name: 'Esencias de Bach', icon: '💧' },
                { name: 'Biodecodificación Emocional', icon: '🧠' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-3 w-20">
                  <div className="text-3xl text-foreground">{item.icon}</div>
                  <span className="text-[10px] text-foreground text-center font-medium leading-tight">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. LA BOUTIQUE (Adaptada al estilo de tus tarjetas) */}
      <section id="boutique" className="w-full py-24 px-6 bg-lavender/20 border-y border-foreground/5">
        <div className="max-w-[85rem] mx-auto">
          <div className="text-center mb-16 gsap-fade">
            <h2 className="font-playfair text-4xl md:text-5xl text-foreground mb-4">Boutique & Terapias</h2>
            <div className="heart-divider max-w-xs mx-auto text-gold mb-8"><Star size={12} className="mx-2 fill-gold" /></div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {dynamicFilters.map((filter) => (
                <button
                  key={filter.id} onClick={() => setActiveFilter(filter.id)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-colors ${
                    activeFilter === filter.id ? 'bg-foreground text-white' : 'bg-white text-foreground/60 border border-foreground/10 hover:border-gold hover:text-foreground'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="gsap-stagger-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <article key={product.id} className="bg-white rounded-[2rem] p-5 shadow-sm border border-black/5 flex flex-col group hover:shadow-md transition-shadow">
                
                {/* Imagen del Producto */}
                <div className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-background mb-5">
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 25vw" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-foreground/30 text-sm">
                      <Sparkles size={24} className="mb-2" />
                      [Foto de Producto]
                    </div>
                  )}
                </div>
                
                {/* Detalles y CTA */}
                <div className="flex flex-col flex-grow px-1">
                  <h3 className="font-playfair text-xl text-foreground mb-1 leading-tight">{product.name}</h3>
                  <span className="text-[10px] uppercase tracking-widest text-gold mb-3 font-bold">
                    {product.type === 'SERVICE' ? 'Terapia' : 'Producto'}
                  </span>
                  <p className="text-sm text-foreground/70 line-clamp-2 mb-6 flex-grow">{product.description}</p>
                  
                  <div className="flex items-center justify-between border-t border-foreground/5 pt-4">
                    <span className="font-playfair text-2xl text-foreground">{formatPrice(product.price)}</span>
                    <button 
                      onClick={() => addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || null })}
                      disabled={product.stock === 0}
                      className="bg-lavender text-foreground hover:bg-gold hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                      title="Agregar al carrito"
                    >
                      <Plus size={20} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN CONTACTO (Idéntica a la imagen inferior derecha) */}
      <section id="contacto" className="w-full py-24 px-6 bg-background">
        <div className="max-w-[85rem] mx-auto flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="w-full lg:w-1/2 text-center lg:text-left gsap-fade">
            <h2 className="font-playfair text-4xl md:text-5xl text-foreground mb-2">Estoy aquí para ti ♡</h2>
            <h3 className="font-playfair text-3xl md:text-4xl italic text-gold font-light mb-6">— Agenda tu sesión <MessageCircle className="inline-block" size={28}/></h3>
            <p className="text-foreground/80 mb-12 font-medium">Será un honor acompañarte en tu camino.</p>
            
            <div className="flex flex-col gap-8 max-w-sm mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-lavender flex items-center justify-center text-foreground">
                  <MapPin size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-bold text-foreground">Modalidad</p>
                  <p className="text-foreground/70 text-sm">Online / Presencial</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-lavender flex items-center justify-center text-foreground">
                  <MessageCircle size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-bold text-foreground">WhatsApp</p>
                  <p className="text-foreground/70 text-sm">+56 9 XXXX XXXX</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-lavender flex items-center justify-center text-foreground">
                  <Mail size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-bold text-foreground">Email</p>
                  <p className="text-foreground/70 text-sm">contacto@liberacionenergetica.cl</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center gsap-fade">
             {/* Imagen Placeholder Vela (Derecha inferior de tu boceto) */}
             <div className="relative w-full max-w-md aspect-square bg-gold/10 rounded-full border-8 border-white shadow-xl flex flex-col items-center justify-center overflow-hidden">
                <span className="text-foreground/30 z-10">[Imagen Redonda: Vela/Meditación]</span>
                <Image src="/placeholder-meditacion.jpg" alt="Meditacion" fill className="object-cover opacity-0" />
             </div>
          </div>

        </div>
      </section>

    </div>
  );
}