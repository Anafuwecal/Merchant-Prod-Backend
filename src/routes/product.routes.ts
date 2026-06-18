import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createProductSchema, updateProductSchema } from '../validation/product.validation';
import { VariantController } from '../controllers/variant.controller';
import { createVariantSchema } from '../validation/variant.validation';

const router = Router();

// Applied auth middleware to product routes

router.use(protect);

router.route('/')
  .post(validate(createProductSchema), ProductController.create)
  .get(ProductController.getAll);

router.route('/:id')
  .get(ProductController.getOne)
  .patch(validate(updateProductSchema), ProductController.update)
  .delete(ProductController.delete);

  //For Variants.
router.route('/:productId/variants')
  .post(validate(createVariantSchema), VariantController.create)
  .get(VariantController.getByProduct);

export default router;