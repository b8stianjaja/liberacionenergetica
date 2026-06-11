import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Permite a Next.js convertir imágenes a estos formatos súper ligeros
    formats: ['image/avif', 'image/webp'], 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  // Evita que el driver de Postgres haga lenta tu build en Next.js
  serverExternalPackages: ['@prisma/adapter-pg', 'pg'],
};

export default nextConfig;