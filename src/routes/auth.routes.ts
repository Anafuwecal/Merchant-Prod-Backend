import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../validation/auth.validation';

const router = Router();

// Smoke Test Route (Bypasses everything)
router.post('/smoke-test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Routing layer is fully connected!',
    receivedData: req.body
  });
});

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);

export default router;