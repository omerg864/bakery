import { getUserById } from '../services/user.service';
import { NextFunction, Response } from 'express';
import { AccessTokenPayload, decodeAccessToken } from '../utils/jwt.utils';
import { RequestWithUser } from '../types/express';

export const authUserMiddleware = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		res.status(401);
		throw new Error('Not authorized, no token');
	}
	let decoded: AccessTokenPayload;

	try {
		decoded = decodeAccessToken(token);
	} catch (error) {
		res.status(401);
		throw new Error('Not authorized, token failed');
	}

	const user = await getUserById(decoded.userId);

	if (!user) {
		res.status(404);
		throw new Error('User not found');
	}

	if (!user.isEmailVerified) {
		res.status(401);
		throw new Error('User email is not verified');
	}

	req.user = user;

	next();
};
