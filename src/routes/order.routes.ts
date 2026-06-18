import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { validate } from '../middlewares/validate.middleware';
import { createOrderSchema } from '../validation/order.validation';
import { getMerchantOrders, getMerchantOrderById } from '../controllers/order.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware'; // Use your actual auth imports

const router = Router();

// Protect all routes below this middleware
router.use(protect);

// Restrict to merchants only (if you have role-based access)
router.use(restrictTo('merchant'));
router.route('/').get(getMerchantOrders);
router.route('/:id').get(getMerchantOrderById);
//No `protect` middleware here. Customers place orders!
router.post('/', validate(createOrderSchema), OrderController.create);

export default router;