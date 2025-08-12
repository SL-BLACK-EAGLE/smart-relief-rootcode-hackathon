import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import {
  listNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
} from '../controllers/notifications.controller';

const router = Router();

router.get('/', requireAuth, listNotifications);
router.post('/', requireAuth, createNotification);
router.post('/mark-all-read', requireAuth, markAllAsRead);
router.patch('/:id/read', requireAuth, markAsRead);

export { router as notificationsRouter };
