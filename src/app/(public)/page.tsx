import { prisma } from "@/lib/prisma";
import HomeClient from "./home-client";

export const revalidate = 60;

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  return <HomeClient products={products} />;
}