import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'], 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    // ESTA ES LA CLAVE PARA LOS GIFS:
    // Evita que Next.js intente re-comprimir GIFs y otras imágenes que ya vienen de Cloudinary.
    unoptimized: true, 
  },
  serverExternalPackages: ['@prisma/adapter-pg', 'pg'],
};

export default nextConfig;