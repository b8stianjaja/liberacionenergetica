// prisma/seed.ts
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Iniciando proceso de seed...");

  // 1. Limpiar datos existentes (opcional pero recomendado en desarrollo)
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.note.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Crear un Administrador inicial
  const hashedPassword = await bcrypt.hash("admin1234", 10);
  
  const admin = await prisma.user.create({
    data: {
      email: "admin@liberacionenergetica.com",
      name: "Administrador",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // 3. Crear productos/servicios de ejemplo
  const products = [
    {
      name: "Terapia de Reiki",
      description: "Sesión de sanación energética profunda.",
      price: 25000,
      type: "SERVICE",
      duration: 60,
      isActive: true,
    },
    {
      name: "Cuarzo Amatista",
      description: "Piedra natural para la transmutación de energía.",
      price: 15000,
      type: "PHYSICAL",
      stock: 10,
      isActive: true,
    },
    {
      name: "Guía de Meditación Digital",
      description: "PDF descargable para principiantes.",
      price: 5000,
      type: "DIGITAL",
      isActive: true,
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("✅ Seed completado con éxito.");
  console.log(`👤 Admin creado: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error("❌ Error durante el proceso de seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });