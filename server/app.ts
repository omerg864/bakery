import express, { type Express } from 'express';
import { checkEnv, CLIENT_URL, NODE_ENV } from './config/env';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';
import { xssClean } from './middlewares/xssClean.middleware';
import { errorHandler } from './middlewares/error.middleware';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

checkEnv();

const app: Express = express();

// Middleware
app.use(cookieParser());
app.use(
	cors({
		origin: CLIENT_URL,
		credentials: true,
	})
);
app.use(helmet());
app.use(express.json());
app.use(morgan(NODE_ENV === 'production' ? 'common' : 'dev'));
app.use(hpp());
app.use(xssClean);

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/auth', authRoutes);

// Error handler
app.use(errorHandler);

export default app;
