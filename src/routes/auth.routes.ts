import { Router } from "express";
import { checkAuthStatus, login } from "../controllers/auth/auth.controller";

const router = Router();

router.post('/auth/login', login);
router.get('/auth/check-status', checkAuthStatus);

export default router;