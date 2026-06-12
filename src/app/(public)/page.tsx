import { prisma } from "@/lib/prisma";
import HomeClient from "./home-client";

export const revalidate = 60; 

export default async function PublicPage() {
  const products = await prisma.product.findMany({ 
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      type: true,
      categoryId: true,
      duration: true,
      stock: true,
      imageUrl: true,
    }
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
    }
  });

  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      title: true,
      subtitle: true,
      imageUrl: true,
    }
  });

  return <HomeClient products={products} categories={categories} banners={banners} />;
}