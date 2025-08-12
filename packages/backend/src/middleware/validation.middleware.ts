import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const validateBody = <T>(schema: ZodSchema<T>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    (req as any).validatedBody = schema.parse(req.body);
    next();
  } catch (err: any) {
    res.status(400).json({ success: false, error: 'Validation failed', details: err.errors || String(err) });
  }
};

export const validateQuery = <T>(schema: ZodSchema<T>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    (req as any).validatedQuery = schema.parse(req.query);
    next();
  } catch (err: any) {
    res.status(400).json({ success: false, error: 'Validation failed', details: err.errors || String(err) });
  }
};

export const validateParams = <T>(schema: ZodSchema<T>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    (req as any).validatedParams = schema.parse(req.params);
    next();
  } catch (err: any) {
    res.status(400).json({ success: false, error: 'Validation failed', details: err.errors || String(err) });
  }
};
