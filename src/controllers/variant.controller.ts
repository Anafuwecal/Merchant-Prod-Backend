import { Response, NextFunction } from 'express';
import { VariantService } from '../services/variant.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class VariantController {
  static async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const variant = await VariantService.createVariant(req.merchant!.id, req.params.productId, req.body);
      res.status(201).json({ status: 'success', data: { variant } });
    } catch (error) { next(error); }
  }

  static async getByProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const variants = await VariantService.getVariantsByProduct(req.merchant!.id, req.params.productId);
      res.status(200).json({ status: 'success', results: variants.length, data: { variants } });
    } catch (error) { next(error); }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const variant = await VariantService.updateVariant(req.merchant!.id, req.params.variantId, req.body);
      res.status(200).json({ status: 'success', data: { variant } });
    } catch (error) { next(error); }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await VariantService.deleteVariant(req.merchant!.id, req.params.variantId);
      res.status(204).send();
    } catch (error) { next(error); }
  }
}