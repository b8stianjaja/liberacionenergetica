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
  // 1. Validaciones iniciales
  const name = (formData.get('name') as string) || '';
  const description = (formData.get('description') as string) || '';
  const price = parseFloat(formData.get('price') as string) || 0;
  const type = (formData.get('type') as string) || 'PHYSICAL';
  
  if (!name || !description) {
    return { error: "Nombre y descripción son obligatorios." };
  }

  let duration: number | null = null;
  let stock = 0;

  if (type === 'SERVICE') {
    duration = parseInt(formData.get('duration') as string, 10) || null;
  } else if (type === 'PHYSICAL') {
    stock = parseInt(formData.get('stock') as string, 10) || 0;
  }

  let imageUrl: string | null = null;
  const imageFile = formData.get('image') as File | null;

  // 2. Lógica de subida a Cloudinary
  if (imageFile && imageFile.size > 0) {
    try {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      imageUrl = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'liberacionenergetica/catalog' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url as string);
          }
        ).end(buffer);
      });
    } catch (error) {
      console.error("Error en Cloudinary:", error);
      return { error: "No se pudo subir la imagen." };
    }
  }

  // 3. Persistencia en DB
  try {
    await prisma.product.create({
      data: { name, description, price, type, duration, stock, imageUrl, isActive: true }
    });
  } catch (error) {
    console.error("Error en Prisma:", error);
    return { error: "Error interno al guardar en la base de datos." };
  }

  // 4. Limpieza y Redirección (Fuera del try/catch para que sea exitosa)
  revalidatePath('/dashboard/store');
  redirect('/dashboard/store');
}