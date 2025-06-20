import bcrypt from 'bcrypt';
import crypto from 'crypto';

export function hashCrypto(plainText: string): string {
	return crypto.createHash('sha256').update(plainText).digest('hex');
}

export async function compareBcrypt(
	plainText: string,
	hash: string
): Promise<boolean> {
	return await bcrypt.compare(plainText, hash);
}

export async function hashBcrypt(plainText: string): Promise<string> {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(plainText, salt);
	return hashedPassword;
}
