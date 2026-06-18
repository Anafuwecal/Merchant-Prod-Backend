import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/product.model';
import { Order } from '../models/order.model';
import mongoose from 'mongoose';

export const getMerchantStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const merchantId = new mongoose.Types.ObjectId(req.user!.id);

    // 1. Get all product IDs owned by this merchant (needed for Order queries)
    const merchantProducts = await Product.find({ merchant: merchantId }).select('_id');
    const productIds = merchantProducts.map(p => p._id);

    // 2. Fire off all database queries concurrently using Promise.all
    const [
      productStats,
      lowStockVariants,
      orderStats,
      topSelling
    ] = await Promise.all([
      
      // Query A: Total Products & Total Active Products
      Product.aggregate([
        { $match: { merchant: merchantId } },
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            totalActiveProducts: {
              $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] }
            }
          }
        }
      ]),

      // Query B: Low Stock Variants (< 5)
      Product.aggregate([
        { $match: { merchant: merchantId } },
        { $unwind: "$variants" },
        { $match: { "variants.stock": { $lt: 5 } } },
        { 
          $project: { 
            name: 1, 
            "variants.sku": 1, 
            "variants.stock": 1, 
            "variants.attributes": 1 
          } 
        }
      ]),

      // Query C: Total Orders & Revenue
      Order.aggregate([
        { $unwind: "$items" },
        { $match: { "items.product": { $in: productIds } } },
        {
          $group: {
            _id: null,
            uniqueOrders: { $addToSet: "$_id" }, // Count unique order IDs
            totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
          }
        },
        {
          $project: {
            totalOrders: { $size: "$uniqueOrders" },
            totalRevenue: 1
          }
        }
      ]),

      // Query D: Top Selling Products
      Order.aggregate([
        { $unwind: "$items" },
        { $match: { "items.product": { $in: productIds } } },
        {
          $group: {
            _id: "$items.product",
            totalUnitsSold: { $sum: "$items.quantity" },
            totalRevenueGenerated: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
          }
        },
        { $sort: { totalUnitsSold: -1 } },
        { $limit: 5 }, // Get top 5
        // Lookup to get actual product names instead of just IDs
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productDetails"
          }
        },
        { $unwind: "$productDetails" },
        {
          $project: {
            name: "$productDetails.name",
            totalUnitsSold: 1,
            totalRevenueGenerated: 1
          }
        }
      ])
    ]);

    // 3. Format default values in case aggregations return empty arrays
    const formattedProductStats = productStats[0] || { totalProducts: 0, totalActiveProducts: 0 };
    const formattedOrderStats = orderStats[0] || { totalOrders: 0, totalRevenue: 0 };

    // 4. Send response
    res.status(200).json({
      status: 'success',
      data: {
        totalOrders: formattedOrderStats.totalOrders,
        totalRevenue: formattedOrderStats.totalRevenue,
        totalProducts: formattedProductStats.totalProducts,
        totalActiveProducts: formattedProductStats.totalActiveProducts,
        lowStockVariants,
        topSellingProducts: topSelling
      }
    });

  } catch (error) {
    next(error);
  }
};