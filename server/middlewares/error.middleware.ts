import { NextFunction, Request, Response } from 'express';
import logger from '../config/logger';
import { NODE_ENV } from '../config/env';
import { ErrorName, errorStatusMap } from '@shared/constants/error.constants';

type CustomError = Error & {
	name: string;
	message: string;
	details?: Record<string, string[]>;
};

export type ErrorResponse = {
	success: boolean;
	stack?: string;
	error: {
		name: string;
		message: string;
		details?: Record<string, string[]>;
	};
};

export const errorHandler = (
	err: unknown,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const error = err as CustomError;

	const name = error.name ?? ErrorName.ERROR;
	const status = errorStatusMap[name as ErrorName] ?? 500;

	const response: ErrorResponse = {
		success: false,
		stack: NODE_ENV === 'development' ? error.stack : undefined,
		error: {
			name,
			message: error.message || 'An error occurred',
			details: error.details,
		},
	};

	logger.error(
		`[${req.method}] ${req.path} - ${response.error.message}: ${error.stack} \n ${JSON.stringify(
			error.details
		)}`
	);

	res.status(status).json(response);
};
