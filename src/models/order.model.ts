import { Schema, model } from 'mongoose';
import { IOrderItem } from '../interfaces/order.interface';
import { IOrder } from '../interfaces/order.interface';


const orderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: Schema.Types.ObjectId, ref: 'Variant' },
  quantity: { type: Number, required: true, min: 1 },
  priceAtPurchase: { type: Number, required: true }
});

const orderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    customerAddress: { type: String, required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'completed' }
  },
  { timestamps: true }
);

export const Order = model<IOrder>('Order', orderSchema);