import express, { type Router } from 'express';
import { authUserMiddleware } from '../middlewares/auth.middleware';
import { validateBodySchema } from '../middlewares/validation.middleware';
import { googleAuthSchema, loginSchema } from '@shared/schemas/user.schema';
import {
  login,
  googleAuth,
  logout,
  refreshToken
} from '../controllers/auth.controller';

const router: Router = express.Router();

router.post('/login', validateBodySchema(loginSchema), login);
router.post('/google', validateBodySchema(googleAuthSchema), googleAuth);
router.post('/refresh-token', refreshToken);


//~ Protected Routes
router.post('/logout', authUserMiddleware, logout);

export default router;