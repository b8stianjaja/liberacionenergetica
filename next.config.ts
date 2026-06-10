import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep the external packages declaration so Prisma and SQLite don't get wrongly bundled
  serverExternalPackages: ['@prisma/client', 'better-sqlite3'],
  
  // Permite que tu celular reciba los scripts y animaciones de desarrollo
  allowedDevOrigins: ['192.168.0.18'],
};

export default nextConfig;