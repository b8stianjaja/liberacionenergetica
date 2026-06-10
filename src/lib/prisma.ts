// liberacionenergetica/src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

// Next.js hot-reloading safe singleton pattern
const prismaClientSingleton = () => {
  // Configuración del pool de PostgreSQL
  const pool = new Pool({
    connectionString,
    // Render requiere SSL en producción, pero en desarrollo local (localhost) suele fallar si está activo
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

// Declaración de tipos segura para globalThis
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// Exportamos la instancia única
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Guardamos la instancia en globalThis solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}