"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Environment } from "@react-three/drei";
import * as THREE from "three";

function SparkleField() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Rotación constante y mística
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.005;
      
      // Efecto Parallax súper suave con el mouse
      const targetX = (state.pointer.x * Math.PI) / 12;
      const targetY = (state.pointer.y * Math.PI) / 12;
      
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.02);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.02);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Capa principal de energía (Estrellas pequeñas y densas) */}
      <Sparkles 
        count={1200} 
        scale={25} 
        size={1.5} 
        speed={0.2} 
        color="#ffffff" 
        opacity={0.5} 
        noise={1}
      />
      {/* Capa secundaria (Destellos plateados más grandes) */}
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
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={1} />
        <Environment preset="city" />
        <SparkleField />
      </Canvas>
    </div>
  );
}