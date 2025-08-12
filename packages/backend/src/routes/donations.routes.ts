import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { createDonationSchema } from '@smartrelief/shared';
import { createDonation, listDonations } from '../controllers/donations.controller';

const router = Router();

router.get('/', requireAuth, listDonations);
router.post('/', requireAuth, validateBody(createDonationSchema as any), createDonation);

export { router as donationsRouter };
