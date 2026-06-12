"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Environment } from "@react-three/drei";
import * as THREE from "three";

function SparkleField({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.005;
      
      // En móviles no hay mouse, fijamos el target en el centro para evitar cálculos extra
      const targetX = isMobile ? 0 : (state.pointer.x * Math.PI) / 12;
      const targetY = isMobile ? 0 : (state.pointer.y * Math.PI) / 12;
      
      const dampFactor = 1 - Math.exp(-5 * delta);
      
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, dampFactor);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, dampFactor);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Capa principal de energía (Zinc 400 para contraste etéreo en fondo claro) */}
      <Sparkles 
        count={isMobile ? 300 : 1200} 
        scale={25} 
        size={isMobile ? 2.5 : 1.5} 
        speed={0.2} 
        color="#a1a1aa" 
        opacity={0.4} 
        noise={1}
      />
      {/* Capa secundaria (Zinc 500 para profundidad) */}
      <Sparkles 
        count={isMobile ? 100 : 300} 
        scale={20} 
        size={isMobile ? 4 : 3} 
        speed={0.4} 
        color="#71717a" 
        opacity={0.3} 
        noise={2}
      />
    </group>
  );
}

export default function EnergyScene() {
  const [isMobile, setIsMobile] = useState(true); // Default true evita saltos pesados en el primer render

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    // mix-blend-multiply eliminado para que las partículas grises se vean correctamente
    <div className="fixed inset-0 z-0 pointer-events-none opacity-70 transition-opacity duration-1000 transform-gpu">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }} 
        // En móvil, forzar strict 1x resolution. En PC, permitir hasta 1.5x
        dpr={isMobile ? [1, 1] : [1, 1.5]} 
        gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      >
        <ambientLight intensity={1} />
        <Environment preset="city" />
        <SparkleField isMobile={isMobile} />
      </Canvas>
    </div>
  );
}