import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { trackEvent, listEvents, summary } from '../controllers/analytics.controller';

const router = Router();

router.post('/track', requireAuth, trackEvent);
router.get('/', requireAuth, listEvents);
router.get('/summary', requireAuth, summary);

export { router as analyticsRouter };
