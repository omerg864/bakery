import express, { type Router } from 'express';
import { authUserMiddleware } from '../middlewares/auth.middleware';
import { validateBodySchema } from '../middlewares/validation.middleware';
import { googleAuthSchema, loginSchema } from '@shared/schemas/user.schema';
import {
	login,
	googleAuth,
	logout,
	refreshToken,
} from '../controllers/auth.controller';
import { generatePath } from '@shared/services/app.shared-service';
import { SERVER_ROUTES } from '@shared/constants/routes.constants';

const router: Router = express.Router();

router.post(
	generatePath([SERVER_ROUTES.AUTH.ROUTES.LOGIN]),
	validateBodySchema(loginSchema),
	login
);
router.post(
	generatePath([SERVER_ROUTES.AUTH.ROUTES.GOOGLE]),
	validateBodySchema(googleAuthSchema),
	googleAuth
);
router.post(
	generatePath([SERVER_ROUTES.AUTH.ROUTES.REFRESH_TOKEN]),
	refreshToken
);

//~ Protected Routes
router.post(
	generatePath([SERVER_ROUTES.AUTH.ROUTES.LOGOUT]),
	authUserMiddleware,
	logout
);

export default router;
