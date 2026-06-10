import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  seed: "npx tsx prisma/seed.ts",
  datasource: {
    // La conexión se delega a este archivo de configuración
    url: env("DATABASE_URL"),
  },
});