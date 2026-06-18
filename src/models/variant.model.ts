import { Schema, model } from 'mongoose';
import { IVariant } from '../interfaces/variant.interface';

// A merchant should not be able to create the same color + size combination twice for one product


const variantSchema = new Schema<IVariant>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    color: { type: String, required: true, trim: true },
    size: { type: String, required: true, trim: true },
    stock: { 
      type: Number, 
      required: true, 
      min: [0, 'Variant stock cannot be negative'] 
    },
    priceOverride: { type: Number, min: 0 },
  },
  { timestamps: true }
);

// Prevent duplicate Color + Size per Product
// The collation ensures "Black" and "black" trigger the duplicate warning
variantSchema.index(
  { productId: 1, color: 1, size: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } }
);

export const Variant = model<IVariant>('Variant', variantSchema);