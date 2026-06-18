import { Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class ProductController {
  static async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await ProductService.createProduct(req.merchant!.id, req.body);
      res.status(201).json({ status: 'success', data: { product } });
    } catch (error) { next(error); }
  }

  static async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await ProductService.getProductsByMerchant(req.merchant!.id);
      res.status(200).json({ status: 'success', results: products.length, data: { products } });
    } catch (error) { next(error); }
  }

  static async getOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await ProductService.getProductById(req.merchant!.id, req.params.id);
      res.status(200).json({ status: 'success', data: { product } });
    } catch (error) { next(error); }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await ProductService.updateProduct(req.merchant!.id, req.params.id, req.body);
      res.status(200).json({ status: 'success', data: { product } });
    } catch (error) { next(error); }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await ProductService.deleteProduct(req.merchant!.id, req.params.id);
      res.status(204).send(); // 204 No Content
    } catch (error) { next(error); }
  }
}