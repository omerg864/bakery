import { z } from 'zod';
import 'zod-openapi/extend';
import { BaseSchema, requiredString } from '../base.schema';
import { userSchema, userSchemaRef } from '../userSchemas/user.schema';

export const loginSchemaRef = 'LoginResponse';

export const loginResponseSchema = z
	.object({
		success: z.boolean().default(true).openapi({
			description: 'Indicates whether the login was successful',
			example: true,
		}),
		message: z.string().default('Login successful').openapi({
			description: 'Message indicating the result of the login operation',
			example: 'Login successful',
		}),
		accessToken: requiredString('Access Token').openapi({
			description: 'JWT access token for authenticated user',
			example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
		}),
		user: userSchema,
	})
	.strict()
	.openapi({
		ref: loginSchemaRef,
		description: 'Response schema for user login.',
	});
export const loginResponseBaseSchemas: BaseSchema[] = [{
	name: userSchemaRef,
	schema: userSchema,
}];

export type LoginResponseSchemaType = z.infer<typeof loginResponseSchema>;
