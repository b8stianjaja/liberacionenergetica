import { prisma } from "@/lib/prisma";
import NewProductForm from "./NewProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <NewProductForm initialCategories={categories} />
    </div>
  );
}