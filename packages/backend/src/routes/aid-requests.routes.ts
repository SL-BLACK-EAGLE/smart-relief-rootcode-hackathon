import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { aidRequestSchema } from '@smartrelief/shared';
import { analyzeAidRequest, createAidRequest, getAidRequestById, listAidRequests, updateAidRequest } from '../controllers/aid-requests.controller';
import { assignVolunteer } from '../controllers/volunteers.controller';
import { allocateResource } from '../controllers/resources.controller';

const router = Router();

router.get('/', listAidRequests);
router.get('/:id', requireAuth, getAidRequestById);
router.post('/', requireAuth, validateBody(aidRequestSchema as any), createAidRequest);
router.patch('/:id', requireAuth, updateAidRequest);
router.post('/:id/analyze', requireAuth, analyzeAidRequest);
// nested operations
router.post('/:id/assign-volunteer', requireAuth, (req, res, next) => {
	// forward with body containing aidRequestId
	req.body = { ...req.body, aidRequestId: req.params.id };
	return (assignVolunteer as any)(req, res, next);
});
router.post('/:id/allocate-resource', requireAuth, (req, res, next) => {
	req.body = { ...req.body, aidRequestId: req.params.id };
	return (allocateResource as any)(req, res, next);
});

export { router as aidRequestsRouter };
