import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Toma las credenciales de Render, o usa unas por defecto en local
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // upsert() buscará al admin. Si no existe, lo crea. Si existe, actualiza su contraseña.
  const superAdmin = await prisma.user.upsert({
    where: { username: adminUsername },
    update: { 
      password: hashedPassword 
    },
    create: {
      username: adminUsername,
      name: 'Admin Principal',
      password: hashedPassword,
      role: 'ADMIN', 
    },
  });

  console.log('Usuario administrador sincronizado:', superAdmin.username);
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });