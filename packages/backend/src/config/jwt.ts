import jwt from 'jsonwebtoken';
import { env } from './env';

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN; // seconds

export interface JwtPayload {
	id: string;
	email?: string;
	role?: string;
}

export const signToken = (payload: JwtPayload, options?: jwt.SignOptions) =>
	jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN, ...(options || {}) });

export const verifyToken = (token: string): JwtPayload => jwt.verify(token, JWT_SECRET) as JwtPayload;

