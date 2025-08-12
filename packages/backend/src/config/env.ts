import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load env files relative to the backend package root
const backendRoot = path.resolve(__dirname, '../..');
dotenv.config({ path: path.join(backendRoot, '.env.local') });
dotenv.config({ path: path.join(backendRoot, '.env') });

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 chars'),
  JWT_EXPIRES_IN: z.string().default('86400'),
  CORS_ORIGIN: z.string().default('*'),
  AI_BASE_URL: z.string().default('http://localhost:8000/api/v1'),
  SOCKET_AUTH_REQUIRED: z.string().default('false'),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
  // eslint-disable-next-line no-console
  console.error(`Environment validation failed: ${issues}`);
  throw new Error('Invalid environment configuration');
}

const data = parsed.data;

const corsOrigins = data.CORS_ORIGIN === '*' || data.CORS_ORIGIN.trim() === ''
  ? '*'
  : data.CORS_ORIGIN.split(',').map(s => s.trim()).filter(Boolean);

export const env = {
  ...data,
  PORT: parseInt(data.PORT, 10) || 3000,
  JWT_EXPIRES_IN: parseInt(data.JWT_EXPIRES_IN, 10) || 86400,
  corsOrigins,
  socketAuthRequired: /^(1|true|yes)$/i.test(data.SOCKET_AUTH_REQUIRED),
};

export type Env = typeof env;
