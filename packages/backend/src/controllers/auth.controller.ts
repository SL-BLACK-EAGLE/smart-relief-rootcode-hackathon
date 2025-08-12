import { Request, Response } from 'express';
import { validate, RegisterInput, LoginInput, registerSchema, loginSchema } from '@smartrelief/shared';
import { registerUser, loginUser } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const body = validate<RegisterInput>(registerSchema, req.body);
    const { user, token } = await registerUser(body.email, body.password, body.role, body.profile);
    res.status(201).json({ success: true, data: { user, token } });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const body = validate<LoginInput>(loginSchema, req.body);
    const { user, token } = await loginUser(body.email, body.password);
    res.json({ success: true, data: { user, token } });
  } catch (err: any) {
    res.status(err.status || 401).json({ success: false, error: err.message || 'Invalid credentials' });
  }
};
