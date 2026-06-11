'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createProduct(prevState: any, formData: FormData) {
  // ... (Recuperación de datos iniciales queda igual que antes)
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string) || 0;
  const type = formData.get('type') as string;
  const categoryName = formData.get('categoryName') as string; 
  const existingCategoryId = formData.get('categoryId') as string;

  if (!name || !description) return { error: "El nombre y la descripción son obligatorios." };

  let finalCategoryId = existingCategoryId || null;

  if (categoryName && categoryName.trim() !== '') {
    const cleanName = categoryName.trim();
    const newCategory = await prisma.category.upsert({
      where: { name: cleanName },
      update: {},
      create: { name: cleanName }
    });
    finalCategoryId = newCategory.id;
  }

  const duration = type === 'SERVICE' ? parseInt(formData.get('duration') as string, 10) || null : null;
  const stock = type === 'PHYSICAL' ? parseInt(formData.get('stock') as string, 10) || 0 : 0;

  let imageUrl: string | null = null;
  const imageFile = formData.get('image') as File | null;

  if (imageFile && imageFile.size > 0) {
    try {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      imageUrl = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            folder: 'liberacionenergetica/catalog',
            // OPTIMIZACIÓN DE RAÍZ: Evita fotos pesadas. Las recorta inteligentemente.
            transformation: [
              { width: 1200, crop: "limit" },
              { quality: "auto", fetch_format: "auto" }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url as string);
          }
        ).end(buffer);
      });
    } catch (error) {
      return { error: "No se pudo subir la imagen a la nube." };
    }
  }

  try {
    await prisma.product.create({
      data: { name, description, price, type, duration, stock, imageUrl, isActive: true, categoryId: finalCategoryId }
    });
  } catch (error) {
    return { error: "Error interno al guardar en la base de datos." };
  }

  revalidatePath('/dashboard/store');
  revalidatePath('/'); 
  redirect('/dashboard/store');
}

export async function toggleProductStatus(id: string, currentStatus: boolean) {
  try {
    await prisma.product.update({ where: { id }, data: { isActive: !currentStatus } });
    revalidatePath('/dashboard/store');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { error: "No se pudo cambiar el estado." };
  }
}

export async function deleteProduct(id: string) {
  try {
    // 1. Buscamos el producto para obtener su imagen antes de borrarlo
    const product = await prisma.product.findUnique({ where: { id } });

    // 2. Intentamos borrar de BD (si tiene ventas previas, fallará acá para proteger la contabilidad)
    await prisma.product.delete({ where: { id } });

    // 3. LIMPIEZA CLOUDINARY: Si se borró de la BD con éxito, eliminamos el archivo en la nube
    if (product?.imageUrl) {
      // Extrae el Public ID de la URL usando una expresión regular segura
      const match = product.imageUrl.match(/\/v\d+\/(.+)\.[a-zA-Z0-9]+$/);
      if (match && match[1]) {
        await cloudinary.uploader.destroy(match[1]);
      }
    }

    revalidatePath('/dashboard/store');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2003') {
      return { error: "Este producto ya tiene ventas registradas. Por favor, ocúltalo (👁️) en lugar de borrarlo para mantener el registro financiero intacto." };
    }
    return { error: "Ocurrió un error al intentar eliminar el producto." };
  }
}