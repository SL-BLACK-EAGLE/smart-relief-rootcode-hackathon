import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { env } from './config/env';
import { apiRouter } from './routes';
import { authMiddleware } from './middleware/auth.middleware';
import { corsMiddleware } from './middleware/cors.middleware';
import { apiRateLimiter } from './middleware/rate-limit.middleware';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();

// Security & middleware
app.use(helmet());
app.use(corsMiddleware);
app.use(morgan('dev'));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);

// Basic rate limit
app.use(apiRateLimiter);

// Health
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'backend' }));

// API routes
app.use('/', apiRouter);

// 404
app.use((req, res) => {
	res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.path}` });
});

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
	const status = err.status || 500;
	res.status(status).json({ success: false, message: err.message || 'Internal Server Error' });
});

export default app;

