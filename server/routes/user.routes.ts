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
import {
	changePasswordSchema,
	registerSchema,
	resendVerificationEmailSchema,
	resetPasswordSchema,
	sendResetPasswordEmailSchema,
	updateUserDataSchema,
} from '@shared/schemas/user.schema';
import { SERVER_ROUTES } from '@shared/constants/routes.constants';
import { generatePath } from '@shared/services/app.shared-service';

const router: Router = express.Router();

router.post(
	generatePath([SERVER_ROUTES.USER.ROUTES.REGISTER]),
	validateBodySchema(registerSchema),
	register
);
router.post(
	generatePath([SERVER_ROUTES.USER.ROUTES.RESET_PASSWORD]),
	validateBodySchema(resetPasswordSchema),
	resetPassword
);
router.post(
	generatePath([SERVER_ROUTES.USER.ROUTES.RESET_PASSWORD_EMAIL]),
	validateBodySchema(sendResetPasswordEmailSchema),
	sendResetPasswordEmail
);
router.post(
	generatePath([SERVER_ROUTES.USER.ROUTES.VERIFICATION_EMAIL]),
	validateBodySchema(resendVerificationEmailSchema),
	resendVerificationEmail
);

//~ Protected Routes
router.put(
	generatePath([SERVER_ROUTES.USER.ROUTES.CHANGE_PASSWORD]),
	authUserMiddleware,
	validateBodySchema(changePasswordSchema),
	changePassword
);
router.put(
	generatePath([SERVER_ROUTES.USER.ROUTES.BASE]),
	authUserMiddleware,
	validateBodySchema(updateUserDataSchema),
	updateUserData
);

export default router;
