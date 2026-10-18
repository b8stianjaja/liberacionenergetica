import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { readAdminSeedConfig } from './admin-seed-config';

// 1. Configuramos el pool de conexión exactamente igual que en la app
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  // Aseguramos el SSL para la conexión con Render
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

// 2. Creamos el adaptador
const adapter = new PrismaPg(pool);

// 3. Inicializamos PrismaClient inyectándole el adaptador
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando proceso de seeder...');

  const { adminUsername, adminPassword } = readAdminSeedConfig(process.env);

  // La semilla solo crea la cuenta si falta. Nunca modifica la contraseña
  // ni eleva el rol de usuarios existentes de forma silenciosa.
  const existing = await prisma.user.findUnique({ where: { username: adminUsername } });
  if (existing) {
    if (existing.role !== 'ADMIN') {
      throw new Error('ADMIN_USERNAME ya pertenece a una cuenta sin permisos administrativos.');
    }
    console.log('Cuenta administradora existente: sin cambios de contraseña.');
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.user.create({
    data: {
      username: adminUsername,
      name: 'Admin Principal',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Cuenta administradora creada:', admin.username);
}

main()
  .catch((e) => {
    console.error('Error crítico durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    // 4. Es CRÍTICO cerrar tanto Prisma como el Pool de pg para que el build de Render termine y no se quede colgado
    await prisma.$disconnect();
    await pool.end();
    console.log('Conexión a la base de datos cerrada.');
  });