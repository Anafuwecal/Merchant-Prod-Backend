import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    customerName: z.string().min(2, 'Customer name is required'),
    customerPhone: z.string().min(5, 'Valid phone number is required'),
    customerAddress: z.string().min(5, 'Delivery address is required'),
    items: z.array(
      z.object({
        productId: z.string().length(24, 'Invalid Product ID'),
        variantId: z.string().length(24, 'Invalid Variant ID').optional(),
        quantity: z.number().int().positive('Quantity must be at least 1')
      })
    ).min(1, 'Order must contain at least one item')
  })
});