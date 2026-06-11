import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    // ✅ Aquí es donde Prisma 7 ahora busca tu conexión
    url: env('DATABASE_URL'),
  },
});