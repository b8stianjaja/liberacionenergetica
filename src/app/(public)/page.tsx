import { prisma } from "@/lib/prisma";
import HomeClient from "./home-client";

// Opt-in to Next.js caching if this data doesn't change every second
export const revalidate = 60; 

export default async function PublicPage() {
  // 1. Fetch active products with exact fields needed
  const products = await prisma.product.findMany({ 
    where: { isActive: true }, //
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      type: true,
      categoryId: true, //
      duration: true,
      stock: true,
      imageUrl: true,
    }
  });

  // 2. Fetch categories efficiently
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
    }
  });

  // 3. Fetch active banners safely handling nulls via DB query
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      title: true,
      subtitle: true, //
      imageUrl: true,
    }
  });

  // Prisma 'select' ensures plain objects, so we can pass them directly
  // Note: Handle null subtitle fallback directly in the UI component if needed.
  return <HomeClient products={products} categories={categories} banners={banners} />;
}