import { Response } from 'express';
import { validate } from '@smartrelief/shared';
import {
  createNotificationSchema,
  listNotificationsQuerySchema,
  type CreateNotificationInput,
  type ListNotificationsQuery,
} from '@smartrelief/shared';
import { AuthenticatedRequest } from '../types/express.types';
import { getIO } from '../config/socket';
import { listNotificationsService, markAllAsReadService, markNotificationReadService, notifyUser } from '../services/notification.service';

export const listNotifications = async (req: AuthenticatedRequest, res: Response) => {
  const query = validate<ListNotificationsQuery>(listNotificationsQuerySchema, req.query);
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const isReadFilter = query.isRead ? query.isRead === 'true' : undefined;
  const result = await listNotificationsService(req.user!.id, {
    page,
    limit,
    isRead: typeof isReadFilter === 'boolean' ? isReadFilter : undefined,
  });
  res.json({ items: result.items, page: result.page, limit: result.limit, total: result.total });
};

export const createNotification = async (req: AuthenticatedRequest, res: Response) => {
  const data = validate<CreateNotificationInput>(createNotificationSchema, req.body);
  const userId = data.userId || req.user?.id;
  if (!userId) return res.status(400).json({ message: 'userId required' });

  const created = await notifyUser(userId, data.title, data.message);
  getIO()?.to(userId).emit('notification:new', created);
  res.status(201).json(created);
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const updated = await markNotificationReadService(id);
  getIO()?.to(updated.userId).emit('notification:read', { id });
  res.json(updated);
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const result = await markAllAsReadService(userId);
  getIO()?.to(userId).emit('notification:read-all');
  res.json({ updated: result.count });
};
