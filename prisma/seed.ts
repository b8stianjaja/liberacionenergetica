import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // 1. Fail gracefully if variables are missing
  if (!adminEmail || !adminPassword) {
    console.warn("⚠️ ADMIN_EMAIL or ADMIN_PASSWORD not found in environment variables. Skipping admin creation.");
    return;
  }

  // 2. Check if this admin already exists to prevent duplication
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`✅ Admin user ${adminEmail} already exists. Skipping creation.`);
    return;
  }

  // 3. Hash the password securely
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // 4. Create the user in the database
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN', // Overrides the default "CUSTOMER" role
    },
  });

  console.log(`✅ Admin user created with email: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });