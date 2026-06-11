'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createBanner(prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const subtitle = formData.get('subtitle') as string;

  if (!title) return { error: "El título es obligatorio." };

  let imageUrl: string | null = null;
  const imageFile = formData.get('image') as File | null;

  if (!imageFile || imageFile.size === 0 || imageFile.name === 'undefined') {
    return { error: "Debes subir una imagen para el banner." };
  }

  try {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    imageUrl = await new Promise<string>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: 'liberacionenergetica/banners',
          transformation: [
            { width: 1920, crop: "limit" }, // High res for banners
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
    return { error: "No se pudo subir la imagen a la nube. Verifica tu conexión." };
  }

  try {
    await prisma.banner.create({
      data: { title, subtitle, imageUrl, isActive: true }
    });
    
    revalidatePath('/');
    revalidatePath('/dashboard/banners');
    revalidatePath('/dashboard/banners/new');
    
    return { success: true }; 
  } catch (error) {
    console.error("Error Prisma Banner:", error);
    return { error: "Error interno al guardar en la base de datos." };
  }
}

export async function toggleBannerStatus(id: string, currentStatus: boolean) {
  try {
    await prisma.banner.update({ where: { id }, data: { isActive: !currentStatus } });
    revalidatePath('/dashboard/banners');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { error: "No se pudo cambiar el estado del banner." };
  }
}

export async function deleteBanner(id: string) {
  try {
    const banner = await prisma.banner.findUnique({ where: { id } });
    await prisma.banner.delete({ where: { id } });

    if (banner?.imageUrl) {
      const match = banner.imageUrl.match(/\/v\d+\/(.+)\.[a-zA-Z0-9]+$/);
      if (match && match[1]) {
        await cloudinary.uploader.destroy(match[1]);
      }
    }

    revalidatePath('/dashboard/banners');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { error: "Ocurrió un error al intentar eliminar el banner." };
  }
}