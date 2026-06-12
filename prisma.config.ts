import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    // ✅ Aquí es donde Prisma 7 busca tu conexión
    url: env('DATABASE_URL'),
  },
  migrations: {
    // ✅ En Prisma 7, el comando seed se configura aquí en lugar del package.json
    seed: 'npx tsx -r dotenv/config prisma/seed.ts',
  },
});