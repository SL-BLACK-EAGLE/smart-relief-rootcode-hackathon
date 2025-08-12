import { z } from 'zod';

export const resourceCategoryEnum = z.enum([
  'MEDICAL',
  'FOOD',
  'WATER',
  'SHELTER',
  'CLOTHING',
  'TRANSPORTATION',
  'COMMUNICATION',
  'RESCUE',
  'EVACUATION',
  'OTHER',
]);

export const createResourceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: resourceCategoryEnum,
  quantity: z.number().int().nonnegative().default(0),
  unit: z.string().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().optional(),
  expiryDate: z.string().datetime().optional(),
  estimatedValue: z.number().optional(),
  donorId: z.string().uuid().optional(),
  organizationId: z.string().optional(),
});

export const updateResourceSchema = createResourceSchema.partial();

export const allocateResourceSchema = z.object({
  resourceId: z.string().uuid(),
  aidRequestId: z.string().uuid(),
  quantityAllocated: z.number().int().positive(),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;
export type AllocateResourceInput = z.infer<typeof allocateResourceSchema>;
