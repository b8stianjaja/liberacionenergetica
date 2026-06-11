import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Aumentamos el límite de tamaño para Server Actions (imágenes pesadas)
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
  },
  serverExternalPackages: ['@prisma/adapter-pg', 'pg'],
};

export default nextConfig;