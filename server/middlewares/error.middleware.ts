import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import logger from '../config/logger';
import { NODE_ENV } from '../config/env';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
	let message = 'Internal server error';

	if (err instanceof ZodError) {
		statusCode = 400;
		message = 'Validation error';
		const errors = err.errors.map((e) => ({
			field: e.path.join('.'),
			message: e.message,
		}));

		logger.warn(`Validation error on ${req.method} ${req.path}:`, errors);
		res.status(statusCode).json({ success: false, message, errors });
		return;
	}

	if (err instanceof Error) {
		message = err.message;

		if (message.includes('jwt')) {
			statusCode = 401;
		}

		logger.error(`[${req.method}] ${req.path} - ${message}`);
	}

	res.status(statusCode).json({
		success: false,
		message,
		stack: NODE_ENV === 'development' ? (err as Error).stack : undefined,
	});
};
