'use client';

import { useActionState, useState, useEffect } from 'react';
import Image from 'next/image'; // Importamos el componente optimizado de Next.js
import { authenticate } from './actions';
import { Cormorant_Garamond, Montserrat } from "next/font/google";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], style: ["normal", "italic"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600"], display: "swap" });

// 1. RUTAS LOCALES: Estas imágenes deben estar físicamente en public/images/login/
const backgroundImages = [
  "/images/login/studio-1.jpg", 
  "/images/login/studio-2.jpg", 
  "/images/login/studio-3.jpg"  
];

// 2. COMPONENTE AISLADO: Evita que el formulario se vuelva a renderizar en cada transición de imagen
function CinematicBackground() {
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % backgroundImages.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:flex flex-1 relative overflow-hidden bg-zinc-900">
      {backgroundImages.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: index === currentImg ? 1 : 0,
            transform: index === currentImg ? 'scale(1.05)' : 'scale(1)',
            transition: 'opacity 1.5s ease-in-out, transform 10s linear',
          }}
        >
          {/* Uso de next/image para optimización automática (WebP, redimensionamiento).
            'fill' hace que la imagen ocupe el contenedor absoluto.
            'priority' en index 0 asegura que la primera imagen cargue de inmediato.
          */}
          <Image 
            src={src} 
            alt={`Atmósfera administrativa ${index + 1}`}
            fill
            priority={index === 0} 
            className="object-cover"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-[#D4A373]/10 mix-blend-overlay" />
        </div>
      ))}

      <div className="absolute bottom-16 left-16 z-10 text-white max-w-xl">
        <div className="mb-6 opacity-80">
          <TetragrammatonIcon className="w-12 h-12 text-[#D4A373] animate-[spin_20s_linear_infinite]" />
        </div>
        <h2 className={`text-5xl md:text-6xl font-medium tracking-wide mb-4 ${cormorant.className}`}>
          <span className="text-[#D4A373]">liberacionenergetica™</span>
        </h2>
        <p className="text-sm font-bold tracking-[0.3em] uppercase opacity-70">
          Portal Administrativo
        </p>
      </div>
    </div>
  );
}

// 3. PÁGINA PRINCIPAL: Estable para el envío de formularios de Next Auth
export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <div className={`min-h-screen flex w-full bg-[#FCFBF9] text-[#2D2A26] ${montserrat.className} selection:bg-[#D4A373]/30`}>
      
      {/* LADO IZQUIERDO: Imágenes Cinematográficas */}
      <CinematicBackground />

      {/* LADO DERECHO: Formulario de Autenticación */}
      <div className="w-full lg:w-[480px] xl:w-[550px] flex flex-col justify-center px-8 sm:px-16 py-12 bg-[#FCFBF9] shadow-[-20px_0_40px_rgba(0,0,0,0.03)] z-10 relative">
        <div className="w-full max-w-sm mx-auto">
          
          <div className="text-center lg:text-left mb-12">
            <h1 className={`text-4xl text-[#2D2A26] mb-3 ${cormorant.className}`}>Bienvenido</h1>
            <p className="text-sm text-zinc-500 font-medium">Ingresa tus credenciales para acceder a la materia.</p>
          </div>
          
          <form action={formAction} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Usuario
              </label>
              <input 
                type="text" 
                name="username" 
                required 
                placeholder="tu_usuario"
                className="w-full bg-white border border-zinc-200 p-4 text-sm rounded-xl focus:ring-2 focus:ring-[#D4A373]/50 focus:border-[#D4A373] outline-none transition-all placeholder:text-zinc-300"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Contraseña
              </label>
              <input 
                type="password" 
                name="password" 
                required 
                placeholder="••••••••"
                className="w-full bg-white border border-zinc-200 p-4 text-sm rounded-xl focus:ring-2 focus:ring-[#D4A373]/50 focus:border-[#D4A373] outline-none transition-all placeholder:text-zinc-300"
              />
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="group relative w-full overflow-hidden bg-[#2D2A26] text-[#FCFBF9] font-medium text-sm tracking-widest uppercase p-4 rounded-xl hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4A373]/0 via-[#D4A373]/20 to-[#D4A373]/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isPending ? 'Verificando...' : 'Iniciar Sesión'}
              </span>
            </button>

            {errorMessage && (
              <div className="mt-6 p-4 bg-red-50/50 text-red-800 rounded-xl text-xs text-center font-medium border border-red-100/50">
                {errorMessage}
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
}

// Icono decorativo base
function TetragrammatonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5" {...props}>
      <circle cx="100" cy="100" r="95" strokeDasharray="3 6" opacity="0.5" />
      <circle cx="100" cy="100" r="85" strokeWidth="0.75" />
      <circle cx="100" cy="100" r="65" opacity="0.3" />
      <polygon points="100,15 174,143 26,143" strokeWidth="0.75" />
      <polygon points="100,185 26,57 174,57" strokeWidth="0.75" />
      <rect x="50" y="50" width="100" height="100" transform="rotate(45 100 100)" strokeDasharray="2 2" opacity="0.6"/>
      <circle cx="100" cy="100" r="3" fill="currentColor" opacity="0.8" />
    </svg>
  );
}