'use server';

import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Configurar Cloudinary con tus variables de entorno
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createProduct(prevState: any, formData: FormData) {
  try {
    // 1. Extraer los datos de texto del formulario
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string) || 0;
    const type = formData.get('type') as string; // 'PHYSICAL' o 'DIGITAL'
    
    // 2. Extraer y procesar la imagen
    const file = formData.get('image') as File;
    let imageUrl = null;

    // Si el usuario subió un archivo y no está vacío
    if (file && file.size > 0) {
      // Convertir el archivo a un formato que Cloudinary entienda (Base64)
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const base64String = Buffer.from(buffer).toString('base64');
      const dataURI = `data:${file.type};base64,${base64String}`;

      // Subir a Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        folder: 'liberacion_productos', // Se creará esta carpeta en tu Cloudinary
      });
      
      imageUrl = uploadResponse.secure_url;
    }

    // 3. Guardar en la Base de Datos con Prisma
    await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        type,
        imageUrl, // Guardamos la URL que nos dio Cloudinary
        isActive: true,
      },
    });

  } catch (error) {
    console.error('Error al crear producto:', error);
    return { error: 'Hubo un problema al crear el producto. Intenta de nuevo.' };
  }

  // 4. Limpiar la caché y redirigir (Debe ir fuera del try/catch)
  revalidatePath('/dashboard/store');
  redirect('/dashboard/store');
}