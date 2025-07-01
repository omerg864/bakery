// middlewares/validateBodySchemas.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../utils/error.utils';
import { flattenZodError, validateObjectIds } from '../utils/zod.utils';

const lowerCaseFields = ['email'];

export const validateBodySchema = (schema: ZodSchema<any>) => {
	return (req: Request, _res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			const flatErrors = flattenZodError(result.error.format());
			throw new ValidationError('Body validation failed', flatErrors);
		}

		validateObjectIds(result.data);

		transformBodyData(result.data);

		req.body = result.data;
		next();
	};
};

function transformBodyData(data: Record<string, any>) {
	// Example transformation: trim all string fields recursively
	if (data === undefined && data === null) return;
	if (Array.isArray(data)) {
		data.forEach((item) => transformBodyData(item));
		return;
	}
	for (const key in data) {
		if (typeof data[key] === 'string') {
			data[key] = data[key].trim();
			if (key in lowerCaseFields) {
				data[key] = data[key].toLowerCase();
			}
		} else {
			transformBodyData(data[key]);
		}
	}
}

export const validateQuerySchema = (schema: ZodSchema<any>) => {
	return (req: Request, _res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.query);

		if (!result.success) {
			const flatErrors = flattenZodError(result.error.format());
			throw new ValidationError('Query validation failed', flatErrors);
		}

		validateObjectIds(result.data);

		req.query = result.data;
		next();
	};
};

export const validateParamsSchema = (schema: ZodSchema<any>) => {
	return (req: Request, _res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.params);

		if (!result.success) {
			const flatErrors = flattenZodError(result.error.format());
			throw new ValidationError('Params validation failed', flatErrors);
		}

		validateObjectIds(result.data);

		req.params = result.data;
		next();
	};
};
