import { Router } from 'express';
import { me, updateProfile, updatePassword } from '../controllers/users.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/me', requireAuth, me);
router.patch('/me/profile', requireAuth, updateProfile);
router.post('/me/password', requireAuth, updatePassword);

export { router as usersRouter };
