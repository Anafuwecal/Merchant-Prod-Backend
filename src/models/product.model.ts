import { Schema, model } from 'mongoose';
import { IProduct } from '../interfaces/product.interface';

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
    merchantId: { type: Schema.Types.ObjectId, ref: 'Merchant', required: true },
  },
  { timestamps: true }
);

// Compound Index to prevent duplicate product names PER store
// The collation ensures that "Nike Shoes" and "nike shoes" are treated as the same name.
productSchema.index(
  { merchantId: 1, name: 1 }, 
  { unique: true, collation: { locale: 'en', strength: 2 } }
);

export const Product = model<IProduct>('Product', productSchema);