import prisma from '../config/database';

export const notifyUser = async (userId: string, title: string, message: string) => {
  return prisma.notification.create({ data: { userId, title, message, isRead: false } });
};

export const listNotificationsService = async (userId: string, opts: { page?: number; limit?: number; isRead?: boolean }) => {
  const page = Math.max(1, opts.page || 1);
  const limit = Math.min(100, Math.max(1, opts.limit || 20));
  const skip = (page - 1) * limit;
  const where = { userId, ...(typeof opts.isRead === 'boolean' ? { isRead: opts.isRead } : {}) } as const;
  const [items, total] = await Promise.all([
    prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.notification.count({ where }),
  ]);
  return { items, page, limit, total };
};

export const markNotificationReadService = (id: string) =>
  prisma.notification.update({ where: { id }, data: { isRead: true, readAt: new Date() } });

export const markAllAsReadService = (userId: string) =>
  prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true, readAt: new Date() } });
