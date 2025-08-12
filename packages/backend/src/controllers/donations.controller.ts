import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express.types';
import { validate, createDonationSchema, type CreateDonationInput } from '@smartrelief/shared';
import { createDonationService, listDonationsService } from '../services/donation.service';

export const listDonations = async (_req: AuthenticatedRequest, res: Response) => {
  const donations = await listDonationsService();
  res.json(donations);
};

export const createDonation = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const data = validate<CreateDonationInput>(createDonationSchema, req.body);
  const donation = await createDonationService(req.user.id, data);
  res.status(201).json(donation);
};
