import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import {
  bookAppointment,
  getUserAppointments,
  getAppointmentById,
  rescheduleAppointment,
  cancelAppointment,
  checkInAppointment,
  completeAppointment,
  submitAppointmentFeedback
} from '../controllers/appointments.controller';

const router = Router();

// All routes require authentication
router.post('/book', requireAuth, bookAppointment);
router.get('/user/:userId', requireAuth, getUserAppointments);
router.get('/:id', requireAuth, getAppointmentById);
router.put('/:id/reschedule', requireAuth, rescheduleAppointment);
router.put('/:id/cancel', requireAuth, cancelAppointment);
router.put('/:id/check-in', requireAuth, checkInAppointment);
router.put('/:id/complete', requireAuth, completeAppointment); // Admin only (checked in controller)
router.post('/:id/feedback', requireAuth, submitAppointmentFeedback);

export { router as appointmentsRouter };
