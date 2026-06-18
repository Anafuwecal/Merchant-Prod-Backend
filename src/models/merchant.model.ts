import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IMerchant } from '../interfaces/merchant.interface';

const merchantSchema = new Schema<IMerchant>(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    password: { type: String, required: [true, 'Password is required'], minlength: 6 },
    storeName: { type: String, required: [true, 'Store name is required'], trim: true },
  },
  { timestamps: true }
);

// Pre-save hook to hash passwords automatically
merchantSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

export const Merchant = model<IMerchant>('Merchant', merchantSchema);