import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

// Usamos la misma sintaxis simplificada para el adaptador en el seed
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Encriptamos la contraseña "admin123" de forma segura
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Upsert asegura que si el usuario ya existe, no tire error
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ejemplo.com' },
    update: {},
    create: {
      email: 'admin@ejemplo.com',
      name: 'Admin Principal',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin user created/verified: ${admin.email}`);
  console.log('🌱 Seeding finished.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });