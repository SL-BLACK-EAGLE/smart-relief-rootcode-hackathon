import { Router } from 'express';
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

// All routes require authentication (would need auth middleware)
router.post('/book', bookAppointment);
router.get('/user/:userId', getUserAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id/reschedule', rescheduleAppointment);
router.put('/:id/cancel', cancelAppointment);
router.put('/:id/check-in', checkInAppointment);
router.put('/:id/complete', completeAppointment); // Admin only
router.post('/:id/feedback', submitAppointmentFeedback);

export { router as appointmentsRouter };
