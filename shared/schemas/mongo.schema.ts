import { z } from 'zod';
import {
	OBJECT_ID_ERROR_MESSAGE,
	OBJECT_ID_REGEX,
} from '../constants/validation.constants';

export const objectIdBrand = 'ObjectId' as const;

export const zObjectId = z
	.string()
	.trim()
	.regex(OBJECT_ID_REGEX, OBJECT_ID_ERROR_MESSAGE)
	.brand<typeof objectIdBrand>();
