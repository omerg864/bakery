import { loginResponseBaseSchemas, loginResponseSchema } from '@shared/schemas/authSchemas/authResponses.schema';
import express, { type Router } from 'express';
import { authUserMiddleware } from '../middlewares/auth.middleware';
import { validateBodySchema } from '../middlewares/validation.middleware';
import {
	googleAuthSchema,
	googleAuthSchemaName,
	loginSchema,
	loginSchemaName,
	logoutCookiesSchema,
	logoutCookiesSchemaRef,
	refreshTokenCookiesSchema,
	refreshTokenCookiesSchemaRef,
} from '@shared/schemas/authSchemas/authRequests.schema';
import {
	login,
	googleAuth,
	logout,
	refreshToken,
} from '../controllers/auth.controller';
import { generatePath } from '@shared/services/app.shared-service';
import { SERVER_ROUTES } from '@shared/constants/routes.constants';
import { addDocRoute } from '../config/doc.config';
import { ErrorName } from '@shared/constants/error.constants';
import { z } from 'zod';

const router: Router = express.Router();

addDocRoute({
	name: loginSchemaName,
	route: generatePath([
		SERVER_ROUTES.BASE,
		SERVER_ROUTES.AUTH.version,
		SERVER_ROUTES.AUTH.BASE,
		SERVER_ROUTES.AUTH.ROUTES.LOGIN,
	]),
	method: 'post',
	summary: 'User login',
	requestSchemas: {
		body: loginSchema,
	},
	responses: {
		200: {
			description: 'Login success',
			schema: loginResponseSchema,
			cookies: 'Set-Cookie: refreshToken; HttpOnly; Secure; SameSite=Strict',
		},
	},
	baseSchemas: loginResponseBaseSchemas,
	authenticatedUser: 'none',
	tags: ['Auth'],
	errors: [ErrorName.UNAUTHORIZED],
});
router.post(
	generatePath([SERVER_ROUTES.AUTH.ROUTES.LOGIN]),
	validateBodySchema(loginSchema),
	login
);

addDocRoute({
	name: googleAuthSchemaName,
	route: generatePath([
		SERVER_ROUTES.BASE,
		SERVER_ROUTES.AUTH.version,
		SERVER_ROUTES.AUTH.BASE,
		SERVER_ROUTES.AUTH.ROUTES.GOOGLE,
	]),
	method: 'post',
	summary: 'User google auth',
	requestSchemas: {
		body: googleAuthSchema,
	},
	responses: {
		200: {
			description: 'successful authentication with Google',
			schema: z.object({}),
		},
	},
	authenticatedUser: 'none',
	tags: ['Auth'],
	errors: [ErrorName.UNAUTHORIZED],
});
router.post(
	generatePath([SERVER_ROUTES.AUTH.ROUTES.GOOGLE]),
	validateBodySchema(googleAuthSchema),
	googleAuth
);

addDocRoute({
	name: refreshTokenCookiesSchemaRef,
	route: generatePath([
		SERVER_ROUTES.BASE,
		SERVER_ROUTES.AUTH.version,
		SERVER_ROUTES.AUTH.BASE,
		SERVER_ROUTES.AUTH.ROUTES.REFRESH_TOKEN,
	]),
	method: 'get',
	summary: 'Refresh user access token',
	requestSchemas: {
		cookies: refreshTokenCookiesSchema,
	},
	responses: {
		200: {
			description: 'successful token refresh',
			schema: z.object({}),
		},
	},
	authenticatedUser: 'none',
	tags: ['Auth'],
	errors: [ErrorName.UNAUTHORIZED, ErrorName.VALIDATION_ERROR],
});
router.get(
	generatePath([SERVER_ROUTES.AUTH.ROUTES.REFRESH_TOKEN]),
	refreshToken
);

//~ Protected Routes
addDocRoute({
	name: logoutCookiesSchemaRef,
	route: generatePath([
		SERVER_ROUTES.BASE,
		SERVER_ROUTES.AUTH.version,
		SERVER_ROUTES.AUTH.BASE,
		SERVER_ROUTES.AUTH.ROUTES.LOGOUT,
	]),
	requestSchemas: {
		cookies: logoutCookiesSchema,
	},
	responses: {
		200: {
			description: 'Logout successful',
			schema: z.object({}),
		},
	},
	method: 'post',
	summary: 'User logout',
	authenticatedUser: 'user',
	tags: ['Auth'],
	errors: [ErrorName.UNAUTHORIZED],
});
router.post(
	generatePath([SERVER_ROUTES.AUTH.ROUTES.LOGOUT]),
	authUserMiddleware,
	logout
);

export default router;
