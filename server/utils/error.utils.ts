import { ErrorName } from '@shared/constants/error.constants';

export class NotFoundError extends Error {
	override name = ErrorName.NOT_FOUND;
}
export class BadRequestError extends Error {
	override name = ErrorName.BAD_REQUEST;
}
export class UnauthorizedError extends Error {
	override name = ErrorName.UNAUTHORIZED;
}
export class ForbiddenError extends Error {
	override name = ErrorName.FORBIDDEN;
}
export class ValidationError extends Error {
	override name = ErrorName.VALIDATION_ERROR;
	constructor(
		message = 'Validation error',
		public details?: Record<string, unknown>
	) {
		super(message);
	}
}

export class ServerError extends Error {
	override name = ErrorName.INTERNAL_SERVER_ERROR;
	constructor(message = 'Internal server error') {
		super(message);
	}
}
