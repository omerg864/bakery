import { zObjectId } from './../mongo.schema';
import { z } from 'zod';
import 'zod-openapi/extend';
import { requiredString } from '../base.schema';

export const userSchemaRef = 'User';

export const userSchema = z
	.object({
		id: zObjectId.openapi({
			description: 'Unique identifier for the user.',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		name: requiredString('Name').openapi({
			description: 'Full name of the user.',
			example: 'John Doe',
		}),
		email: requiredString('Email').email('Invalid email address').openapi({
			description: 'Email address of the user.',
			example: 'example@example.com',
		}),
		createdAt: z
			.union([z.string().datetime('Invalid date format'), z.date()])
			.optional()
			.openapi({
				description: 'Date and time when the user was created.',
				example: '2023-10-01T12:00:00Z',
			}),
	})
	.openapi({
		ref: userSchemaRef,
		description: 'Schema representing a user in the system.',
	});

export type UserSchemaType = z.infer<typeof userSchema>;
