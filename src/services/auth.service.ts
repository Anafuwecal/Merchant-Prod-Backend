import { Merchant } from '../models/merchant.model';
import { IMerchant } from '../interfaces/merchant.interface';
import { AppError } from '../utils/appError';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  static async register(data: IMerchant) {
    const existingMerchant = await Merchant.findOne({ email: data.email });
    if (existingMerchant) {
      throw new AppError('A merchant with this email already exists', 400);
    }

    const merchant = await Merchant.create(data);
    
    // Explicitly stripping password from the returned object for security
    const merchantObj = merchant.toObject();
    delete (merchantObj as any).password;
    
    return merchantObj;
  }

  static async login(data: Pick<IMerchant, 'email' | 'password'>) {
    const merchant = await Merchant.findOne({ email: data.email.toLowerCase() });
    if (!merchant) {
      throw new AppError('Incorrect email or password', 401);
    }

    const isPasswordCorrect = await bcrypt.compare(data.password, merchant.password);
    if (!isPasswordCorrect) {
      throw new AppError('Incorrect email or password', 401);
    }

    // Sign JWT with key pieces of data needed downstream
    const token = jwt.sign(
      { id: merchant._id, storeName: merchant.storeName },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return {
      token,
      merchant: {
        id: merchant._id,
        name: merchant.name,
        email: merchant.email,
        storeName: merchant.storeName,
      },
    };
  }
}