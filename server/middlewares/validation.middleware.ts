// middlewares/validateBodySchemas.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../utils/error.utils';
import { flattenZodError, validateObjectIds } from '../utils/zod.utils';

export const validateBodySchema = (schema: ZodSchema<any>) => {
	return (req: Request, _res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			const flatErrors = flattenZodError(result.error.format());
			throw new ValidationError('Body validation failed', flatErrors);
		}

		validateObjectIds(result.data);

		req.body = result.data;
		next();
	};
};

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
