import { verify, sign } from 'jsonwebtoken';
import {
	JWT_ACCESS_EXPIRATION,
	JWT_ACCESS_SECRET,
	JWT_REFRESH_EXPIRATION,
	JWT_REFRESH_SECRET,
} from '../config/env';

export type AccessTokenPayload = {
	userId: string;
};

export type RefreshTokenPayload = {
	userId: string;
};

export function generateRefreshToken(payload: RefreshTokenPayload): string {
	const options = { expiresIn: JWT_REFRESH_EXPIRATION as any };
	return sign(payload, JWT_REFRESH_SECRET, options);
}

export function generateAccessToken(payload: AccessTokenPayload): string {
	const options = { expiresIn: JWT_ACCESS_EXPIRATION as any };
	return sign(payload, JWT_ACCESS_SECRET, options);
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
	return verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
}

export function verifyAccessToken(token: string): AccessTokenPayload {
	return verify(token, JWT_ACCESS_SECRET) as AccessTokenPayload;
}
