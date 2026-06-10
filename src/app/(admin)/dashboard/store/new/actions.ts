'use server';

import { prisma } from "@/lib/prisma";
import { redirect } from 'next/navigation';
import { v2 as cloudinary } from 'cloudinary';

// Configuración a prueba de fallos leyendo la variable correcta
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createProduct(formData: FormData) {
  const type = (formData.get('type') as string) || 'PHYSICAL';
  const name = (formData.get('name') as string) || '';
  const description = (formData.get('description') as string) || '';
  const priceStr = formData.get('price') as string;
  const price = priceStr ? parseFloat(priceStr) : 0;

  let duration: number | null = null;
  let stock = 0;

  if (type === 'SERVICE') {
    const durationStr = formData.get('duration') as string;
    duration = durationStr ? parseInt(durationStr, 10) : null; 
  } else if (type === 'PHYSICAL') {
    const stockStr = formData.get('stock') as string;
    stock = stockStr ? parseInt(stockStr, 10) : 0;
  }

  if (!name || !description) {
    throw new Error("Faltan campos obligatorios: Nombre y descripción.");
  }

  const imageFile = formData.get('image') as File | null;
  let imageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      imageUrl = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'liberacionenergetica/catalog' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url as string);
          }
        );
        uploadStream.end(buffer);
      });
    } catch (error) {
      console.error("Error subiendo imagen a Cloudinary:", error);
      throw new Error("No se pudo subir la imagen.");
    }
  }

  await prisma.product.create({
    data: {
      name,
      description,
      price,
      type,
      duration,
      stock,
      imageUrl,
      isActive: true,
    }
  });

  redirect('/dashboard/store');
}