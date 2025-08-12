import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { createResourceSchema, updateResourceSchema, allocateResourceSchema } from '@smartrelief/shared';
import {
  listResources,
  createResource,
  updateResource,
  allocateResource,
  findResourcesNearAidRequest,
} from '../controllers/resources.controller';

const router = Router();

router.get('/', requireAuth, listResources);
router.post('/', requireAuth, validateBody(createResourceSchema as any), createResource);
router.patch('/:id', requireAuth, validateBody(updateResourceSchema as any), updateResource);
router.post('/allocate', requireAuth, validateBody(allocateResourceSchema as any), allocateResource);
router.get('/near/aid-requests/:id', requireAuth, findResourcesNearAidRequest);

export { router as resourcesRouter };
