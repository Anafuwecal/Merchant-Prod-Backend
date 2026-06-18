import { Router } from 'express';
import { VariantController } from '../controllers/variant.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateVariantSchema } from '../validation/variant.validation';

const router = Router();
router.use(protect);

//  the param here is :variantId cause we are updating or deleting a specific variant, not a product. 
// The productId is already included in the route for creating and getting variants by product.
router.route('/:variantId')
  .patch(validate(updateVariantSchema), VariantController.update)
  .delete(VariantController.delete);

export default router;