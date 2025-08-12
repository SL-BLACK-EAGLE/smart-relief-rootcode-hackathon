import { Router } from 'express';
import { analyzeDamageFromUrl, calculatePriority } from '../controllers/ai.controller';

const router = Router();

router.post('/damage/analyze-url', analyzeDamageFromUrl);
router.post('/priority/calculate/:assessmentId', calculatePriority);

export { router as aiRouter };
