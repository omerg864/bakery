import { createAuth, removeUserExpiredAuth } from './../services/auth.service';
import type { Request, Response } from 'express';
import { UnauthorizedError } from '../utils/error.utils';
import {
	DEVICE_ID_COOKIE_NAME,
	REFRESH_TOKEN_COOKIE_NAME,
} from '@shared/constants/auth.constants';
import {
	findAuthByToken,
	findAuthByUserIdAndDeviceId,
	removeAuth,
	updateAuth,
} from '../services/auth.service';
import {
	verifyRefreshToken,
	generateAccessToken,
	generateRefreshToken,
} from '../utils/jwt.utils';
import { LoginSchemaType } from '@shared/schemas/authSchemas/authRequests.schema';
import { getUserByEmail } from '../services/user.service';
import { compareBcrypt, hashCrypto } from '../utils/encrypt.utils';
import {
	DEVICE_ID_COOKIE_OPTIONS,
	MAX_SESSION_DURATION,
	REFRESH_TOKEN_COOKIE_OPTIONS,
	REFRESH_TOKEN_TTL_MS,
} from '../constants/auth.constants';
import { v4 as uuidv4 } from 'uuid';
import { isBefore, differenceInMilliseconds, addMilliseconds } from 'date-fns';
import { LoginResponseSchemaType } from '../../shared/schemas/authSchemas/authResponses.schema';

export const login = async (
	req: Request<{}, {}, LoginSchemaType>,
	res: Response
) => {
	const { email, password, deviceName, deviceType } = req.body;

	let deviceId = req.cookies[DEVICE_ID_COOKIE_NAME];
	if (!deviceId) {
		deviceId = uuidv4(); // Generate a new device ID if not present
		res.cookie(DEVICE_ID_COOKIE_NAME, deviceId, DEVICE_ID_COOKIE_OPTIONS);
	}

	const userDocument = await getUserByEmail(email);
	if (!userDocument) {
		throw new UnauthorizedError('Invalid email or password');
	}
	if (!userDocument.isEmailVerified) {
		throw new UnauthorizedError('Email not verified');
	}
	if (!userDocument.password) {
		throw new UnauthorizedError(
			'Please login with Google or set a password'
		);
	}
	const isPasswordValid = await compareBcrypt(
		password,
		userDocument.password
	);
	if (!isPasswordValid) {
		throw new UnauthorizedError('Invalid email or password');
	}
	const accessToken = generateAccessToken({ userId: userDocument.id });
	const refreshToken = generateRefreshToken({ userId: userDocument.id });
	const hashedRefreshToken = hashCrypto(refreshToken);

	const existingAuth = await findAuthByUserIdAndDeviceId(
		userDocument.id,
		deviceId
	);
	const authExpiration = addMilliseconds(new Date(), REFRESH_TOKEN_TTL_MS);
	if (existingAuth) {
		// If an auth record exists for this user and device, update the token
		await updateAuth(
			userDocument.id,
			deviceId,
			hashedRefreshToken,
			authExpiration
		);
	} else {
		await createAuth({
			userId: userDocument.id,
			token: hashedRefreshToken,
			deviceId,
			deviceName,
			deviceType,
			expiresAt: authExpiration,
		});
	}

	await removeUserExpiredAuth(userDocument.id);

	res.cookie(
		REFRESH_TOKEN_COOKIE_NAME,
		refreshToken,
		REFRESH_TOKEN_COOKIE_OPTIONS
	);

	res.status(200).json({
		success: true,
		accessToken,
		message: 'Login successful',
		user: userDocument.getEntity(),
	} satisfies LoginResponseSchemaType);
};

export const logout = async (req: Request, res: Response) => {
	const cookies = req.cookies;
	let refreshToken: string | string[] | null =
		cookies?.[REFRESH_TOKEN_COOKIE_NAME] || null;
	if (Array.isArray(refreshToken)) {
		refreshToken = refreshToken[0]; // Use the first value
	}
	if (!refreshToken) {
		throw new UnauthorizedError('No refresh token provided');
	}
	res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_OPTIONS);

	const hashedRefreshToken = hashCrypto(refreshToken);

	const authFound = await findAuthByToken(hashedRefreshToken);
	if (!authFound) {
		throw new UnauthorizedError('Invalid refresh token');
	}
	await removeAuth(hashedRefreshToken, authFound.userId as string);
	res.status(200).json({
		success: true,
		message: 'Logout successful',
	});
};

export const googleAuth = async (req: Request, res: Response) => {};

export const refreshToken = async (req: Request, res: Response) => {
	const cookies = req.cookies;
	let refreshToken: string | string[] | null =
		cookies?.[REFRESH_TOKEN_COOKIE_NAME] || null;
	if (Array.isArray(refreshToken)) {
		refreshToken = refreshToken[0]; // Use the first value
	}
	if (!refreshToken) {
		throw new UnauthorizedError('No refresh token provided');
	}
	res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_OPTIONS);

	const hashedRefreshToken = hashCrypto(refreshToken);

	const authFound = await findAuthByToken(hashedRefreshToken);
	if (!authFound) {
		throw new UnauthorizedError('Invalid refresh token');
	}
	const payload = verifyRefreshToken(refreshToken);
	if (payload.userId !== authFound.userId) {
		throw new UnauthorizedError('Invalid refresh token');
	}
	if (isBefore(authFound.expiresAt, new Date())) {
		await removeAuth(hashedRefreshToken, authFound.userId);
		throw new UnauthorizedError('Refresh token expired');
	}
	if (
		differenceInMilliseconds(new Date(), new Date(authFound.createdAt)) >
		MAX_SESSION_DURATION
	) {
		await removeAuth(hashedRefreshToken, authFound.userId);
		throw new UnauthorizedError('Session expired, please log in again');
	}
	const newAccessToken = generateAccessToken({ userId: authFound.userId });
	const newRefreshToken = generateRefreshToken({ userId: authFound.userId });
	const newHashedRefreshToken = hashCrypto(newRefreshToken);
	res.cookie(
		REFRESH_TOKEN_COOKIE_NAME,
		newRefreshToken,
		REFRESH_TOKEN_COOKIE_OPTIONS
	);
	await updateAuth(
		authFound.userId,
		authFound.deviceId,
		newHashedRefreshToken,
		addMilliseconds(new Date(), REFRESH_TOKEN_TTL_MS)
	);
	res.status(200).json({
		success: true,
		accessToken: newAccessToken,
		message: 'Token refreshed successfully',
	});
};
