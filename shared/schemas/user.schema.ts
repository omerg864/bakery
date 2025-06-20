import { z } from 'zod';
import {
	PASSWORD_ERROR_MESSAGE,
	PASSWORD_REGEX,
	PLAIN_TEXT_WITH_EMOJI_ERROR_MESSAGE,
	PLAIN_TEXT_WITH_EMOJI_REGEX,
	UUID_ERROR_MESSAGE,
	UUID_REGEX,
} from '../constants/validation.constants';
import { requiredString } from './base.schema';

export const registerSchema = z
	.object({
		email: requiredString('Email').email('Invalid email address'),
		password: requiredString('Password').regex(
			PASSWORD_REGEX,
			PASSWORD_ERROR_MESSAGE
		),
		name: requiredString('Name')
			.min(1, 'Name is required')
			.max(50, 'Name must be less than 50 characters')
			.regex(
				PLAIN_TEXT_WITH_EMOJI_REGEX,
				PLAIN_TEXT_WITH_EMOJI_ERROR_MESSAGE
			),
	})
	.strict()
	.transform((data) => ({
		email: data.email.trim().toLowerCase(),
		name: data.name.trim(),
		password: data.password,
	}));

export type RegisterSchemaType = z.infer<typeof registerSchema>;

enum DeviceType {
	MOBILE = 'mobile',
	DESKTOP = 'desktop',
	TABLET = 'tablet',
}

export const loginSchema = z
	.object({
		email: requiredString('Email').email('Invalid email address'),
		password: requiredString('Password'),
		deviceId: requiredString('Device ID').regex(
			UUID_REGEX,
			UUID_ERROR_MESSAGE
		),
		deviceType: z.nativeEnum(DeviceType, {
			errorMap: () => ({ message: 'Invalid device type' }),
		}),
		deviceName: requiredString('Device name').regex(
			PLAIN_TEXT_WITH_EMOJI_REGEX,
			PLAIN_TEXT_WITH_EMOJI_ERROR_MESSAGE
		),
	})
	.strict()
	.transform((data) => ({
		email: data.email.trim().toLowerCase(),
		password: data.password.trim(),
		deviceType: data.deviceType,
		deviceName: data.deviceName.trim(),
	}));

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const googleAuthSchema = z
	.object({
		code: requiredString('Google auth code'),
	})
	.strict()
	.transform((data) => ({
		code: data.code.trim(),
	}));

export type GoogleAuthSchemaType = z.infer<typeof googleAuthSchema>;
