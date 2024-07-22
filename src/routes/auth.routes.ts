import { Router } from 'express';
import AuthService from '../services/auth.service';
import AuthController from '../controllers/auth/auth.controller';

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post('/auth/login', authController.login);
router.get('/auth/check-status', authController.checkAuthStatus);

export default router;
