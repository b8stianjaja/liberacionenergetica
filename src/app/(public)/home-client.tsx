"use client";

import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Star, MessageCircle, Mail, MapPin, Plus, Sparkles, Heart } from "lucide-react";
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

  const dynamicFilters = useMemo(() => [{ id: 'ALL', label: 'Compendio' }, ...categories.map(cat => ({ id: cat.id, label: cat.name }))], [categories]);
  const filteredProducts = useMemo(() => products.filter(product => activeFilter === 'ALL' || product.categoryId === activeFilter || product.type === activeFilter), [products, activeFilter]);
  const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);

  useGSAP(() => {
    // Animación de entrada emocional (muy suave)
    gsap.fromTo(".fade-in-slow", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 1.5, stagger: 0.2, ease: "power2.out" }
    );

    // Aparición organizada al hacer scroll
    gsap.utils.toArray('.scroll-section').forEach((section: any) => {
      gsap.fromTo(section, 
        { opacity: 0, y: 40 }, 
        { scrollTrigger: { trigger: section, start: "top 85%" }, opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }
      );
    });

    // Animación continua y sutil para la lavanda de fondo
    gsap.to(".float-lavender", {
      y: -15, rotation: 2, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1
    });

  }, { scope: container, dependencies: [filteredProducts] });

  return (
    <div ref={container} className="w-full relative bg-background overflow-hidden">
      
      {/* 
        ========================================================================
        PLACEHOLDER: FONDO DE LAVANDA (HERO)
        Instrucciones: 
        - Reemplaza el src "/lavanda-bg.png" por tu imagen real.
        - Debe ser un PNG con fondo transparente.
        - Colores sugeridos: Tonos acuarela, baja opacidad (el CSS ya aplica opacity-30).
        - Posición: Está anclado a la derecha, para abrazar el texto que está a la izquierda.
        ========================================================================
      */}
      <div className="absolute top-0 right-0 w-[80vw] md:w-[50vw] h-[100vh] pointer-events-none z-0 opacity-30 float-lavender">
        <Image src="/lavanda-bg.png" alt="Lavanda Decorativa" fill className="object-contain object-right-top" />
      </div>

      {/* --- 1. EL RESPIRO (HERO SECTION) --- */}
      <section className="relative w-full min-h-[90svh] flex flex-col justify-center px-6 lg:px-12 z-10 pt-20">
        <div className="max-w-[85rem] mx-auto w-full flex flex-col lg:flex-row items-center gap-12">
          
          <div className="w-full lg:w-3/5 flex flex-col">
            <div className="fade-in-slow flex items-center gap-3 text-gold mb-6">
              <Heart size={16} className="fill-gold/20" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Un espacio de contención</span>
            </div>
            
            <h1 className="fade-in-slow font-playfair text-5xl md:text-6xl lg:text-[5rem] text-foreground leading-[1.1] mb-8">
              Sanar es recordar <br />
              <span className="text-gold italic font-light">quién eres en esencia.</span>
            </h1>
            
            <p className="fade-in-slow text-foreground/70 text-base md:text-lg leading-relaxed max-w-lg mb-10">
              A través de la radiestesia y la biodecodificación, te acompaño a ti y a tu familia a liberar memorias de dolor y restaurar la paz mental. Un proceso profundo, guiado con amor y respeto.
            </p>
            
            <div className="fade-in-slow flex items-center gap-6">
              <a href="#contacto" className="bg-foreground text-white px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-gold transition-colors duration-300 shadow-sm">
                Inicia tu proceso
              </a>
            </div>
          </div>

          <div className="w-full lg:w-2/5 flex justify-center lg:justify-end">
            {/* 
              ========================================================================
              PLACEHOLDER: FOTO DE JOHANNA / ARMONÍA (HERO)
              Instrucciones: 
              - Reemplaza src. 
              - Idealmente una foto de Johanna sonriendo en su espacio de terapia, 
                o elementos que transmitan mucha paz (velas, cuarzos) en tonos cálidos.
              - Formato vertical (aspect-[4/5]).
              ========================================================================
            */}
            <div className="fade-in-slow relative w-full max-w-sm aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg border-4 border-white bg-lavender/30">
              {banners.length > 0 ? (
                <Image src={banners[0].imageUrl} alt="Bienvenida" fill priority className="object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-foreground/40 text-sm text-center px-4">
                  <Sparkles size={32} className="mb-2 text-gold" />
                  <span>[Foto Principal]<br/>(Retrato o Ambiente)</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* --- 2. VALIDACIÓN EMOCIONAL (TESTIMONIOS) --- */}
      {/* Colocado aquí porque, tras la promesa del Hero, el usuario necesita pruebas reales para confiar. */}
      <section id="testimonios" className="scroll-section w-full bg-lavender/40 py-24 px-6 border-y border-foreground/5">
        <div className="max-w-[85rem] mx-auto text-center">
          
          <h2 className="font-playfair text-4xl md:text-5xl text-foreground mb-4">Testimonios <span className="italic text-gold">de corazón</span></h2>
          <div className="heart-divider max-w-[200px] mx-auto text-gold mb-16"><Heart size={14} className="mx-2 fill-gold/20" /></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              "Hola Johana, buenos días. Quiero agradecerte de corazón tu limpieza, hace muchos meses que no sentía esta tranquilidad en mi cabeza y corazón. Estoy tan feliz no siento odio, no siento pena, no siento nada malo solo tranquilidad.",
              "El finde estuve muy cansada fisicamente, pero hoy me levanté como si fuera otra persona, la de antes... la que quería comerse al mundo esa volvió y mi cabeza ya no piensa cosas malas ni negativamente.",
              "Quiero agradecerte tu limpieza, hace muchos meses que no sentía esta tranquilidad. Estoy tan feliz, no siento odio, no siento pena. Te vuelvo agradecer esta paz que buscaba hace tanto tiempo. 💜"
            ].map((text, i) => (
              <div key={i} className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-white flex flex-col relative">
                <div className="flex text-gold mb-6">
                  {[...Array(5)].map((_, index) => <Star key={index} size={14} fill="currentColor" className="mr-1" />)}
                </div>
                <p className="text-foreground/80 leading-relaxed text-sm md:text-base flex-grow font-light">"{text}"</p>
                <div className="mt-8 text-center text-foreground/40 text-2xl font-serif">"</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 3. LAS HERRAMIENTAS (TERAPIAS) --- */}
      <section id="terapias" className="scroll-section w-full py-24 px-6 bg-background">
        <div className="max-w-[85rem] mx-auto flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            {/* 
              ========================================================================
              PLACEHOLDER: FOTOS DE TERAPIA (GRID)
              Instrucciones: 
              - 3 imágenes que ilustren el proceso (ej: Péndulo, Esencias de Bach, Manos).
              - Mantienen una estética unificada (luz natural, tonos suaves).
              ========================================================================
            */}
            <div className="relative w-full aspect-square rounded-[2rem] bg-lavender/50 overflow-hidden">
               <Image src="/terapia-1.jpg" alt="Detalle Terapia" fill className="object-cover opacity-50" />
               <span className="absolute inset-0 flex items-center justify-center text-xs text-foreground/50">[Péndulo Hebreo]</span>
            </div>
          </div>

          <div className="w-full lg:w-2/3">
            <h2 className="font-playfair text-4xl md:text-5xl text-foreground mb-4">Acompaño tu proceso</h2>
            <h3 className="font-playfair text-2xl md:text-3xl italic text-gold font-light mb-8">de transformación integral</h3>
            
            <p className="text-foreground/70 leading-relaxed mb-12 max-w-2xl">
              Mediante herramientas profundamente respetuosas, abordamos las capas conscientes e inconscientes de tu ser. Ideal para adultos que buscan respuestas y para armonizar la energía de los niños en el hogar.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: 'Radiestesia', icon: '✨', desc: 'Diagnóstico y limpieza del campo electromagnético.' },
                { name: 'Péndulo Hebreo', icon: '⚱️', desc: 'Desprogramación de memorias de dolor con alta vibración.' },
                { name: 'Cruz de Ankh', icon: '☥', desc: 'Restauración profunda de la vitalidad física.' },
                { name: 'Biodecodificación', icon: '🧠', desc: 'Comprende el origen emocional detrás del síntoma físico.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 bg-lavender/50 rounded-xl flex items-center justify-center text-xl text-foreground">{item.icon}</div>
                  <div>
                    <h4 className="font-playfair text-lg text-foreground font-bold mb-1">{item.name}</h4>
                    <p className="text-sm text-foreground/60 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* --- 4. LA BOUTIQUE (COMPENDIO ORDENADO) --- */}
      <section id="boutique" className="scroll-section w-full py-24 px-6 bg-lavender/20 border-y border-foreground/5">
        <div className="max-w-[85rem] mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <div>
              <h2 className="font-playfair text-4xl md:text-5xl text-foreground mb-2">Boutique & Agenda</h2>
              <p className="text-foreground/60">Reserva tu hora o adquiere herramientas para tu altar personal.</p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-2">
              {dynamicFilters.map((filter) => (
                <button
                  key={filter.id} onClick={() => setActiveFilter(filter.id)}
                  className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors border ${
                    activeFilter === filter.id ? 'bg-foreground text-white border-foreground' : 'bg-white text-foreground/60 border-foreground/10 hover:border-gold hover:text-foreground'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <article key={product.id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-foreground/5 flex flex-col group hover:shadow-md transition-shadow">
                
                {/* 
                  ========================================================================
                  PLACEHOLDER: FOTOS DE LA BOUTIQUE
                  Instrucciones: 
                  - Se alimentan de la base de datos (Cloudinary).
                  - Asegúrate de subir fotos cuadradas o verticales con buena luz.
                  ========================================================================
                */}
                <div className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-background mb-4">
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 25vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gold/30 bg-lavender/20">
                      <Sparkles size={32} />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-foreground text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                    {product.type === 'SERVICE' ? 'Terapia' : 'Materia'}
                  </span>
                </div>
                
                <h3 className="font-playfair text-xl text-foreground mb-2 leading-tight px-2">{product.name}</h3>
                <p className="text-xs text-foreground/60 line-clamp-2 mb-6 flex-grow px-2">{product.description}</p>
                
                <div className="flex items-center justify-between border-t border-black/5 pt-4 px-2 mt-auto">
                  <span className="font-playfair text-xl text-foreground font-medium">{formatPrice(product.price)}</span>
                  <button 
                    onClick={() => addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || null })}
                    disabled={product.stock === 0}
                    className="w-10 h-10 bg-lavender text-foreground rounded-full flex items-center justify-center hover:bg-gold hover:text-white transition-colors disabled:opacity-50"
                    title="Añadir a la selección"
                  >
                    <Plus size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --- 5. CONTACTO Y CIERRE --- */}
      <section id="contacto" className="scroll-section w-full py-24 px-6 bg-background">
        <div className="max-w-[85rem] mx-auto flex flex-col md:flex-row gap-16 items-center bg-white p-8 md:p-16 rounded-[3rem] shadow-sm border border-foreground/5">
          
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="font-playfair text-4xl md:text-5xl text-foreground mb-4">Estoy aquí para ti <span className="text-gold">♡</span></h2>
            <p className="text-foreground/70 mb-12 font-medium">Será un honor acompañarte en tu camino de sanación.</p>
            
            <div className="flex flex-col gap-8 max-w-sm mx-auto md:mx-0 text-left">
              {[
                { icon: MapPin, title: 'Modalidad', text: 'Online / Presencial' },
                { icon: MessageCircle, title: 'WhatsApp', text: '+56 9 XXXX XXXX' },
                { icon: Mail, title: 'Email', text: 'contacto@liberacionenergetica.cl' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-lavender flex items-center justify-center text-foreground shrink-0">
                    <item.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm uppercase tracking-widest">{item.title}</p>
                    <p className="text-foreground/70">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
             {/* 
               ========================================================================
               PLACEHOLDER: IMAGEN CIRCULAR (Vela/Altar)
               Instrucciones: 
               - Una foto cuadrada recortada en círculo (el CSS rounded-full lo hace automático).
               - Referencia: Como la vela en la esquina inferior derecha de tu boceto.
               ========================================================================
             */}
             <div className="relative w-full max-w-sm aspect-square bg-lavender/30 rounded-full border-[12px] border-white shadow-xl flex flex-col items-center justify-center overflow-hidden">
                <Image src="/contacto-vela.jpg" alt="Vela de Contacto" fill className="object-cover opacity-50" />
                <span className="text-foreground/50 text-sm z-10 text-center px-4">[Vela o Elemento<br/>de Altar en formato Cuadrado]</span>
             </div>
          </div>

        </div>
      </section>

    </div>
  );
}