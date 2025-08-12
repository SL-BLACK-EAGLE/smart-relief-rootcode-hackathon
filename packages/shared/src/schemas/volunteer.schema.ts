import { z } from 'zod';

export const assignVolunteerSchema = z.object({
  aidRequestId: z.string().uuid(),
  volunteerId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  estimatedDuration: z.number().int().positive().optional(),
});

export const updateVolunteerTaskSchema = z.object({
  status: z.enum(['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  completionNotes: z.string().optional(),
  completionPhotos: z.array(z.string()).optional(),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
});

export type AssignVolunteerInput = z.infer<typeof assignVolunteerSchema>;
export type UpdateVolunteerTaskInput = z.infer<typeof updateVolunteerTaskSchema>;
