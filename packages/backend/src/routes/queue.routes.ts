import { Router } from 'express';
import {
    joinQueue,
    getQueuePosition,
    leaveQueue,
    getServiceQueue,
    callNextInQueue,
    getCurrentlyServing
} from '../controllers/queue.controller';

const router = Router();

// User routes (require authentication)
router.post('/join', joinQueue);
router.get('/:id/position', getQueuePosition);
router.put('/:id/leave', leaveQueue);

// Admin routes
router.get('/service/:serviceId', getServiceQueue);
router.post('/service/:serviceId/call-next', callNextInQueue);
router.get('/service/:serviceId/current', getCurrentlyServing);

export { router as queueRouter };
