import { Router } from 'express';
import { governmentServicesRouter } from './government-services.routes';
import { appointmentsRouter } from './appointments.routes';
import { queueRouter } from './queue.routes';
import { aiRouter } from './ai.routes';
import { authRouter } from './auth.routes';
import { usersRouter } from './users.routes';
import { aidRequestsRouter } from './aid-requests.routes';
import { notificationsRouter } from './notifications.routes';
import { resourcesRouter } from './resources.routes';
import { volunteersRouter } from './volunteers.routes';
import { donationsRouter } from './donations.routes';
import { analyticsRouter } from './analytics.routes';
import { openapiRouter } from './openapi.routes';

const router = Router();

// Government Services API routes
router.use('/api/government-services', governmentServicesRouter);
router.use('/api/appointments', appointmentsRouter);
router.use('/api/queue', queueRouter);
router.use('/api/ai', aiRouter);
router.use('/api/auth', authRouter);
router.use('/api/users', usersRouter);
router.use('/api/aid-requests', aidRequestsRouter);
router.use('/api/notifications', notificationsRouter);
router.use('/api/resources', resourcesRouter);
router.use('/api/volunteers', volunteersRouter);
router.use('/api/donations', donationsRouter);
router.use('/api/analytics', analyticsRouter);
router.use('/openapi', openapiRouter);

export { router as apiRouter };
