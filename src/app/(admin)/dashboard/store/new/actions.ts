'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Este es el estado que devolveremos al formulario
export type ActionResponse = {
  success?: boolean;
  error?: string;
};

export async function createProduct(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const type = formData.get('type') as string;
    const stock = parseInt(formData.get('stock') as string) || 0;
    const duration = parseInt(formData.get('duration') as string) || null;
    
    const file = formData.get('image') as File | null;
    let imageUrl: string | null = null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
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
    }

    await prisma.product.create({
      data: { name, description, price, type, duration, stock, imageUrl, isActive: true },
    });

    revalidatePath('/dashboard/store');
    return { success: true }; // Éxito
  } catch (error) {
    console.error("Error completo:", error);
    return { error: "Error al crear el producto. Revisa los logs." };
  }
}