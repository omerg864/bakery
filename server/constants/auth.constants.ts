import { CookieOptions } from 'express';
import { NODE_ENV } from '../config/env';

// 7 days in milliseconds
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// 15 years in milliseconds
export const DEVICE_ID_TTL_MS = 15 * 365 * 24 * 60 * 60 * 1000;

// 30 days in milliseconds – max time a session can live regardless of refresh
export const MAX_SESSION_DURATION = 30 * 24 * 60 * 60 * 1000;

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
	httpOnly: true,
	secure: NODE_ENV === 'production',
	sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
	maxAge: REFRESH_TOKEN_TTL_MS,
};

export const DEVICE_ID_COOKIE_OPTIONS: CookieOptions = {
	httpOnly: false,
	secure: NODE_ENV === 'production',
	sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
	maxAge: DEVICE_ID_TTL_MS,
};

export const RESET_PASSWORD_TOKEN_EXPIRATION_MS = 4 * 60 * 60 * 1000; // 4 hours