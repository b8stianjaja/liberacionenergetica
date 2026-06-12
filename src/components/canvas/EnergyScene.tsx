"use client";

import { useEffect, useState, useMemo } from "react";

export default function EnergyScene() {
  const [mounted, setMounted] = useState(false);

  // Evitamos errores de hidratación asegurando que las animaciones complejas
  // y las posiciones aleatorias se rendericen solo en el cliente.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generamos "Cenizas de luz" (Partículas) una sola vez para no recargar el renderizado.
  // Usamos los colores de tu escena original (oro y menta/plata).
  const sparks = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1, // Tamaño entre 1px y 4px
      left: `${Math.random() * 100}vw`,
      animationDuration: `${Math.random() * 20 + 15}s`, // Flotación súper lenta (15-35s)
      animationDelay: `-${Math.random() * 20}s`, // Desfase para que ya estén en pantalla al cargar
      isGold: Math.random() > 0.5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#FAFAFB] selection:bg-zinc-200">
      
      {/* 1. TEXTURA DE RUIDO (Grain) - Aporta el aspecto "místico" y analógico */}
      <div className="absolute inset-0 opacity-[0.035] mix-blend-multiply z-10">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-80">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* 2. MATRIZ SAGRADA (Subtle Grid) - Da profundidad a la página */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.25]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(161, 161, 170, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(161, 161, 170, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* 3. VIENTOS ASTRALES (Ethereal Waves) - Reemplaza los orbes básicos */}
      {/* Viento Principal (Blanco brillante/Plata) */}
      <div 
        className="absolute top-[-20%] left-[-20%] w-[140vw] h-[60vh] opacity-60 mix-blend-screen blur-[120px] will-change-transform astral-wave-1"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(244,244,245,0) 70%)',
          transform: 'rotate(-15deg)',
        }}
      />
      
      {/* Viento Secundario (Tono menta/etéreo muy sutil) */}
      <div 
        className="absolute bottom-[-10%] right-[-20%] w-[120vw] h-[70vh] opacity-30 mix-blend-multiply blur-[100px] will-change-transform astral-wave-2"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(148, 255, 219, 0.3) 0%, rgba(250,250,251,0) 60%)',
          transform: 'rotate(10deg)',
        }}
      />

      {/* Viento de Acento (Destello dorado extremadamente difuminado) */}
      <div 
        className="absolute top-[20%] right-[10%] w-[60vw] h-[60vw] opacity-10 mix-blend-multiply blur-[140px] will-change-transform astral-pulse"
        style={{ background: 'radial-gradient(circle, rgba(255, 235, 50, 0.8) 0%, transparent 70%)' }}
      />

      {/* 4. CENIZA DE LUZ (Sparks) - Sustituye a R3F Sparkles con puro CSS hardware-accelerated */}
      {mounted && (
        <div className="absolute inset-0 z-20">
          {sparks.map((spark) => (
            <div
              key={spark.id}
              className="absolute bottom-[-10px] rounded-full will-change-transform"
              style={{
                width: `${spark.size}px`,
                height: `${spark.size}px`,
                left: spark.left,
                backgroundColor: spark.isGold ? '#ffeb32' : '#94ffdb',
                boxShadow: `0 0 ${spark.size * 2}px ${spark.isGold ? 'rgba(255,235,50,0.8)' : 'rgba(148,255,219,0.8)'}`,
                animation: `float-up ${spark.animationDuration} linear infinite`,
                animationDelay: spark.animationDelay,
              }}
            />
          ))}
        </div>
      )}

      {/* ESTILOS DE ANIMACIÓN NATIVOS (Inyectados directamente para portabilidad) */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Viento 1: Movimiento de marea lento */
        .astral-wave-1 {
          animation: wave-shift-1 25s ease-in-out infinite alternate;
        }
        @keyframes wave-shift-1 {
          0% { transform: rotate(-15deg) translateY(0) scale(1); }
          100% { transform: rotate(-5deg) translateY(10%) scale(1.1); }
        }

        /* Viento 2: Contracorriente */
        .astral-wave-2 {
          animation: wave-shift-2 30s ease-in-out infinite alternate;
        }
        @keyframes wave-shift-2 {
          0% { transform: rotate(10deg) translateX(0) scale(1); }
          100% { transform: rotate(20deg) translateX(-10%) scale(1.15); }
        }

        /* Destello que respira */
        .astral-pulse {
          animation: pulse-light 15s ease-in-out infinite alternate;
        }
        @keyframes pulse-light {
          0% { transform: scale(1); opacity: 0.08; }
          100% { transform: scale(1.2); opacity: 0.15; }
        }

        /* Partículas flotantes hiper-optimizadas */
        @keyframes float-up {
          0% { 
            transform: translateY(10vh) scale(0.8); 
            opacity: 0; 
          }
          10% { 
            opacity: 0.8; 
          }
          90% { 
            opacity: 0.8; 
          }
          100% { 
            transform: translateY(-110vh) scale(1.2); 
            opacity: 0; 
          }
        }
      `}} />
    </div>
  );
}