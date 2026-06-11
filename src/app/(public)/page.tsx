import { prisma } from "@/lib/prisma";
import HomeClient from "./home-client";

export default async function PublicPage() {
  // 1. Fetch active products
  const dbProducts = await prisma.product.findMany({ 
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  // 2. Fetch categories
  const dbCategories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  // 3. Fetch active banners
  const dbBanners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' } // or createdAt: 'desc'
  });

  // Ensure plain, serializable objects for Client Components
  const safeProducts = dbProducts.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    type: product.type,
    categoryId: product.categoryId,
    duration: product.duration,
    stock: product.stock,
    imageUrl: product.imageUrl || null,
  }));

  const safeCategories = dbCategories.map(category => ({
    id: category.id,
    name: category.name,
  }));

  const safeBanners = dbBanners.map(banner => ({
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle || '', // Handle nulls safely
    imageUrl: banner.imageUrl,
  }));

  return <HomeClient products={safeProducts} categories={safeCategories} banners={safeBanners} />;
}