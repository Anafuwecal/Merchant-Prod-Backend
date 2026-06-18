import { Variant } from '../models/variant.model';
import { Product } from '../models/product.model';
import { IVariant } from '../interfaces/variant.interface';
import { AppError } from '../utils/appError';


// A merchant should only be able to add variants to their own products. 
// We must fetch the product and check the merchantId before creating or modifying a variant.

export class VariantService {
  // merchant actually owns the product the variant is attached to
  private static async verifyProductOwnership(merchantId: string, productId: string) {
    const product = await Product.findOne({ _id: productId, merchantId });
    if (!product) throw new AppError('Product not found or unauthorized', 404);
    return product;
  }

  static async createVariant(merchantId: string, productId: string, data: Partial<IVariant>) {
    await this.verifyProductOwnership(merchantId, productId);

    // Check for duplicate variant 
    const existingVariant = await Variant.findOne({
      productId,
      color: { $regex: new RegExp(`^${data.color}$`, 'i') },
      size: { $regex: new RegExp(`^${data.size}$`, 'i') }
    });

    if (existingVariant) {
      throw new AppError(`A variant with color '${data.color}' and size '${data.size}' already exists for this product.`, 400);
    }

    return await Variant.create({ ...data, productId });
  }

  static async getVariantsByProduct(merchantId: string, productId: string) {
    await this.verifyProductOwnership(merchantId, productId);
    return await Variant.find({ productId }).sort({ createdAt: -1 });
  }

  static async updateVariant(merchantId: string, variantId: string, data: Partial<IVariant>) {
    const variant = await Variant.findById(variantId);
    if (!variant) throw new AppError('Variant not found', 404);

    // Verify ownership via the parent product
    await this.verifyProductOwnership(merchantId, variant.productId.toString());

    Object.assign(variant, data);
    return await variant.save(); // Using save() triggers validation (like non-negative stock)
  }

  static async deleteVariant(merchantId: string, variantId: string) {
    const variant = await Variant.findById(variantId);
    if (!variant) throw new AppError('Variant not found', 404);

    await this.verifyProductOwnership(merchantId, variant.productId.toString());

    await variant.deleteOne();
  }
}