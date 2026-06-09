// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep the external packages declaration so Prisma and SQLite don't get wrongly bundled
  serverExternalPackages: ['@prisma/client', 'better-sqlite3'],
  
};

export default nextConfig;