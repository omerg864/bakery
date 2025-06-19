import { z } from 'zod';

export const objectIdBrand = 'ObjectId' as const;

export const zObjectId = z
	.string()
	.regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format')
	.brand<typeof objectIdBrand>();
