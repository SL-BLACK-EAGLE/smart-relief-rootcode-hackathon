import { Router } from 'express';

const router = Router();

// Minimal OpenAPI stub for key endpoints (extend as needed)
const spec = {
  openapi: '3.0.0',
  info: { title: 'SmartRelief API', version: '0.1.0' },
  paths: {
    '/health': { get: { summary: 'Health', responses: { '200': { description: 'OK' } } } },
    '/api/auth/register': {
      post: { summary: 'Register', responses: { '201': { description: 'Created' }, '409': { description: 'Conflict' } } }
    },
    '/api/auth/login': { post: { summary: 'Login', responses: { '200': { description: 'OK' }, '401': { description: 'Unauthorized' } } } },
    '/api/analytics/summary': {
      get: {
        summary: 'Analytics summary',
        parameters: [
          { name: 'granularity', in: 'query', schema: { type: 'string', enum: ['hour', 'day', 'week', 'month'] } },
          { name: 'start', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'end', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'eventType', in: 'query', schema: { type: 'string' } }
        ],
        responses: { '200': { description: 'Summary series' } }
      }
    },
    '/api/ai/damage/analyze-url': {
      post: {
        summary: 'Analyze damage from image URL',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { fileUrl: { type: 'string' }, latitude: { type: 'number' }, longitude: { type: 'number' } }, required: ['fileUrl'] } } } },
        responses: { '200': { description: 'Analysis result' } },
      },
    },
    '/api/aid-requests': {
      get: { summary: 'List aid requests', responses: { '200': { description: 'List' } } },
      post: { summary: 'Create aid request', responses: { '201': { description: 'Created' } } },
    },
    '/api/aid-requests/{id}': { get: { summary: 'Get aid request', parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'OK' } } } },
    '/api/aid-requests/{id}/analyze': { post: { summary: 'Analyze aid request image', parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'OK' } } } },
    '/api/resources': { get: { summary: 'List resources' }, post: { summary: 'Create resource' } },
    '/api/resources/{id}': { patch: { summary: 'Update resource', parameters: [{ name: 'id', in: 'path', required: true }] } },
    '/api/resources/allocate': { post: { summary: 'Allocate resource to aid request' } },
    '/api/volunteers/tasks': { get: { summary: 'List volunteer tasks' }, post: { summary: 'Assign volunteer task' } },
    '/api/volunteers/tasks/{id}': { patch: { summary: 'Update volunteer task', parameters: [{ name: 'id', in: 'path', required: true }] } },
    '/api/donations': { get: { summary: 'List donations' }, post: { summary: 'Create donation' } },
    '/api/notifications': { get: { summary: 'List notifications' }, post: { summary: 'Create notification' } },
    '/api/notifications/mark-all-read': { post: { summary: 'Mark all notifications as read' } },
    '/api/notifications/{id}/read': { patch: { summary: 'Mark notification as read', parameters: [{ name: 'id', in: 'path', required: true }] } },
    // Queue endpoints
    '/api/queue/join': { post: { summary: 'Join queue (auth)' } },
    '/api/queue/{id}/position': {
      get: { summary: 'Get queue position (auth)', parameters: [{ name: 'id', in: 'path', required: true }] }
    },
    '/api/queue/{id}/leave': {
      put: { summary: 'Leave queue (auth)', parameters: [{ name: 'id', in: 'path', required: true }] }
    },
    '/api/queue/service/{serviceId}': {
      get: { summary: 'List service queue (admin)', parameters: [{ name: 'serviceId', in: 'path', required: true }] }
    },
    '/api/queue/service/{serviceId}/call-next': {
      post: { summary: 'Call next in queue (admin)', parameters: [{ name: 'serviceId', in: 'path', required: true }] }
    },
    '/api/queue/service/{serviceId}/current': {
      get: { summary: 'Get currently serving (admin)', parameters: [{ name: 'serviceId', in: 'path', required: true }] }
    }
  }
};

router.get('/', (_req, res) => res.json(spec));

export { router as openapiRouter };
