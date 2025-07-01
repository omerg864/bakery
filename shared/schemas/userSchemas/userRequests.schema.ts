import { z } from 'zod';
import 'zod-openapi/extend';
import {
	PASSWORD_ERROR_MESSAGE,
	PASSWORD_REGEX,
	PLAIN_TEXT_WITH_EMOJI_ERROR_MESSAGE,
	PLAIN_TEXT_WITH_EMOJI_REGEX
} from '../../constants/validation.constants';
import { requiredString } from '../base.schema';

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
	.strict();

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export const changePasswordSchema = z
	.object({
		currentPassword: z.string().optional(),
		newPassword: requiredString('New password').regex(
			PASSWORD_REGEX,
			PASSWORD_ERROR_MESSAGE
		),
	})
	.strict();

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;

export const resetPasswordSchema = z
	.object({
		resetPasswordToken: requiredString('Reset password token'),
		newPassword: requiredString('New password').regex(
			PASSWORD_REGEX,
			PASSWORD_ERROR_MESSAGE
		),
	})
	.strict();

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

export const sendResetPasswordEmailSchema = z
	.object({
		email: requiredString('Email').email('Invalid email address'),
	})
	.strict();

export type SendResetPasswordEmailSchemaType = z.infer<
	typeof sendResetPasswordEmailSchema
>;

export const updateUserDataSchema = z
	.object({
		name: z
			.string()
			.regex(
				PLAIN_TEXT_WITH_EMOJI_REGEX,
				PLAIN_TEXT_WITH_EMOJI_ERROR_MESSAGE
			)
			.optional(),
	})
	.strict();

export type UpdateUserDataSchemaType = z.infer<typeof updateUserDataSchema>;

export const resendVerificationEmailSchema = z
	.object({
		email: requiredString('Email').email('Invalid email address'),
	})
	.strict();

export type ResendVerificationEmailSchemaType = z.infer<
	typeof resendVerificationEmailSchema
>;
