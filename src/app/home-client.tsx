"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Cormorant_Garamond, Montserrat } from "next/font/google";

// 1. Tipografías Armonizadas
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap"
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap"
});

gsap.registerPlugin(useGSAP);

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  duration: number | null;
  stock: number;
  imageUrl?: string | null;
};

export default function HomeClient({ products }: { products: Product[] }) {
  const container = useRef<HTMLDivElement>(null);

  // Bloqueamos el scroll del body temporalmente mientras está el loader
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Liberamos el scroll cuando el loader desaparece
        document.body.style.overflow = "unset";
      }
    });

    // 1. Sintonizando Energía (Entrada suave, lectura, y desvanecimiento)
    tl.to(".loader-content", { opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power2.out" })
      .to(".loader-content", { opacity: 0, y: -15, filter: "blur(8px)", duration: 0.8, delay: 0.8, ease: "power2.in" })
      
    // 2. Telón levantándose
      .to(".loader-screen", { yPercent: -100, duration: 1.4, ease: "expo.inOut" })

    // 3. Cabecera de la tienda emerge
      .fromTo(".store-header",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
        "-=0.9" // Se superpone perfectamente con el telón
      )

    // 4. Cascada de productos
      .fromTo(".store-card",
        { opacity: 0, y: 50, scale: 0.96 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.9, 
          stagger: 0.12, 
          ease: "back.out(1.1)",
          // clearProps elimina los estilos en línea al terminar para que Tailwind :hover funcione
          clearProps: "all" 
        },
        "-=0.9"
      );

    // 5. Ambientación Mágica Perpetua
    gsap.to(".rainbow-blob", {
      rotation: 360,
      scale: 1.15,
      duration: 35, // Muy lento para que no maree
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: -4,
    });

  }, { scope: container });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div ref={container} className={`relative min-h-screen bg-[#FAFAFA] text-gray-900 overflow-x-hidden ${montserrat.className}`}>
      
      {/* ================= LOADING SCREEN CINEMATOGRÁFICA ================= */}
      <div className="loader-screen fixed inset-0 z-[100] bg-[#FCFBF9] flex items-center justify-center pointer-events-none">
        <div className="loader-content flex flex-col items-center gap-6 opacity-0 blur-[10px] translate-y-4">
          <div className="relative flex items-center justify-center">
            {/* Brillo detrás de la estrella */}
            <div className="absolute inset-0 bg-purple-300 blur-xl opacity-50 rounded-full animate-pulse"></div>
            <SparkleStarIcon className="relative w-10 h-10 text-purple-500 animate-spin-slow" />
          </div>
          <h2 className={`text-3xl md:text-5xl text-indigo-950 font-medium tracking-tight ${cormorant.className}`}>
            Sintonizando energía...
          </h2>
        </div>
      </div>

      {/* ================= FONDO ARCOÍRIS SUTIL ================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-multiply opacity-50">
        <div className="rainbow-blob absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-rose-300 to-amber-200 blur-[120px] opacity-70" />
        <div className="rainbow-blob absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-bl from-cyan-300 via-indigo-300 to-purple-300 blur-[140px] opacity-60" />
        <div className="rainbow-blob absolute top-[30%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-emerald-200/60 to-teal-200/60 blur-[100px] opacity-50" />
      </div>
      <div className="fixed inset-0 bg-white/70 backdrop-blur-[80px] pointer-events-none z-0"></div>

      {/* ================= CONTENIDO DE LA TIENDA ================= */}
      <div className="relative z-10 max-w-[96rem] mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-24 flex flex-col min-h-screen">
        
        {/* CABECERA EDITORIAL (Removido opacity-0 de las clases) */}
        <header className="store-header flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-purple-200/60 bg-white/40 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-8">
            <SparkleStarIcon className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-purple-900">Catálogo</span>
          </div>
          
          <h1 className={`text-5xl md:text-7xl font-medium text-gray-900 mb-6 tracking-tight ${cormorant.className}`}>
            Liberación{' '}
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-teal-500 to-indigo-500">
              Energética
            </span>
          </h1>
          <p className="text-gray-500 font-light max-w-2xl text-base md:text-xl leading-relaxed">
            Explora las terapias y herramientas dispuestas para restaurar tu armonía interior y elevar tu vibración.
          </p>
        </header>

        {/* CUADRÍCULA BOUTIQUE */}
        {products.length === 0 ? (
          // (Removido opacity-0 del estado vacío)
          <div className="store-card text-center py-20 flex-1 flex flex-col items-center justify-center">
            <p className={`text-3xl text-gray-400 italic ${cormorant.className}`}>El universo está preparando algo hermoso...</p>
          </div>
        ) : (
          <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
            {products.map((product) => (
              // (Removido opacity-0 de los artículos de la tienda)
              <article 
                key={product.id} 
                className="store-card group relative bg-white/80 backdrop-blur-2xl border border-white/90 rounded-[2.5rem] p-5 flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_rgba(168,85,247,0.08)] hover:-translate-y-2 transition-all duration-500"
              >
                {/* CONTENEDOR DE IMAGEN */}
                <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-50 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-60"></div>
                  
                  {/* Badges Flotantes */}
                  <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
                    <span className={`px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full shadow-sm backdrop-blur-md border ${
                      product.type === 'SERVICE' ? 'bg-purple-50/90 text-purple-800 border-purple-200/50' : 
                      product.type === 'PHYSICAL' ? 'bg-orange-50/90 text-orange-800 border-orange-200/50' : 
                      'bg-blue-50/90 text-blue-800 border-blue-200/50'
                    }`}>
                      {product.type === 'SERVICE' ? 'Terapia' : product.type === 'PHYSICAL' ? 'Físico' : 'Digital'}
                    </span>
                  </div>

                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rose-50 via-purple-50 to-teal-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                      <SparkleStarIcon className="w-12 h-12 text-purple-200" />
                    </div>
                  )}
                </div>

                {/* CONTENIDO TEXTUAL */}
                <div className="flex flex-col flex-1 px-3 pb-3">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h2 className={`text-2xl lg:text-3xl font-medium text-gray-900 leading-tight group-hover:text-purple-700 transition-colors ${cormorant.className}`}>
                      {product.name}
                    </h2>
                    {product.duration && (
                      <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1.5 whitespace-nowrap mt-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
                        <ClockIcon className="w-3.5 h-3.5" /> {product.duration}m
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 font-light line-clamp-2 mb-8 flex-1 leading-relaxed">
                    {product.description}
                  </p>
                  
                  {/* PRECIO Y BOTÓN PÍLDORA */}
                  <div className="flex items-center justify-between mt-auto">
                    <p className={`text-3xl text-gray-900 font-medium tracking-tight ${cormorant.className}`}>
                      {formatPrice(product.price)}
                    </p>
                    
                    <button className={`group/btn relative overflow-hidden h-12 rounded-full flex items-center justify-center transition-all duration-500 ease-out border ${
                      product.type === 'PHYSICAL' && product.stock === 0 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-transparent w-12'
                        : 'bg-gray-900 text-white border-transparent w-12 hover:w-[130px] hover:shadow-[0_10px_20px_rgba(168,85,247,0.2)]'
                    }`}>
                      {/* Fondo Arcoíris del Botón */}
                      {!(product.type === 'PHYSICAL' && product.stock === 0) && (
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-rose-500 via-purple-500 to-teal-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 z-0"></div>
                      )}
                      
                      {/* Flex Container del botón para alinear texto e icono */}
                      <div className="relative z-10 flex items-center justify-center">
                        <span className="text-sm font-semibold opacity-0 max-w-0 group-hover/btn:opacity-100 group-hover/btn:max-w-[100px] transition-all duration-500 ease-out overflow-hidden whitespace-nowrap group-hover/btn:mr-2">
                          {product.type === 'SERVICE' ? 'Agendar' : product.stock === 0 ? 'Agotado' : 'Añadir'}
                        </span>
                        <ArrowRightIcon className={`w-5 h-5 ${!(product.type === 'PHYSICAL' && product.stock === 0) && 'group-hover/btn:scale-90 transition-transform duration-300'}`} />
                      </div>
                    </button>
                  </div>
                </div>
                
              </article>
            ))}
          </main>
        )}
      </div>

      {/* Tailwind keyframes inyectados para utilidades extra */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}} />
    </div>
  );
}

// ==========================================
// Iconos (Trazos perfeccionados)
// ==========================================
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}

function SparkleStarIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2L14.09 9.91L22 12L14.09 14.09L12 22L9.91 14.09L2 12L9.91 9.91L12 2Z" /></svg>;
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>;
}