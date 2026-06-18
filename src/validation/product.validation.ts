import { z } from 'zod';

// ensure merchants don't send negative prices or completely empty products.
export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Product name is required'),
    description: z.string().min(5, 'Description is required'),
    price: z.number().positive('Price must be greater than zero'),
    category: z.string().min(2, 'Category is required'),
    images: z.array(z.string().url('Image must be a valid URL')).optional().default([]),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().min(5).optional(),
    price: z.number().positive().optional(),
    category: z.string().min(2).optional(),
    images: z.array(z.string().url()).optional(),
    isActive: z.boolean().optional(),
  }),
});