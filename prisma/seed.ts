import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

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

  console.log('Usuario administrador sincronizado exitosamente:', superAdmin.username);
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