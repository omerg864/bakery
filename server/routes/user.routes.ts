import express, { type Router } from 'express';
import {
	register,
	changePassword,
	resetPassword,
	sendResetPasswordEmail,
	updateUserData,
	resendVerificationEmail,
} from '../controllers/user.controller';
import { authUserMiddleware } from '../middlewares/auth.middleware';
import { validateBodySchema } from '../middlewares/validation.middleware';
import { registerSchema } from '@shared/schemas/user.schema';

const router: Router = express.Router();

router.post('/register', validateBodySchema(registerSchema), register);
router.post('/reset-password', resetPassword);
router.post('/reset-password/email', sendResetPasswordEmail);
router.post('/verification-email', resendVerificationEmail);

//~ Protected Routes
router.put('/password', authUserMiddleware, changePassword);
router.put('/', authUserMiddleware, updateUserData);

export default router;
