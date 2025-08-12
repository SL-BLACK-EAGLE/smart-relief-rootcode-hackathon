import cors from 'cors';
import { env } from '../config/env';

export const corsMiddleware = cors({ origin: env.corsOrigins as any, credentials: true });
