import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  seed: "npx tsx prisma/seed.ts",
  datasource: {
    url: "file:./dev.db",
  },
});