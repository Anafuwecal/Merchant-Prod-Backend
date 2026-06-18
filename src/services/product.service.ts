import { Product } from '../models/product.model';
import { IProduct } from '../interfaces/product.interface';
import { AppError } from '../utils/appError';

export class ProductService {
  static async createProduct(merchantId: string, data: Partial<IProduct>) {
    // Check for exact name match manually to provide a highly specific error message
    const existingProduct = await Product.findOne({ 
      merchantId, 
      name: { $regex: new RegExp(`^${data.name}$`, 'i') } 
    });

    if (existingProduct) {
      throw new AppError(`You already have a product named '${data.name}' in your store.`, 400);
    }

    return await Product.create({ ...data, merchantId });
  }

  static async getProductsByMerchant(merchantId: string) {
    return await Product.find({ merchantId }).sort({ createdAt: -1 });
  }

  static async getProductById(merchantId: string, productId: string) {
    const product = await Product.findOne({ _id: productId, merchantId });
    if (!product) throw new AppError('Product not found or unauthorized', 404);
    return product;
  }

  static async updateProduct(merchantId: string, productId: string, data: Partial<IProduct>) {
    const product = await Product.findOneAndUpdate(
      { _id: productId, merchantId },
      data,
      { new: true, runValidators: true }
    );
    if (!product) throw new AppError('Product not found or unauthorized', 404);
    return product;
  }

  static async deleteProduct(merchantId: string, productId: string) {
    const product = await Product.findOneAndDelete({ _id: productId, merchantId });
    if (!product) throw new AppError('Product not found or unauthorized', 404);
    return product;
  }
}