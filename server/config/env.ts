import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnvVars = ['MONGO_URI'];

export const checkEnv = (): void => {
	requiredEnvVars.forEach((envVar) => {
		if (!process.env[envVar]) {
			throw new Error(`Missing required environment variable: ${envVar}`);
		}
	});
};

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
export const MONGO_URI = process.env.MONGO_URI || '';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'secret_refresh';
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'secret_access';
export const JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '15m';
export const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
