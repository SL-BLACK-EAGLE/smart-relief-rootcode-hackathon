import { Router } from 'express';

const router = Router();

// Comprehensive OpenAPI specification for backend (manually curated from implemented routes)
// NOTE: Schemas are intentionally simplified; extend with exact fields from shared Zod schemas as needed.
const spec: any = {
  openapi: '3.0.1',
  info: {
    title: 'SmartRelief Backend API',
    version: '0.2.0',
    description: 'Full documented endpoints for implemented backend services.'
  },
  servers: [{ url: '/', description: 'Current origin' }],
  tags: [
    { name: 'Auth' },
    { name: 'Users' },
    { name: 'Government Services' },
    { name: 'Aid Requests' },
    { name: 'Queue' },
    { name: 'Appointments' },
    { name: 'Volunteers' },
    { name: 'Resources' },
    { name: 'Donations' },
    { name: 'Notifications' },
    { name: 'Analytics' },
    { name: 'AI (Proxy)' },
    { name: 'System' }
  ],
  components: {
    securitySchemes: {
      BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    schemas: {
      GenericError: {
        type: 'object',
        properties: { success: { type: 'boolean' }, message: { type: 'string' } }
      },
      RegisterRequest: {
        type: 'object', required: ['email', 'password'],
        properties: { email: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 6 } }
      },
      LoginRequest: { $ref: '#/components/schemas/RegisterRequest' },
      LoginResponse: {
        type: 'object', properties: { token: { type: 'string' }, user: { $ref: '#/components/schemas/User' } }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string' },
          role: { type: 'string' },
          profile: { type: 'object', additionalProperties: true }
        }
      },
      UserProfileUpdate: { type: 'object', properties: { profile: { type: 'object' } } },
      PasswordUpdate: { type: 'object', required: ['currentPassword', 'newPassword'], properties: { currentPassword: { type: 'string' }, newPassword: { type: 'string' } } },
      GovernmentService: {
        type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, category: { type: 'string' }, location: { type: 'string' }, capacity: { type: 'integer' } }
      },
      GovernmentServiceCreate: { type: 'object', required: ['name', 'category'], properties: { name: { type: 'string' }, category: { type: 'string' }, location: { type: 'string' }, capacity: { type: 'integer' } } },
      GovernmentServiceUpdate: { type: 'object', properties: { name: { type: 'string' }, category: { type: 'string' }, location: { type: 'string' }, capacity: { type: 'integer' } } },
      Availability: { type: 'object', properties: { slots: { type: 'array', items: { type: 'object', properties: { time: { type: 'string' }, remaining: { type: 'integer' } } } } } },
      AidRequest: { type: 'object', properties: { id: { type: 'string' }, userId: { type: 'string' }, category: { type: 'string' }, priorityScore: { type: 'integer' }, description: { type: 'string' }, status: { type: 'string' } } },
      AidRequestCreate: { type: 'object', required: ['category'], properties: { category: { type: 'string' }, description: { type: 'string' }, images: { type: 'array', items: { type: 'string' } } } },
      AidRequestUpdate: { type: 'object', properties: { description: { type: 'string' }, status: { type: 'string' } } },
      AidRequestAnalysisResult: { type: 'object', properties: { severity: { type: 'number' }, details: { type: 'object' } } },
      VolunteerTask: { type: 'object', properties: { id: { type: 'string' }, aidRequestId: { type: 'string' }, status: { type: 'string' }, assigneeId: { type: 'string' } } },
      VolunteerTaskCreate: { type: 'object', required: ['aidRequestId', 'assigneeId'], properties: { aidRequestId: { type: 'string' }, assigneeId: { type: 'string' }, notes: { type: 'string' } } },
      VolunteerTaskUpdate: { type: 'object', properties: { status: { type: 'string' }, notes: { type: 'string' } } },
      Resource: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, quantity: { type: 'integer' }, status: { type: 'string' } } },
      ResourceCreate: { type: 'object', required: ['name'], properties: { name: { type: 'string' }, quantity: { type: 'integer', default: 0 }, status: { type: 'string' } } },
      ResourceUpdate: { type: 'object', properties: { name: { type: 'string' }, quantity: { type: 'integer' }, status: { type: 'string' } } },
      ResourceAllocationRequest: { type: 'object', required: ['aidRequestId', 'resourceId'], properties: { aidRequestId: { type: 'string' }, resourceId: { type: 'string' }, quantity: { type: 'integer' } } },
      Donation: { type: 'object', properties: { id: { type: 'string' }, amount: { type: 'number' }, currency: { type: 'string' }, donorId: { type: 'string' } } },
      DonationCreate: { type: 'object', required: ['amount'], properties: { amount: { type: 'number' }, currency: { type: 'string', default: 'USD' } } },
      Notification: { type: 'object', properties: { id: { type: 'string' }, type: { type: 'string' }, read: { type: 'boolean' }, createdAt: { type: 'string', format: 'date-time' } } },
      NotificationCreate: { type: 'object', required: ['type'], properties: { type: { type: 'string' }, payload: { type: 'object' } } },
      QueueJoinRequest: { type: 'object', required: ['serviceId'], properties: { serviceId: { type: 'string' } } },
      QueuePosition: { type: 'object', properties: { id: { type: 'string' }, position: { type: 'integer' }, estimatedWaitMinutes: { type: 'integer' } } },
      ServiceQueueEntry: { type: 'object', properties: { queueId: { type: 'string' }, userId: { type: 'string' }, status: { type: 'string' } } },
      CallNextResponse: { type: 'object', properties: { servedQueueId: { type: 'string' }, userId: { type: 'string' } } },
      Appointment: { type: 'object', properties: { id: { type: 'string' }, userId: { type: 'string' }, serviceId: { type: 'string' }, time: { type: 'string' }, status: { type: 'string' } } },
      AppointmentBookRequest: { type: 'object', required: ['serviceId', 'time'], properties: { serviceId: { type: 'string' }, time: { type: 'string', format: 'date-time' } } },
      AppointmentRescheduleRequest: { type: 'object', required: ['time'], properties: { time: { type: 'string', format: 'date-time' } } },
      AppointmentFeedback: { type: 'object', required: ['rating'], properties: { rating: { type: 'integer', minimum: 1, maximum: 5 }, comment: { type: 'string' } } },
      AnalyticsTrackRequest: { type: 'object', required: ['eventType'], properties: { eventType: { type: 'string' }, metadata: { type: 'object' } } },
      AnalyticsEvent: { type: 'object', properties: { id: { type: 'string' }, eventType: { type: 'string' }, timestamp: { type: 'string', format: 'date-time' } } },
      AnalyticsSummaryResponse: { type: 'object', properties: { buckets: { type: 'array', items: { type: 'object', properties: { ts: { type: 'string' }, count: { type: 'integer' } } } } } },
      DamageAnalyzeUrlRequest: { type: 'object', required: ['fileUrl'], properties: { fileUrl: { type: 'string' }, latitude: { type: 'number' }, longitude: { type: 'number' } } },
      DamageAnalyzeResponse: { type: 'object', properties: { assessmentId: { type: 'string' }, severity: { type: 'number' }, meta: { type: 'object' } } },
      PriorityCalculateResponse: { type: 'object', properties: { assessmentId: { type: 'string' }, priorityScore: { type: 'number' }, factors: { type: 'object' } } }
    }
  },
  security: [],
  paths: {
    '/health': { get: { tags: ['System'], summary: 'Backend health', responses: { '200': { description: 'OK' } } } },
    '/metrics': { get: { tags: ['System'], summary: 'Prometheus metrics', responses: { '200': { description: 'Metrics text' } } } },
    '/api': { get: { tags: ['System'], summary: 'API root info', responses: { '200': { description: 'Info' } } } },
    '/openapi': { get: { tags: ['System'], summary: 'This OpenAPI spec', responses: { '200': { description: 'Spec JSON' } } } },
    // Auth
    '/api/auth/register': {
      post: {
        tags: ['Auth'], summary: 'Register user', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } } },
        responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }, '409': { description: 'Conflict', content: { 'application/json': { schema: { $ref: '#/components/schemas/GenericError' } } } } }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'], summary: 'Login', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } },
        responses: { '200': { description: 'Token', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } }, '401': { description: 'Unauthorized' } }
      }
    },
    // Users
    '/api/users/me': { get: { tags: ['Users'], security: [{ BearerAuth: [] }], summary: 'Current user', responses: { '200': { description: 'User', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }, '401': { description: 'Unauthorized' } } } },
    '/api/users/me/profile': { patch: { tags: ['Users'], security: [{ BearerAuth: [] }], summary: 'Update profile', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/UserProfileUpdate' } } } }, responses: { '200': { description: 'Updated' } } } },
    '/api/users/me/password': { post: { tags: ['Users'], security: [{ BearerAuth: [] }], summary: 'Change password', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/PasswordUpdate' } } } }, responses: { '200': { description: 'Changed' }, '400': { description: 'Invalid' } } } },
    // Government Services
    '/api/government-services': {
      get: { tags: ['Government Services'], summary: 'List services', responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/GovernmentService' } } } } } } },
      post: { tags: ['Government Services'], summary: 'Create service (admin)', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/GovernmentServiceCreate' } } } }, responses: { '201': { description: 'Created' } } }
    },
    '/api/government-services/search': { get: { tags: ['Government Services'], summary: 'Search services', parameters: [{ name: 'q', in: 'query', schema: { type: 'string' } }], responses: { '200': { description: 'Results' } } } },
    '/api/government-services/categories': { get: { tags: ['Government Services'], summary: 'Categories', responses: { '200': { description: 'OK' } } } },
    '/api/government-services/{id}': {
      get: { tags: ['Government Services'], summary: 'Get service', parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/GovernmentService' } } } }, '404': { description: 'Not found' } } },
      put: { tags: ['Government Services'], summary: 'Update service (admin)', parameters: [{ name: 'id', in: 'path', required: true }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/GovernmentServiceUpdate' } } } }, responses: { '200': { description: 'Updated' } } },
      delete: { tags: ['Government Services'], summary: 'Delete service (admin)', parameters: [{ name: 'id', in: 'path', required: true }], responses: { '204': { description: 'Deleted' } } }
    },
    '/api/government-services/{id}/availability': { get: { tags: ['Government Services'], summary: 'Service availability', parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Availability' } } } } } } },
    // Aid Requests
    '/api/aid-requests': { get: { tags: ['Aid Requests'], security: [{ BearerAuth: [] }], summary: 'List aid requests', responses: { '200': { description: 'OK' } } }, post: { tags: ['Aid Requests'], security: [{ BearerAuth: [] }], summary: 'Create aid request', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/AidRequestCreate' } } } }, responses: { '201': { description: 'Created' } } } },
    '/api/aid-requests/{id}': { get: { tags: ['Aid Requests'], security: [{ BearerAuth: [] }], summary: 'Get aid request', parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/AidRequest' } } } }, '404': { description: 'Not found' } } }, patch: { tags: ['Aid Requests'], security: [{ BearerAuth: [] }], summary: 'Update aid request', parameters: [{ name: 'id', in: 'path', required: true }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/AidRequestUpdate' } } } }, responses: { '200': { description: 'Updated' } } } },
    '/api/aid-requests/{id}/analyze': { post: { tags: ['Aid Requests'], security: [{ BearerAuth: [] }], summary: 'Analyze aid request images', parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'Analysis', content: { 'application/json': { schema: { $ref: '#/components/schemas/AidRequestAnalysisResult' } } } } } } },
    '/api/aid-requests/{id}/assign-volunteer': { post: { tags: ['Aid Requests', 'Volunteers'], security: [{ BearerAuth: [] }], summary: 'Assign volunteer to aid request', parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'Assigned' } } } },
    '/api/aid-requests/{id}/allocate-resource': { post: { tags: ['Aid Requests', 'Resources'], security: [{ BearerAuth: [] }], summary: 'Allocate resource to aid request', parameters: [{ name: 'id', in: 'path', required: true }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ResourceAllocationRequest' } } } }, responses: { '200': { description: 'Allocated' } } } },
    // Queue
    '/api/queue/join': { post: { tags: ['Queue'], security: [{ BearerAuth: [] }], summary: 'Join queue', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/QueueJoinRequest' } } } }, responses: { '200': { description: 'Joined', content: { 'application/json': { schema: { $ref: '#/components/schemas/QueuePosition' } } } } } } },
    '/api/queue/{id}/position': { get: { tags: ['Queue'], security: [{ BearerAuth: [] }], summary: 'Get queue position', parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'Position', content: { 'application/json': { schema: { $ref: '#/components/schemas/QueuePosition' } } } } } } },
    '/api/queue/{id}/leave': { put: { tags: ['Queue'], security: [{ BearerAuth: [] }], summary: 'Leave queue', parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'Left' } } } },
    '/api/queue/service/{serviceId}': { get: { tags: ['Queue'], security: [{ BearerAuth: [] }], summary: 'List service queue', parameters: [{ name: 'serviceId', in: 'path', required: true }], responses: { '200': { description: 'Queue', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/ServiceQueueEntry' } } } } } } } },
    '/api/queue/service/{serviceId}/call-next': { post: { tags: ['Queue'], security: [{ BearerAuth: [] }], summary: 'Call next in queue', parameters: [{ name: 'serviceId', in: 'path', required: true }], responses: { '200': { description: 'Next', content: { 'application/json': { schema: { $ref: '#/components/schemas/CallNextResponse' } } } } } } },
    '/api/queue/service/{serviceId}/current': { get: { tags: ['Queue'], security: [{ BearerAuth: [] }], summary: 'Currently serving', parameters: [{ name: 'serviceId', in: 'path', required: true }], responses: { '200': { description: 'Current', content: { 'application/json': { schema: { $ref: '#/components/schemas/ServiceQueueEntry' } } } } } } },
    // Appointments
    '/api/appointments/book': { post: { tags: ['Appointments'], security: [{ BearerAuth: [] }], summary: 'Book appointment', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/AppointmentBookRequest' } } } }, responses: { '201': { description: 'Booked', content: { 'application/json': { schema: { $ref: '#/components/schemas/Appointment' } } } } } } },
    '/api/appointments/user/{userId}': { get: { tags: ['Appointments'], security: [{ BearerAuth: [] }], summary: 'User appointments', parameters: [{ name: 'userId', in: 'path', required: true }], responses: { '200': { description: 'List', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Appointment' } } } } } } } },
    '/api/appointments/{id}': { get: { tags: ['Appointments'], security: [{ BearerAuth: [] }], summary: 'Get appointment', parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Appointment' } } } }, '404': { description: 'Not found' } } } },
    '/api/appointments/{id}/reschedule': { put: { tags: ['Appointments'], security: [{ BearerAuth: [] }], summary: 'Reschedule', parameters: [{ name: 'id', in: 'path', required: true }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/AppointmentRescheduleRequest' } } } }, responses: { '200': { description: 'Rescheduled' } } } },
    '/api/appointments/{id}/cancel': { put: { tags: ['Appointments'], security: [{ BearerAuth: [] }], summary: 'Cancel', parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'Canceled' } } } },
    '/api/appointments/{id}/check-in': { put: { tags: ['Appointments'], security: [{ BearerAuth: [] }], summary: 'Check-in', parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'Checked-in' } } } },
    '/api/appointments/{id}/complete': { put: { tags: ['Appointments'], security: [{ BearerAuth: [] }], summary: 'Complete (admin controlled)', parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'Completed' } } } },
    '/api/appointments/{id}/feedback': { post: { tags: ['Appointments'], security: [{ BearerAuth: [] }], summary: 'Submit feedback', parameters: [{ name: 'id', in: 'path', required: true }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/AppointmentFeedback' } } } }, responses: { '201': { description: 'Recorded' } } } },
    // Volunteers
    '/api/volunteers/tasks': { get: { tags: ['Volunteers'], security: [{ BearerAuth: [] }], summary: 'List volunteer tasks', responses: { '200': { description: 'OK' } } }, post: { tags: ['Volunteers'], security: [{ BearerAuth: [] }], summary: 'Create volunteer task', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/VolunteerTaskCreate' } } } }, responses: { '201': { description: 'Created' } } } },
    '/api/volunteers/tasks/{id}': { patch: { tags: ['Volunteers'], security: [{ BearerAuth: [] }], summary: 'Update volunteer task', parameters: [{ name: 'id', in: 'path', required: true }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/VolunteerTaskUpdate' } } } }, responses: { '200': { description: 'Updated' } } } },
    '/api/volunteers/near/aid-requests/{id}': { get: { tags: ['Volunteers'], security: [{ BearerAuth: [] }], summary: 'Volunteers near aid request', parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'List' } } } },
    // Resources
    '/api/resources': { get: { tags: ['Resources'], security: [{ BearerAuth: [] }], summary: 'List resources', responses: { '200': { description: 'OK' } } }, post: { tags: ['Resources'], security: [{ BearerAuth: [] }], summary: 'Create resource', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ResourceCreate' } } } }, responses: { '201': { description: 'Created' } } } },
    '/api/resources/{id}': { patch: { tags: ['Resources'], security: [{ BearerAuth: [] }], summary: 'Update resource', parameters: [{ name: 'id', in: 'path', required: true }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ResourceUpdate' } } } }, responses: { '200': { description: 'Updated' } } } },
    '/api/resources/allocate': { post: { tags: ['Resources'], security: [{ BearerAuth: [] }], summary: 'Allocate resource', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ResourceAllocationRequest' } } } }, responses: { '200': { description: 'Allocated' } } } },
    '/api/resources/near/aid-requests/{id}': { get: { tags: ['Resources'], security: [{ BearerAuth: [] }], summary: 'Resources near aid request', parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'List' } } } },
    // Donations
    '/api/donations': { get: { tags: ['Donations'], security: [{ BearerAuth: [] }], summary: 'List donations', responses: { '200': { description: 'OK' } } }, post: { tags: ['Donations'], security: [{ BearerAuth: [] }], summary: 'Create donation', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/DonationCreate' } } } }, responses: { '201': { description: 'Created' } } } },
    // Notifications
    '/api/notifications': { get: { tags: ['Notifications'], security: [{ BearerAuth: [] }], summary: 'List notifications', responses: { '200': { description: 'OK' } } }, post: { tags: ['Notifications'], security: [{ BearerAuth: [] }], summary: 'Create notification', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/NotificationCreate' } } } }, responses: { '201': { description: 'Created' } } } },
    '/api/notifications/mark-all-read': { post: { tags: ['Notifications'], security: [{ BearerAuth: [] }], summary: 'Mark all as read', responses: { '200': { description: 'Updated' } } } },
    '/api/notifications/{id}/read': { patch: { tags: ['Notifications'], security: [{ BearerAuth: [] }], summary: 'Mark single notification read', parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'Updated' } } } },
    // Analytics
    '/api/analytics/track': { post: { tags: ['Analytics'], security: [{ BearerAuth: [] }], summary: 'Track event', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/AnalyticsTrackRequest' } } } }, responses: { '201': { description: 'Tracked' } } } },
    '/api/analytics': { get: { tags: ['Analytics'], security: [{ BearerAuth: [] }], summary: 'List events', responses: { '200': { description: 'List', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/AnalyticsEvent' } } } } } } } },
    '/api/analytics/summary': { get: { tags: ['Analytics'], security: [{ BearerAuth: [] }], summary: 'Analytics summary', parameters: [ { name: 'granularity', in: 'query', schema: { type: 'string', enum: ['hour', 'day', 'week', 'month'] } }, { name: 'start', in: 'query', schema: { type: 'string', format: 'date-time' } }, { name: 'end', in: 'query', schema: { type: 'string', format: 'date-time' } }, { name: 'eventType', in: 'query', schema: { type: 'string' } } ], responses: { '200': { description: 'Summary', content: { 'application/json': { schema: { $ref: '#/components/schemas/AnalyticsSummaryResponse' } } } } } } },
    // AI Proxy (backend endpoints that forward to AI service)
    '/api/ai/damage/analyze-url': { post: { tags: ['AI (Proxy)'], security: [{ BearerAuth: [] }], summary: 'Analyze damage from URL', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/DamageAnalyzeUrlRequest' } } } }, responses: { '200': { description: 'Analysis', content: { 'application/json': { schema: { $ref: '#/components/schemas/DamageAnalyzeResponse' } } } } } } },
    '/api/ai/priority/calculate/{assessmentId}': { post: { tags: ['AI (Proxy)'], security: [{ BearerAuth: [] }], summary: 'Calculate priority score', parameters: [{ name: 'assessmentId', in: 'path', required: true }], responses: { '200': { description: 'Priority', content: { 'application/json': { schema: { $ref: '#/components/schemas/PriorityCalculateResponse' } } } } } } }
  }
};

router.get('/', (_req, res) => res.json(spec));

export { router as openapiRouter };
