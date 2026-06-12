"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Environment } from "@react-three/drei";
import * as THREE from "three";

function SparkleField() {
  const groupRef = useRef<THREE.Group>(null);

  // SOLUCIÓN: Recibir 'delta' como segundo argumento
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotación constante y mística
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.005;
      
      const targetX = (state.pointer.x * Math.PI) / 12;
      const targetY = (state.pointer.y * Math.PI) / 12;
      
      // OPTIMIZACIÓN 120Hz: Smooth dampening usando el parámetro delta directamente
      const dampFactor = 1 - Math.exp(-5 * delta);
      
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, dampFactor);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, dampFactor);
    }
  });

  return (
    <group ref={groupRef}>
      <Sparkles 
        count={1200} 
        scale={25} 
        size={1.5} 
        speed={0.2} 
        color="#ffffff" 
        opacity={0.5} 
        noise={1}
      />
      <Sparkles 
        count={300} 
        scale={20} 
        size={3} 
        speed={0.4} 
        color="#a1a1aa" 
        opacity={0.3} 
        noise={2}
      />
    </group>
  );
}

export default function EnergyScene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-60 mix-blend-multiply transition-opacity duration-1000">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }} 
        // OPTIMIZACIÓN GPU: Limitar DPR a 1.5 previene lag en pantallas Retina/4K
        dpr={[1, 1.5]} 
        // OPTIMIZACIÓN GPU: Antialias false (no es necesario en partículas)
        gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      >
        <ambientLight intensity={1} />
        <Environment preset="city" />
        <SparkleField />
      </Canvas>
    </div>
  );
}