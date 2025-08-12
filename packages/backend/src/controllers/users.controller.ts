import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express.types';
import { validate, UpdateProfileInput, updateProfileSchema, updatePasswordSchema } from '@smartrelief/shared';
import { getMe, updateMyProfile, updateMyPassword } from '../services/user.service';

export const me = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = await getMe(req.user!.id);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const payload = validate<UpdateProfileInput>(updateProfileSchema, req.body);
    const data = await updateMyProfile(req.user!.id, payload);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message || 'Failed to update profile' });
  }
};

export const updatePassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = validate<{ currentPassword: string; newPassword: string }>(
      updatePasswordSchema,
      req.body
    );
    const data = await updateMyPassword(req.user!.id, currentPassword, newPassword);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message || 'Failed to update password' });
  }
};
