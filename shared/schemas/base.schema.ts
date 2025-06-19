import { z } from 'zod';

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
