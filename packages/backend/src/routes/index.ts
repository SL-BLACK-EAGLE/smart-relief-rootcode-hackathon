import { Router } from 'express';
import { governmentServicesRouter } from './government-services.routes';
import { appointmentsRouter } from './appointments.routes';
import { queueRouter } from './queue.routes';

const router = Router();

// Government Services API routes
router.use('/api/government-services', governmentServicesRouter);
router.use('/api/appointments', appointmentsRouter);
router.use('/api/queue', queueRouter);

export { router as apiRouter };
