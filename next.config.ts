import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite cargar imágenes desde Cloudinary
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  // Tu configuración previa para Prisma/Postgres
  serverExternalPackages: ['@prisma/adapter-pg', 'pg'],
};

export default nextConfig;