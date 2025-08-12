import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../types/express.types';
import { validate, AidRequestInput, aidRequestSchema } from '@smartrelief/shared';
import { analyzeAidRequestService, createAidRequestService, listAidRequestsService, updateAidRequestService } from '../services/aid-request.service';

export const createAidRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
    const input = validate<AidRequestInput>(aidRequestSchema, req.body);
    const data = await createAidRequestService(req.user.id, {
      title: input.title,
      description: input.description || '',
      category: input.category,
      priority: input.priority,
      latitude: input.latitude,
      longitude: input.longitude,
      address: input.address,
      images: input.images,
    });
    res.status(201).json({ success: true, data });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message || 'Failed to create aid request' });
  }
};

export const listAidRequests = async (req: Request, res: Response) => {
  try {
    const { category, status, page = '1', limit = '20', userId } = req.query as any;
    const result = await listAidRequestsService({
      category,
      status,
      userId,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
    res.json({ success: true, data: result.items, pagination: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to list aid requests' });
  }
};

export const getAidRequestById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const item = await prisma.aidRequest.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch aid request' });
  }
};

export const updateAidRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.aidRequest.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, error: 'Not found' });
    if (req.user?.id !== existing.userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
  const allowed = ['title', 'description', 'priority', 'status', 'address', 'images'] as const;
  const data: any = {};
  for (const k of allowed) if (k in req.body) data[k] = (req.body as any)[k];
  const updated = await updateAidRequestService(id, data);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to update aid request' });
  }
};

export const analyzeAidRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
  const { imageUrl } = req.body as { imageUrl?: string };
  const item = await prisma.aidRequest.findUnique({ where: { id } });
  if (!item) return res.status(404).json({ success: false, error: 'Not found' });
  if (req.user?.id !== item.userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
  const analyzed = await analyzeAidRequestService(id, imageUrl);
  if ((analyzed as any).error) return res.status(400).json({ success: false, error: (analyzed as any).error });
  if ((analyzed as any).notFound) return res.status(404).json({ success: false, error: 'Not found' });
  res.json({ success: true, data: analyzed });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to analyze image' });
  }
};
