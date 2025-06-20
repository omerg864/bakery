export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,24}$/;

export const PASSWORD_ERROR_MESSAGE =
	'Password must be 8-24 characters long, contain at least one uppercase letter, one lowercase letter, and one number.';

export const PLAIN_TEXT_WITH_EMOJI_REGEX =
	/^[\p{L}\p{N}()[\]{}\-.,!?@#$%^&*+=:;'"\s\u{1F300}-\u{1FAFF}]+$/gu;

export const PLAIN_TEXT_WITH_EMOJI_ERROR_MESSAGE =
	'Text can Only contain letters, numbers, allowed symbols, spaces, and emojis.';

export const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export const OBJECT_ID_ERROR_MESSAGE = 'Invalid ObjectId format.';

export const UUID_REGEX =
	/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;

export const UUID_ERROR_MESSAGE = 'Invalid ID format.';