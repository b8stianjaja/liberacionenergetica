"use client";

import { useEffect, useState, useMemo } from "react";

export default function EnergyScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // He añadido las variables de color directamente para que puedas cambiarlas en un solo lugar.
  // Ahora usa tonos Lavanda y Menta (Ethereal Dawn), cámbialos si prefieres los originales.
  const COLOR_A = "#b094ff"; // Soft Lavender (Original: #ffeb32)
  const COLOR_B = "#94ffdb"; // Ethereal Mint 

  const sparks = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1, 
      left: `${Math.random() * 100}vw`,
      animationDuration: `${Math.random() * 20 + 15}s`, 
      animationDelay: `-${Math.random() * 20}s`, 
      color: Math.random() > 0.5 ? COLOR_A : COLOR_B,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#FAFAFB] selection:bg-zinc-200">
      
      {/* 1. TEXTURA DE RUIDO (Grain) - Optimizada por Base64 para GPU */}
      <div 
        className="absolute inset-0 z-10 opacity-[0.045] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px'
        }}
      />

      {/* 2. MATRIZ SAGRADA (Subtle Grid) */}
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

      {/* 3. VIENTOS ASTRALES (Ethereal Waves) - Optimizados sin blur-[120px] */}
      {/* Viento Principal */}
      <div 
        className="absolute top-[-20%] left-[-20%] w-[140vw] h-[60vh] opacity-50 mix-blend-multiply will-change-transform astral-wave-1"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(176, 148, 255, 0.4) 0%, rgba(176, 148, 255, 0.1) 40%, transparent 70%)',
        }}
      />
      
      {/* Viento Secundario */}
      <div 
        className="absolute bottom-[-10%] right-[-20%] w-[120vw] h-[70vh] opacity-40 mix-blend-multiply will-change-transform astral-wave-2"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(148, 255, 219, 0.3) 0%, rgba(148, 255, 219, 0.05) 50%, transparent 70%)',
        }}
      />

      {/* Viento de Acento */}
      <div 
        className="absolute top-[20%] right-[10%] w-[60vw] h-[60vw] opacity-20 mix-blend-multiply will-change-transform astral-pulse"
        style={{ 
          background: 'radial-gradient(circle, rgba(255, 180, 162, 0.6) 0%, rgba(255, 180, 162, 0.1) 40%, transparent 70%)' 
        }}
      />

      {/* 4. CENIZA DE LUZ (Sparks) */}
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
                backgroundColor: spark.color,
                boxShadow: `0 0 ${spark.size * 1.5}px ${spark.color}`,
                animation: `float-up ${spark.animationDuration} linear infinite`,
                animationDelay: spark.animationDelay,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}