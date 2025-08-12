import { z } from 'zod';

export const notificationTypeEnum = z.enum(['INFO', 'WARNING', 'EMERGENCY', 'SUCCESS']);

export const createNotificationSchema = z.object({
  userId: z.string().uuid().optional(),
  title: z.string().min(1),
  message: z.string().min(1),
  type: notificationTypeEnum.default('INFO'),
  data: z.record(z.any()).optional(),
});

export const listNotificationsQuerySchema = z.object({
  isRead: z.enum(['true', 'false']).optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type ListNotificationsQuery = z.infer<typeof listNotificationsQuerySchema>;
