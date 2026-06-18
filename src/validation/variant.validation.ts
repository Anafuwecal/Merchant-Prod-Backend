import { z } from 'zod';

export const createVariantSchema = z.object({
  body: z.object({
    color: z.string().min(1, 'Color is required'),
    size: z.string().min(1, 'Size is required'),
    stock: z.number().int('Stock must be a whole number').min(0, 'Stock cannot be negative'),
    priceOverride: z.number().positive('Price override must be greater than zero').optional(),
  }),
});

export const updateVariantSchema = z.object({
  body: z.object({
    color: z.string().min(1).optional(),
    size: z.string().min(1).optional(),
    stock: z.number().int().min(0).optional(),
    priceOverride: z.number().positive().optional(),
  }),
});