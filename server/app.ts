import express, { type Express } from 'express';
import { checkEnv, NODE_ENV } from './config/env';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import { xssClean } from './middlewares/xssClean';
import { errorHandler } from './middlewares/error.middleware';

checkEnv();

const app: Express = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan(NODE_ENV === 'production' ? 'common' : 'dev'));
app.use(hpp());
app.use(ExpressMongoSanitize());
app.use(xssClean);

// Routes

// Error handler
app.use(errorHandler);

export default app;
