import { Router } from 'express';
import { getMerchantStats } from '../controllers/dashboard.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

// Dashboard routes must be strictly protected
router.use(protect);
router.use(restrictTo('merchant'));

router.get('/stats', getMerchantStats);

export default router;