import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express.types';
import {
  validate,
  createResourceSchema,
  updateResourceSchema,
  allocateResourceSchema,
  type CreateResourceInput,
  type UpdateResourceInput,
  type AllocateResourceInput,
} from '@smartrelief/shared';
import prisma from '../config/database';
import { writeAuditLog } from '../utils/audit';
import { allocateResourceService, createResourceService, findResourcesNearAidService, listResourcesService, updateResourceService } from '../services/resource.service';

export const listResources = async (_req: AuthenticatedRequest, res: Response) => {
  const resources = await listResourcesService();
  res.json(resources);
};

export const createResource = async (req: AuthenticatedRequest, res: Response) => {
  const data = validate<CreateResourceInput>(createResourceSchema, req.body);
  const created = await createResourceService(data);
  res.status(201).json(created);
};

export const updateResource = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const data = validate<UpdateResourceInput>(updateResourceSchema, req.body);
  const updated = await updateResourceService(id, data);
  res.json(updated);
};

export const allocateResource = async (req: AuthenticatedRequest, res: Response) => {
  const data = validate<AllocateResourceInput>(allocateResourceSchema, req.body);

  // Check availability
  const resource = await prisma.resource.findUnique({ where: { id: data.resourceId } });
  if (!resource) return res.status(404).json({ message: 'Resource not found' });
  const aid = await prisma.aidRequest.findUnique({ where: { id: data.aidRequestId } });
  if (!aid) return res.status(404).json({ message: 'Aid request not found' });
  if (resource.quantity < data.quantityAllocated) {
    return res.status(400).json({ message: 'Insufficient resource quantity' });
  }

  const result = await allocateResourceService(data);
  if ((result as any).error) return res.status(400).json({ message: (result as any).error });
  const allocation = (result as any).allocation;

  // audit
  await writeAuditLog({
    userId: req.user?.id,
    action: 'RESOURCE_ALLOCATE',
    resource: 'ResourceAllocation',
    resourceId: allocation.id,
    oldValues: null,
    newValues: allocation,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || null,
  });

  res.status(201).json(allocation);
};

export const findResourcesNearAidRequest = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const { radiusKm = '10', category } = req.query as any;
  const radius = Math.max(1, Math.min(200, Number(radiusKm)));
  const result = await findResourcesNearAidService(id, radius, category as string | undefined);
  if ((result as any).error) return res.status(404).json({ message: (result as any).error });
  res.json({ items: (result as any).items, radiusKm: radius });
};
