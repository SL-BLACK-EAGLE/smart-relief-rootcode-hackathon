import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['VICTIM', 'DONOR', 'VOLUNTEER', 'ORGANIZATION', 'ADMIN']).default('VICTIM'),
  profile: z
    .object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      phoneNumber: z.string().optional(),
    })
    .partial()
    .optional(),
  acceptTerms: z.boolean().refine((v) => v === true, { message: 'You must accept terms' }),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
