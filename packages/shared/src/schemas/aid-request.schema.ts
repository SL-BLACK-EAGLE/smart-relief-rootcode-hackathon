import { z } from 'zod';

export const geoPointSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const aidRequestSchema = z.object({
  userId: z.string().uuid().optional(),
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.enum([
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
  ]),
  priority: z.number().int().min(1).max(10).default(5),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
  images: z.array(z.string().url()).default([]),
});

export type AidRequestInput = z.infer<typeof aidRequestSchema>;
