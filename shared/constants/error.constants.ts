export enum ErrorName {
	NOT_FOUND = 'NotFoundError',
	BAD_REQUEST = 'BadRequestError',
	UNAUTHORIZED = 'UnauthorizedError',
	FORBIDDEN = 'ForbiddenError',
	CONFLICT = 'ConflictError',
	APP_ERROR = 'AppError',
	VALIDATION_ERROR = 'ValidationError',
	INTERNAL_SERVER_ERROR = 'InternalServerError',
	ERROR = 'Error',
}

export const errorStatusMap: Partial<Record<ErrorName, number>> = {
	[ErrorName.BAD_REQUEST]: 400,
	[ErrorName.UNAUTHORIZED]: 401,
	[ErrorName.FORBIDDEN]: 403,
	[ErrorName.NOT_FOUND]: 404,
	[ErrorName.CONFLICT]: 409,
	[ErrorName.INTERNAL_SERVER_ERROR]: 500,
	[ErrorName.ERROR]: 500,
	[ErrorName.VALIDATION_ERROR]: 422,
};
