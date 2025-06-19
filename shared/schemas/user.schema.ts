import { z } from 'zod';
import {
	PASSWORD_ERROR_MESSAGE,
	PASSWORD_REGEX,
	PLAIN_TEXT_WITH_EMOJI_ERROR_MESSAGE,
	PLAIN_TEXT_WITH_EMOJI_REGEX,
} from '../constants/validation.constants';
import { UserEntity } from '../types/user.entity';

export const registerSchema: z.ZodType<Partial<UserEntity>> = z
	.object({
		email: z.string().trim().email(),
		password: z.string().regex(PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE),
		name: z
			.string()
			.trim()
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

export const loginSchema: z.ZodType<Partial<UserEntity>> = z
	.object({
		email: z.string().trim().email(),
		password: z.string(),
	})
	.strict()
	.transform((data) => ({
		email: data.email.trim().toLowerCase(),
		password: data.password.trim(),
	}));

export const googleAuthSchema: z.ZodType<{ code: string }> = z
	.object({
		code: z.string().trim().min(1, 'Google auth code is required'),
	})
	.strict()
	.transform((data) => ({
		code: data.code.trim(),
	}));
