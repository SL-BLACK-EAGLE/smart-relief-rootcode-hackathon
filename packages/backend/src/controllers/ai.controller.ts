import { Request, Response } from 'express';
import { aiIntegrationService } from '../services/ai-integration.service';

export const analyzeDamageFromUrl = async (req: Request, res: Response) => {
  try {
    const { fileUrl, latitude, longitude } = req.body as {
      fileUrl: string;
      latitude?: number;
      longitude?: number;
    };
    if (!fileUrl) return res.status(400).json({ success: false, message: 'fileUrl is required' });
    const result = await aiIntegrationService.assessDamage(fileUrl, latitude, longitude);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(502).json({ success: false, message: 'AI service failed', error: err?.message });
  }
};

export const calculatePriority = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.assessmentId);
    if (Number.isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid assessmentId' });
    const result = await aiIntegrationService.calculatePriority(id);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(502).json({ success: false, message: 'AI service failed', error: err?.message });
  }
};
