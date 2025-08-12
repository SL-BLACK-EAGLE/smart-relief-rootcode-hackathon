import { ZodTypeAny } from 'zod';

export const validate = <T>(schema: ZodTypeAny, data: unknown): T => {
  const res = schema.safeParse(data);
  if (!res.success) {
    const msg = res.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    const err = new Error(msg);
    (err as any).status = 422;
    throw err;
  }
  return res.data as T;
};
