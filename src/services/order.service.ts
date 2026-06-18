import mongoose from 'mongoose';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { Variant } from '../models/variant.model';
import { AppError } from '../utils/appError';

export class OrderService {
  static async createOrder(orderData: any) {
    // Start Session for the Transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let totalAmount = 0;
      const processedItems = [];

      // 2. Loop through each item in the order
      for (const item of orderData.items) {
        // Find product within the transaction session
        const product = await Product.findById(item.productId).session(session);
        
        if (!product) {
          throw new AppError(`Product ${item.productId} not found`, 404);
        }
        if (!product.isActive) {
          throw new AppError(`Product '${product.name}' is currently inactive`, 400);
        }

        // Check if this product has variants
        const productVariants = await Variant.find({ productId: product._id }).session(session);
        const hasVariants = productVariants.length > 0;

        if (hasVariants && !item.variantId) {
          throw new AppError(`Product '${product.name}' requires a specific variant to be selected.`, 400);
        }

        let itemPrice = product.price;

        // 3. Handle Stock Deduction & Pricing for Variants
        if (item.variantId) {
          // Atomic find-and-update: Decrement stock ONLY if current stock >= quantity requested
          const variant = await Variant.findOneAndUpdate(
            { 
              _id: item.variantId, 
              productId: product._id,
              stock: { $gte: item.quantity } 
            },
            { $inc: { stock: -item.quantity } },
            { new: true, session }
          );

          if (!variant) {
            throw new AppError(`Insufficient stock or invalid variant for '${product.name}'.`, 400);
          }

          // Use variant price override if it exists, otherwise use base product price
          itemPrice = variant.priceOverride || product.price;
        }

        // 4. Tally the total and format the item for the DB
        totalAmount += itemPrice * item.quantity;
        processedItems.push({
          productId: product._id,
          variantId: item.variantId,
          quantity: item.quantity,
          priceAtPurchase: itemPrice
        });
      }

      // 5. Create the Order securely
      const newOrder = await Order.create([{
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerAddress: orderData.customerAddress,
        items: processedItems,
        totalAmount
      }], { session });

      // If we reach this line, everything worked. Commit the changes!
      await session.commitTransaction();
      session.endSession();

      return newOrder[0];

    } catch (error) {
      // If ANY error was thrown above, rollback the entire transaction
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}