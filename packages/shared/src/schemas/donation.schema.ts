import { z } from 'zod';

export const createDonationSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  allocation: z.record(z.any()).optional(),
  impactMetrics: z.record(z.any()).optional(),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
  receiptUrl: z.string().url().optional(),
  isRecurring: z.boolean().optional(),
  recurringPeriod: z.string().optional(),
});

export type CreateDonationInput = z.infer<typeof createDonationSchema>;
