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
import { SERVER_ROUTES } from '@shared/constants/routes.constants';
import { generatePath } from '@shared/services/app.shared-service';
import { buildOpenApiDoc } from './config/doc.config';
import swaggerUi from 'swagger-ui-express';

checkEnv();

const app: Express = express();

const openApiDocument = buildOpenApiDoc();

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
app.get("/openapi.json", (req, res) => {
  res.json(openApiDocument);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use(
	generatePath([
		SERVER_ROUTES.BASE,
		SERVER_ROUTES.USER.version,
		SERVER_ROUTES.USER.BASE,
	]),
	userRoutes
);
app.use(
	generatePath([
		SERVER_ROUTES.BASE,
		SERVER_ROUTES.AUTH.version,
		SERVER_ROUTES.AUTH.BASE,
	]),
	authRoutes
);

// Error handler
app.use(errorHandler);

export default app;
