import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el seeding de la base de datos...');

  // Encriptamos la contraseña "admin1234" (o la que tú prefieras)
  const hashedPassword = await bcrypt.hash('admin1234', 10);

  // Upsert previene errores si ejecutas el seed múltiples veces
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@liberacion.com' },
    update: {},
    create: {
      email: 'admin@liberacion.com',
      name: 'Admin Principal',
      password: hashedPassword,
      role: 'ADMIN', 
    },
  });

  console.log('Usuario administrador listo:', superAdmin.email);
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });