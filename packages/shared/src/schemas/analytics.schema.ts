import { z } from 'zod';

export const trackEventSchema = z.object({
  eventType: z.string().min(1),
  data: z.record(z.any()),
  timestamp: z.string().datetime().optional(),
});

export const listEventsQuerySchema = z.object({
  eventType: z.string().optional(),
  userId: z.string().uuid().optional(),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type TrackEventInput = z.infer<typeof trackEventSchema>;
export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>;

export const summaryGranularityEnum = z.enum(['hour', 'day', 'week', 'month']).default('day');

export const analyticsSummaryQuerySchema = z.object({
  eventType: z.string().optional(),
  userId: z.string().uuid().optional(),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  granularity: summaryGranularityEnum.optional(),
});

export type AnalyticsSummaryQuery = z.infer<typeof analyticsSummaryQuerySchema>;
