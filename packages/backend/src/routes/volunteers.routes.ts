import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { assignVolunteerSchema, updateVolunteerTaskSchema } from '@smartrelief/shared';
import { assignVolunteer, listVolunteerTasks, updateVolunteerTask, findVolunteersNearAidRequest } from '../controllers/volunteers.controller';

const router = Router();

router.get('/tasks', requireAuth, listVolunteerTasks);
router.post('/tasks', requireAuth, validateBody(assignVolunteerSchema as any), assignVolunteer);
router.patch('/tasks/:id', requireAuth, validateBody(updateVolunteerTaskSchema as any), updateVolunteerTask);
router.get('/near/aid-requests/:id', requireAuth, findVolunteersNearAidRequest);

export { router as volunteersRouter };
