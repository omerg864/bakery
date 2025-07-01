import { z } from 'zod';
import 'zod-openapi/extend';

export type BaseSchema = {
	name: string;
	schema: z.ZodTypeAny;
}

export const requiredString = (label: string) =>
	z
		.string({ required_error: `${label} is required` })
		.trim()
		.nonempty(`${label} cannot be empty`);

export const requiredNumber = (label: string) =>
	z.number({ required_error: `${label} is required` });

export const requiredBoolean = (label: string) =>
	z.boolean({ required_error: `${label} is required` });

export const requiredArray = <T extends z.ZodTypeAny>(
	schema: T,
	label: string
) =>
	z
		.array(schema, { required_error: `${label} is required` })
		.nonempty(`${label} cannot be empty`);

export const errorSchema = z
	.object({
		success: z.boolean().default(false),
		name: requiredString('Error name'),
		message: requiredString('Error message').openapi({
			description: 'Human-readable explanation of the error.',
			example: 'error request',
		}),
		details: z
			.record(z.array(z.string()))
			.optional()
			.openapi({
				description:
					'Optional object containing field-specific error messages.',
				example: {
					email: [
						'Email is required',
						'Email must be a valid email address',
					],
				},
			}),
		stack: z.string().optional().openapi({
			description:
				'Stack trace of the error, only in non-production environments.',
			example:
				'Error: Invalid input\n    at Object.<anonymous> (index.js:5:9)',
		}),
	})
	.strict();
