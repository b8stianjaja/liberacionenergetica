import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// Prisma 7 syntax explicitly expects the connection object with the url, 
// rather than an instance of the native better-sqlite3 Database.
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter, // <-- Using the correctly typed adapter
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;