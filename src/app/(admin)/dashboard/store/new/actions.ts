'use server';

import { prisma } from "@/lib/prisma";
import { redirect } from 'next/navigation';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function createProduct(formData: FormData) {
  // 1. Safely extract basic text data
  const type = (formData.get('type') as string) || 'PHYSICAL';
  const name = (formData.get('name') as string) || '';
  const description = (formData.get('description') as string) || '';
  const priceStr = formData.get('price') as string;
  const price = priceStr ? parseFloat(priceStr) : 0;

  // 2. Initialize conditional fields
  let duration: number | null = null;
  let stock = 0;

  if (type === 'SERVICE') {
    const durationStr = formData.get('duration') as string;
    duration = durationStr ? parseInt(durationStr, 10) : null; 
  } else if (type === 'PHYSICAL') {
    const stockStr = formData.get('stock') as string;
    stock = stockStr ? parseInt(stockStr, 10) : 0;
  }

  // Basic validation
  if (!name || !description) {
    throw new Error("Missing required fields: Name and description are mandatory.");
  }

  // 3. --- IMAGE UPLOAD LOGIC ---
  const imageFile = formData.get('image') as File | null;
  let imageUrl: string | null = null;

  // Check if a file was actually uploaded (size > 0)
  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename to prevent overwriting files with the same name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Replace spaces in original filename with underscores for safer web URLs
    const originalName = imageFile.name.replace(/\s+/g, '_');
    const filename = `${uniqueSuffix}-${originalName}`;
    
    // Ensure the "public/uploads" directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Write the file to the local disk
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // The URL path we save in the DB (Next.js automatically serves the public/ folder)
    imageUrl = `/uploads/${filename}`;
  }

  // 4. Save to Database
  await prisma.product.create({
    data: {
      name,
      description,
      price,
      type,
      duration,
      stock,
      imageUrl, // <-- We add the generated image URL here
      isActive: true,
    }
  });

  // 5. Redirect back to store dashboard
  redirect('/dashboard/store');
}