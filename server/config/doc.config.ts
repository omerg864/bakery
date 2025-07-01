// server/config/doc.config.ts
import { z, ZodTypeAny } from 'zod';
import {
	extendZodWithOpenApi,
	createSchema,
	createDocument,
	SchemaResult,
} from 'zod-openapi';

import { ErrorName, errorStatusMap } from '@shared/constants/error.constants';
import { BaseSchema, errorSchema } from '@shared/schemas/base.schema';

extendZodWithOpenApi(z);

export type MethodType = 'get' | 'post' | 'put' | 'patch' | 'delete';
export type AuthenticatedUser = 'none' | 'user' | 'admin';
export type ParamType = 'path' | 'query' | 'cookie';

type ParamsOpenApiSchema = {
	name: string;
	in: ParamType;
	required: boolean;
	schema: SchemaResult;
};

export interface AddDocRouteParams {
	name: string; // name of the route, used for schema names
	route: string;
	method: MethodType;
	summary: string;
	requestSchemas?: {
		params?: ZodTypeAny;
		query?: ZodTypeAny;
		body?: ZodTypeAny;
		cookies?: ZodTypeAny;
	};
	responses: Record<
		number,
		{ description: string; schema?: ZodTypeAny; cookies?: string }
	>;
	baseSchemas?: BaseSchema[];
	errors?: ErrorName[];
	authenticatedUser: AuthenticatedUser;
	tags?: string[]; // tags for the route, used for grouping in OpenAPI
}

const schemas: Record<string, any> = {};
const paths: Record<string, any> = {};

const expressRouteToOpenApiRoute = (p: string) =>
	p.replace(/:([A-Za-z0-9_]+)/g, '{$1}');

function addZodSchema(name: string, schema: ZodTypeAny): boolean {
	const openApiSchema = createSchema(schema);
	if (openApiSchema.components) {
		schemas[name] = Object.values(openApiSchema.components)[0];
		return true;
	}
	return false;
}

function generateParamDocFromSchema(
	name: string,
	schema: ZodTypeAny | undefined,
	loc: ParamType
): ParamsOpenApiSchema[] {
	const params = [];
	if (!name || !schema) return [];
	const addedSchema = addZodSchema(`${name}`, schema);
	if (!addedSchema) return [];
	if (schema instanceof z.ZodObject) {
		for (const [k, v] of Object.entries(schema.shape)) {
			params.push({
				name: k,
				in: loc,
				required: true,
				schema: createSchema(v as ZodTypeAny),
			});
		}
	}
	return params;
}

export function addDocRoute(params: AddDocRouteParams) {
	const {
		authenticatedUser,
		route,
		method,
		responses,
		name,
		requestSchemas,
		summary,
		tags,
		baseSchemas = [],
	} = params;
	let { errors = [] } = params;
	const openApiPath = expressRouteToOpenApiRoute(route);
	const op: any = { summary, parameters: [], responses: {}, tags };

	if (authenticatedUser !== 'none') {
		if (!errors.includes(ErrorName.UNAUTHORIZED)) {
			errors.push(ErrorName.UNAUTHORIZED);
		}
		op.security = [{ bearerAuth: [] }];
	}

	for (const baseSchema of baseSchemas) {
		addZodSchema(baseSchema.name, baseSchema.schema);
	}

	const pathParams = generateParamDocFromSchema(
		`${name}:params`,
		requestSchemas?.params,
		'path'
	);
	if (pathParams.length > 0) {
		if (!errors.includes(ErrorName.VALIDATION_ERROR)) {
			errors.push(ErrorName.VALIDATION_ERROR);
		}
		op.parameters.push(...pathParams);
	}

	const queryParams = generateParamDocFromSchema(
		`${name}:query`,
		requestSchemas?.query,
		'query'
	);

	if (queryParams.length > 0) {
		if (!errors.includes(ErrorName.VALIDATION_ERROR)) {
			errors.push(ErrorName.VALIDATION_ERROR);
		}
		op.parameters.push(...queryParams);
	}

	const cookieParams = generateParamDocFromSchema(
		`${name}:cookies`,
		requestSchemas?.cookies,
		'cookie'
	);

	if (cookieParams.length > 0) {
		if (!errors.includes(ErrorName.VALIDATION_ERROR)) {
			errors.push(ErrorName.VALIDATION_ERROR);
		}
		op.parameters.push(...cookieParams);
	}

	if (requestSchemas?.body) {
		const addedSchema = addZodSchema(`${name}:body`, requestSchemas?.body);
		if (addedSchema) {
			if (!errors.includes(ErrorName.VALIDATION_ERROR)) {
				errors.push(ErrorName.VALIDATION_ERROR);
			}
			op.requestBody = {
				required: true,
				content: {
					'application/json': {
						schema: { $ref: `#/components/schemas/${name}:body` },
					},
				},
			};
		}
	}

	for (const [statusCode, { description, schema, cookies }] of Object.entries(
		responses
	)) {
		if (schema) {
			const addedSchema = addZodSchema(
				`${name}:response${statusCode}`,
				schema
			);
			if (addedSchema) {
				const cookiesOpenApi = cookies
					? {
							headers: {
								'Set-Cookie': {
									description: cookies,
									schema: {
										type: 'string',
									},
								},
							},
						}
					: undefined;
				op.responses[statusCode] = {
					description,
					...cookiesOpenApi,
					content: {
						'application/json': {
							schema: {
								$ref: `#/components/schemas/${name}:response${statusCode}`,
							},
						},
					},
				};
			}
		} else {
			op.responses[statusCode] = { description };
		}
	}

	for (const err of errors) {
		const status = errorStatusMap[err] ?? 500;
		op.responses[status] = {
			description: err,
			content: {
				'application/json': {
					schema: { $ref: `#/components/schemas/${err}` },
				},
			},
		};
	}

	paths[openApiPath] ??= {};
	paths[openApiPath][method] = op;
}

function addErrorComponents() {
	const errorNames = Object.values(ErrorName);
	errorNames.forEach((name) => {
		const status = errorStatusMap[name] ?? 500;
		const customErrorSchema = errorSchema
			.extend({
				name: z.string().openapi({
					description: 'Error class name.',
					example: name,
				}),
			})
			.openapi({
				ref: name,
				description: `${name} response`,
			});
		addZodSchema(name, customErrorSchema);
	});
}

export function buildOpenApiDoc() {
	addErrorComponents();
	return createDocument({
		openapi: '3.0.0',
		info: { title: 'My API', version: '1.0.0' },
		paths,
		components: {
			schemas,
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	});
}
