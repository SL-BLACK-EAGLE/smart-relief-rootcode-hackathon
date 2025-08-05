import { Router } from 'express';
import {
  getGovernmentServices,
  getGovernmentServiceById,
  createGovernmentService,
  updateGovernmentService,
  deleteGovernmentService,
  getServiceAvailability,
  getServiceCategories,
  searchGovernmentServices
} from '../controllers/government-services.controller';

const router = Router();

// Public routes
router.get('/', getGovernmentServices);
router.get('/search', searchGovernmentServices);
router.get('/categories', getServiceCategories);
router.get('/:id', getGovernmentServiceById);
router.get('/:id/availability', getServiceAvailability);

// Admin only routes (would need auth middleware)
router.post('/', createGovernmentService);
router.put('/:id', updateGovernmentService);
router.delete('/:id', deleteGovernmentService);

export { router as governmentServicesRouter };
