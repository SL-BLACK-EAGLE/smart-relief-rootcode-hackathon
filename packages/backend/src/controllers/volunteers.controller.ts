import { Response } from 'express';
import prisma from '../config/database';
import { writeAuditLog } from '../utils/audit';
import { AuthenticatedRequest } from '../types/express.types';
import { validate, assignVolunteerSchema, updateVolunteerTaskSchema, type AssignVolunteerInput, type UpdateVolunteerTaskInput } from '@smartrelief/shared';
import { assignVolunteerService, findVolunteersNearAidService, listVolunteerTasksService, updateVolunteerTaskService } from '../services/volunteer.service';

export const listVolunteerTasks = async (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.query as { status?: string };
  const tasks = await listVolunteerTasksService(status);
  res.json(tasks);
};

export const assignVolunteer = async (req: AuthenticatedRequest, res: Response) => {
  const input = validate<AssignVolunteerInput>(assignVolunteerSchema, req.body);
  // basic validations
  const result = await assignVolunteerService(input);
  if ((result as any).error) return res.status(404).json({ message: (result as any).error });
  const task = (result as any).task;
  await writeAuditLog({
    userId: req.user?.id,
    action: 'VOLUNTEER_ASSIGN',
    resource: 'VolunteerTask',
    resourceId: task.id,
    oldValues: null,
    newValues: task,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || null,
  });
  res.status(201).json(task);
};

export const updateVolunteerTask = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const input = validate<UpdateVolunteerTaskInput>(updateVolunteerTaskSchema, req.body);
  const updated = await updateVolunteerTaskService(id, input);
  await writeAuditLog({
    userId: req.user?.id,
    action: 'VOLUNTEER_TASK_UPDATE',
    resource: 'VolunteerTask',
    resourceId: id,
    oldValues: null,
    newValues: updated,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || null,
  });
  res.json(updated);
};

export const findVolunteersNearAidRequest = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const { radiusKm = '10' } = req.query as any;
  const radius = Math.max(1, Math.min(200, Number(radiusKm)));
  const result = await findVolunteersNearAidService(id, radius);
  if ((result as any).error) return res.status(404).json({ message: (result as any).error });
  res.json({ items: (result as any).items, radiusKm: radius });
};
