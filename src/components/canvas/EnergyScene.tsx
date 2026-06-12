"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, MeshDistortMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

function EnergyOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating rotation
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.05;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      
      // Subtle mouse interaction (paralax)
      const targetX = (state.pointer.x * Math.PI) / 10;
      const targetY = (state.pointer.y * Math.PI) / 10;
      
      meshRef.current.rotation.x += 0.05 * (targetY - meshRef.current.rotation.x);
      meshRef.current.rotation.y += 0.05 * (targetX - meshRef.current.rotation.y);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.2}>
        <icosahedronGeometry args={[2, 32]} />
        <MeshDistortMaterial
          color="#e4e4e7" // zinc-200
          envMapIntensity={1}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          metalness={0.6}
          roughness={0.2}
          distort={0.3} // Fluid, organic distortion
          speed={2}     // Speed of the distortion wave
        />
      </mesh>
    </Float>
  );
}

export default function EnergyScene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-darken transition-opacity duration-1000">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
        {/* Soft, ethereal lighting */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[-5, -5, -5]} intensity={1} color="#a1a1aa" />
        
        {/* Real reflections */}
        <Environment preset="city" />

        {/* 500 performant WebGL particles replacing the 15 DOM particles */}
        <Sparkles 
          count={500} 
          scale={15} 
          size={1.5} 
          speed={0.2} 
          color="#71717a" 
          opacity={0.4} 
        />
        
        <EnergyOrb />
      </Canvas>
    </div>
  );
}