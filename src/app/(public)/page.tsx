import { prisma } from "@/lib/prisma";
import HomeClient from "./home-client";

export default async function PublicPage() {
  const dbProducts = await prisma.product.findMany({ 
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  const dbCategories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  const safeProducts = dbProducts.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    type: product.type,
    categoryId: product.categoryId,
    duration: product.duration,
    stock: product.stock,
    imageUrl: product.imageUrl || null, // Aseguramos que sea string o null exacto
  }));

  const safeCategories = dbCategories.map(category => ({
    id: category.id,
    name: category.name,
  }));

  return <HomeClient products={safeProducts} categories={safeCategories} />;
}