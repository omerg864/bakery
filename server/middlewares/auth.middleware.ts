import { ACCESS_TOKEN_PREFIX } from '@shared/constants/auth.constants';
import { getUserById } from '../services/user.service';
import { NextFunction, Response } from 'express';
import { AccessTokenPayload, verifyAccessToken } from '../utils/jwt.utils';
import { RequestWithUser } from '../types/express';
import {
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
} from '../utils/error.utils';

export const authUserMiddleware = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers['authorization'];
	const authSplit = authHeader ? authHeader.split(' ') : [];
	if (authSplit.length !== 2 || authSplit[0] !== ACCESS_TOKEN_PREFIX) {
		throw new UnauthorizedError('invalid authorization header');
	}
	const token = authHeader ? authSplit[1] : null;

	if (!token) {
		throw new UnauthorizedError('no token');
	}
	let decoded: AccessTokenPayload;

	try {
		decoded = verifyAccessToken(token);
	} catch (error) {
		throw new UnauthorizedError('token expired or invalid');
	}

	const user = await getUserById(decoded.userId);

	if (!user) {
		throw new NotFoundError('User not found');
	}

	if (!user.isEmailVerified) {
		throw new ForbiddenError('User email is not verified');
	}

	req.user = user;

	next();
};
