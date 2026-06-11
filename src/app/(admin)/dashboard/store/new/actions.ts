'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const type = formData.get('type') as string;
    const stock = parseInt(formData.get('stock') as string) || 0;
    const duration = parseInt(formData.get('duration') as string) || null;
    
    const file = formData.get('image') as File | null;
    let imageUrl = null;

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const base64String = Buffer.from(buffer).toString('base64');
      const dataURI = `data:${file.type};base64,${base64String}`;

      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        folder: 'liberacion_productos',
      });
      imageUrl = uploadResponse.secure_url;
    }

    await prisma.product.create({
      data: {
        name, description, price, stock, type, duration, imageUrl, isActive: true,
      },
    });

    // Limpiamos la caché de la tienda
    revalidatePath('/dashboard/store');
    
    // Retornamos éxito en lugar de hacer el redirect aquí
    return { success: true };

  } catch (error) {
    console.error('Error al guardar el producto:', error);
    return { success: false, error: 'No se pudo guardar el producto' };
  }
}