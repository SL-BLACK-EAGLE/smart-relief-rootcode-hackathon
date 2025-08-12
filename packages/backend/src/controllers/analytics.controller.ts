import { Response } from 'express';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../types/express.types';
import { validate, trackEventSchema, listEventsQuerySchema, analyticsSummaryQuerySchema, type TrackEventInput, type ListEventsQuery, type AnalyticsSummaryQuery } from '@smartrelief/shared';
import { dateBucket, generateBucketRange } from '../utils/analytics';

export const trackEvent = async (req: AuthenticatedRequest, res: Response) => {
  const input = validate<TrackEventInput>(trackEventSchema, req.body);
  const userId = req.user?.id;
  const created = await prisma.analyticsEvent.create({
    data: {
      eventType: input.eventType,
      userId,
      data: input.data as any,
      timestamp: input.timestamp ? new Date(input.timestamp) : undefined,
    },
  });
  res.status(201).json(created);
};

export const listEvents = async (req: AuthenticatedRequest, res: Response) => {
  const q = validate<ListEventsQuery>(listEventsQuerySchema, req.query);
  const page = Number(q.page || 1);
  const limit = Number(q.limit || 20);
  const skip = (page - 1) * limit;
  const where: any = {};
  if (q.userId) where.userId = q.userId;
  if (q.eventType) where.eventType = q.eventType;
  if (q.start || q.end) {
    where.timestamp = {};
    if (q.start) (where.timestamp as any).gte = new Date(q.start);
    if (q.end) (where.timestamp as any).lte = new Date(q.end);
  }
  const [items, total] = await Promise.all([
    prisma.analyticsEvent.findMany({ where, orderBy: { timestamp: 'desc' }, skip, take: limit }),
    prisma.analyticsEvent.count({ where }),
  ]);
  res.json({ items, page, limit, total });
};

export const summary = async (req: AuthenticatedRequest, res: Response) => {
  const q = validate<AnalyticsSummaryQuery>(analyticsSummaryQuerySchema, req.query);
  const where: any = {};
  if (q.userId) where.userId = q.userId;
  if (q.eventType) where.eventType = q.eventType;
  if (q.start || q.end) {
    where.timestamp = {};
    if (q.start) (where.timestamp as any).gte = new Date(q.start);
    if (q.end) (where.timestamp as any).lte = new Date(q.end);
  }
  const events = await prisma.analyticsEvent.findMany({ where, orderBy: { timestamp: 'asc' } });
  const buckets = new Map<string, Record<string, number>>();
  const gran = (q.granularity || 'day') as 'hour' | 'day' | 'week' | 'month';
  for (const ev of events) {
    const bucket = dateBucket(ev.timestamp, gran);
    const type = ev.eventType;
    if (!buckets.has(bucket)) buckets.set(bucket, {});
    const ref = buckets.get(bucket)!;
    ref[type] = (ref[type] || 0) + 1;
  }
  // Optionally pre-fill empty buckets if start/end provided
  let series: Array<{ bucket: string; counts: Record<string, number> }>;
  if (q.start && q.end) {
    const range = generateBucketRange(new Date(q.start), new Date(q.end), gran);
    series = range.map((b) => ({ bucket: b, counts: buckets.get(b) || {} }));
  } else {
    series = Array.from(buckets.entries()).map(([bucket, counts]) => ({ bucket, counts }));
  }
  res.json({ granularity: gran, series });
};
