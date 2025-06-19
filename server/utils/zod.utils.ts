import { Types } from 'mongoose';
import { ZodFormattedError } from 'zod';
import { BadRequestError } from './error.utils';
import { objectIdBrand } from '@shared/schemas/mongo.schema';

export function flattenZodError(
	formattedError: ZodFormattedError<any>
): Record<string, string[]> {
	const result: Record<string, string[]> = {};

	for (const [key, value] of Object.entries(formattedError)) {
		if (key === '_errors') continue; // skip root errors
		const fieldErrors = (value as any)?._errors;
		if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
			result[key] = fieldErrors;
		}
	}

	return result;
}

export function validateObjectIds(data: Record<string, any>): void {
	for (const [key, value] of Object.entries(data)) {
		if ((value as any)?.__brand === objectIdBrand) {
			if (!Types.ObjectId.isValid(value as string)) {
				throw new BadRequestError(`Invalid ObjectId in field '${key}'`);
			}
		}
	}
}
