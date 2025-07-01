import { z } from 'zod';
import 'zod-openapi/extend';
import {
	PLAIN_TEXT_WITH_EMOJI_ERROR_MESSAGE,
	PLAIN_TEXT_WITH_EMOJI_REGEX,
	UUID_ERROR_MESSAGE,
	UUID_REGEX,
} from '../../constants/validation.constants';
import { requiredString } from '../base.schema';
import { REFRESH_TOKEN_COOKIE_NAME } from '../../constants/auth.constants';

enum DeviceType {
	MOBILE = 'mobile',
	DESKTOP = 'desktop',
	TABLET = 'tablet',
}

export const DeviceTypeSchema = z.nativeEnum(DeviceType).openapi({
	description: 'Type of device being used by the user',
	example: DeviceType.MOBILE,
});

export const loginSchemaName = 'LoginRequest';

export const loginSchema = z
	.object({
		email: requiredString('Email').email('Invalid email address').openapi({
			description: 'Email address of the user',
			example: 'user@example.com',
		}),
		password: requiredString('Password').openapi({
			description: 'User’s plain text password',
			example: 'P@ssw0rd!',
		}),
		deviceId: requiredString('Device ID')
			.regex(UUID_REGEX, UUID_ERROR_MESSAGE)
			.openapi({
				description: 'UUID identifying the device',
				example: '550e8400-e29b-41d4-a716-446655440000',
			}),
		deviceType: DeviceTypeSchema,
		deviceName: requiredString('Device name')
			.regex(
				PLAIN_TEXT_WITH_EMOJI_REGEX,
				PLAIN_TEXT_WITH_EMOJI_ERROR_MESSAGE
			)
			.openapi({
				description:
					'Friendly name for the device, can contain text and emojis.',
				example: 'John’s iPhone 📱',
			}),
	})
	.strict()
	.openapi({
		ref: loginSchemaName,
		description: 'Schema for user login payload.',
		examples: [
			{
				email: 'john.doe@example.com',
				password: 'Secret123!',
				deviceId: '550e8400-e29b-41d4-a716-446655440000',
				deviceType: DeviceType.MOBILE,
				deviceName: 'iPhone',
			},
		],
	});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const googleAuthSchemaName = 'GoogleAuth';

export const googleAuthSchema = z
	.object({
		code: requiredString('Google auth code').openapi({
			description: 'Authorization code returned by Google OAuth2 flow',
			example: '4/0AX4XfWhgS-xyz123',
		}),
	})
	.strict()
	.openapi({
		ref: googleAuthSchemaName,
		description: 'Schema for Google OAuth2 login payload.',
	});

export type GoogleAuthSchemaType = z.infer<typeof googleAuthSchema>;

export const refreshTokenCookiesSchemaRef = 'RefreshTokenRequest';

export const refreshTokenCookiesSchema = z
	.object({
		[REFRESH_TOKEN_COOKIE_NAME]: requiredString('Refresh token').openapi({
			description: 'Refresh token used to obtain new access token',
			example: 'efh8923h2ofhwcoinq2f8092qh4f289gheqfnoq24389gefhn2318q09wf0hio2nhq82923fc23qf',
		})
	})
	.strict()
	.openapi({
		ref: refreshTokenCookiesSchemaRef,
		description: 'Schema for cookies refresh token payload.',
	});

export type RefreshTokenCookiesSchemaType = z.infer<typeof refreshTokenCookiesSchema>;


export const logoutCookiesSchemaRef = 'Logout';

export const logoutCookiesSchema = z
	.object({
		[REFRESH_TOKEN_COOKIE_NAME]: requiredString('Refresh token').openapi({
			description: 'Refresh token used to obtain new access token',
			example: 'efh8923h2ofhwcoinq2f8092qh4f289gheqfnoq24389gefhn2318q09wf0hio2nhq82923fc23qf',
		})
	})
	.strict()
	.openapi({
		ref: logoutCookiesSchemaRef,
		description: 'Schema for cookies refresh token payload.',
	});

export type LogoutCookiesSchemaType = z.infer<typeof logoutCookiesSchema>;
