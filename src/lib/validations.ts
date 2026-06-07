// src/lib/validations.ts
import { z } from "zod";

export const UserRegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
});

export const ProductSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be greater than zero"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export const OrderCreationSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().cuid("Invalid product ID"),
      quantity: z.number().int().positive("Quantity must be at least 1"),
    })
  ).min(1, "Order must contain at least one item"),
});

export const NoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  courseId: z.string().optional(),
});