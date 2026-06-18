import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { Product } from '../models/product.model';
import { Order } from '../models/order.model';
import { AppError } from '../utils/appError';

export class OrderController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await OrderService.createOrder(req.body);
      res.status(201).json({ status: 'success', data: { order } });
    } catch (error) {
      next(error);
    }
  }
}

// GET /orders
export const getMerchantOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Find all products owned by the logged-in merchant
    // (Assuming your auth middleware attaches the user to req.user)
    const merchantProducts = await Product.find({ merchant: req.user.id }).select('_id');
    const productIds = merchantProducts.map(product => product._id);

    // 2. Find all orders where at least one item matches the merchant's product IDs
    // (Assuming your Order schema has an array called 'items' with a 'product' reference)
    const orders = await Order.find({
      'items.product': { $in: productIds }
    })
      .populate('items.product') // Optional: pulls in product details
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /orders/:id
export const getMerchantOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get merchant's product IDs for security validation
    const merchantProducts = await Product.find({ merchant: req.user.id }).select('_id');
    const productIds = merchantProducts.map(product => product._id);

    // 2. Find the specific order, but ONLY if it contains one of their products
    const order = await Order.findOne({
      _id: req.params.id,
      'items.product': { $in: productIds }
    }).populate('items.product');

    // 3. If no order is found, or it belongs to another merchant's products
    if (!order) {
      return next(new AppError('Order not found or you do not have permission to view it', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    next(error);
  }
};