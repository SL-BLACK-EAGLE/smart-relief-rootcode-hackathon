// API Base URLs
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    BASE: '/api/auth',
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_EMAIL: '/api/auth/verify-email',
  },

  // Users
  USERS: {
    BASE: '/api/users',
    PROFILE: (id: string) => `/api/users/${id}/profile`,
    AVATAR: (id: string) => `/api/users/${id}/avatar`,
    PREFERENCES: (id: string) => `/api/users/${id}/preferences`,
  },

  // Aid Requests
  AID_REQUESTS: {
    BASE: '/api/aid-requests',
    BY_ID: (id: string) => `/api/aid-requests/${id}`,
    STATUS: (id: string) => `/api/aid-requests/${id}/status`,
    ASSIGN: (id: string) => `/api/aid-requests/${id}/assign`,
    NEARBY: '/api/aid-requests/nearby',
    PRIORITY: '/api/aid-requests/priority',
    IMAGES: (id: string) => `/api/aid-requests/${id}/images`,
  },

  // Resources
  RESOURCES: {
    BASE: '/api/resources',
    BY_ID: (id: string) => `/api/resources/${id}`,
    MATCH: (aidRequestId: string) => `/api/resources/match/${aidRequestId}`,
    ALLOCATE: (id: string) => `/api/resources/${id}/allocate`,
    NEARBY: '/api/resources/nearby',
    CATEGORIES: '/api/resources/categories',
  },

  // Volunteers
  VOLUNTEERS: {
    BASE: '/api/volunteers',
    PROFILE: (id: string) => `/api/volunteers/${id}/profile`,
    TASKS: (id: string) => `/api/volunteers/${id}/tasks`,
    ASSIGNMENTS: '/api/volunteers/assignments',
    AVAILABLE_TASKS: '/api/volunteers/available-tasks',
    ACCEPT_TASK: (taskId: string) => `/api/volunteers/tasks/${taskId}/accept`,
    COMPLETE_TASK: (taskId: string) => `/api/volunteers/tasks/${taskId}/complete`,
  },

  // Donations
  DONATIONS: {
    BASE: '/api/donations',
    BY_ID: (id: string) => `/api/donations/${id}`,
    IMPACT: (id: string) => `/api/donations/${id}/impact`,
    HISTORY: (donorId: string) => `/api/donations/donor/${donorId}/history`,
    CAMPAIGNS: '/api/donations/campaigns',
    CAMPAIGN_BY_ID: (id: string) => `/api/donations/campaigns/${id}`,
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: '/api/notifications',
    SEND: '/api/notifications/send',
    USER_NOTIFICATIONS: (userId: string) => `/api/notifications/user/${userId}`,
    MARK_READ: (id: string) => `/api/notifications/${id}/read`,
    PREFERENCES: (userId: string) => `/api/notifications/preferences/${userId}`,
  },

  // Analytics
  ANALYTICS: {
    BASE: '/api/analytics',
    DASHBOARD: '/api/analytics/dashboard',
    AID_DISTRIBUTION: '/api/analytics/aid-distribution',
    VOLUNTEER_STATS: '/api/analytics/volunteer-stats',
    DONATION_IMPACT: '/api/analytics/donation-impact',
    REGIONAL_STATS: '/api/analytics/regional-stats',
  },

  // AI Services
  AI: {
    BASE: '/ai/api',
    ASSESS_DAMAGE: '/ai/api/assess-damage',
    CALCULATE_PRIORITY: '/ai/api/calculate-priority',
    PREDICT_DEMAND: (location: string) => `/ai/api/predict-demand/${location}`,
    CHARTS: {
      AID_DISTRIBUTION: '/ai/api/charts/aid-distribution',
      DONOR_IMPACT: '/ai/api/charts/donor-impact',
      VOLUNTEER_ACTIVITIES: '/ai/api/charts/volunteer-activities',
      REGIONAL_STATISTICS: '/ai/api/charts/regional-statistics',
    },
    GEOSPATIAL: (analysisType: string) => `/ai/api/geospatial/${analysisType}`,
  },

  // Government Services
  GOVERNMENT_SERVICES: {
    BASE: '/api/government-services',
    BY_ID: (id: string) => `/api/government-services/${id}`,
    SEARCH: '/api/government-services/search',
    CATEGORIES: '/api/government-services/categories',
    AVAILABILITY: (id: string) => `/api/government-services/${id}/availability`,
    TIME_SLOTS: (id: string) => `/api/government-services/${id}/time-slots`,
  },

  // Government Service Appointments
  APPOINTMENTS: {
    BASE: '/api/appointments',
    BY_ID: (id: string) => `/api/appointments/${id}`,
    USER_APPOINTMENTS: (userId: string) => `/api/appointments/user/${userId}`,
    BOOK: '/api/appointments/book',
    RESCHEDULE: (id: string) => `/api/appointments/${id}/reschedule`,
    CANCEL: (id: string) => `/api/appointments/${id}/cancel`,
    CHECK_IN: (id: string) => `/api/appointments/${id}/check-in`,
    COMPLETE: (id: string) => `/api/appointments/${id}/complete`,
    FEEDBACK: (id: string) => `/api/appointments/${id}/feedback`,
    DOCUMENTS: (id: string) => `/api/appointments/${id}/documents`,
  },

  // Queue Management
  QUEUE: {
    BASE: '/api/queue',
    SERVICE_QUEUE: (serviceId: string) => `/api/queue/service/${serviceId}`,
    JOIN: '/api/queue/join',
    LEAVE: (id: string) => `/api/queue/${id}/leave`,
    POSITION: (id: string) => `/api/queue/${id}/position`,
    CURRENT: (serviceId: string) => `/api/queue/service/${serviceId}/current`,
    CALL_NEXT: (serviceId: string) => `/api/queue/service/${serviceId}/call-next`,
  },

  // Government Offices
  OFFICES: {
    BASE: '/api/offices',
    BY_ID: (id: string) => `/api/offices/${id}`,
    NEARBY: '/api/offices/nearby',
    BY_SERVICE: (serviceId: string) => `/api/offices/service/${serviceId}`,
  },

  // Emergency Services
  EMERGENCY_SERVICES: {
    BASE: '/api/emergency-services',
    REQUESTS: '/api/emergency-services/requests',
    BY_ID: (id: string) => `/api/emergency-services/requests/${id}`,
    ASSIGN: (id: string) => `/api/emergency-services/requests/${id}/assign`,
    UPDATE_STATUS: (id: string) => `/api/emergency-services/requests/${id}/status`,
    NEARBY: '/api/emergency-services/nearby',
    URGENT: '/api/emergency-services/urgent',
  },

  // File Upload
  UPLOAD: {
    BASE: '/api/upload',
    IMAGE: '/api/upload/image',
    DOCUMENT: '/api/upload/document',
    AVATAR: '/api/upload/avatar',
  },

  // Health Check
  HEALTH: '/health',
  
  // WebSocket
  WEBSOCKET: '/socket.io',
} as const;

// Query Parameter Constants
export const QUERY_PARAMS = {
  PAGINATION: {
    PAGE: 'page',
    LIMIT: 'limit',
    OFFSET: 'offset',
  },
  FILTERS: {
    CATEGORY: 'category',
    STATUS: 'status',
    LOCATION: 'location',
    RADIUS: 'radius',
    START_DATE: 'startDate',
    END_DATE: 'endDate',
    PRIORITY: 'priority',
    URGENCY: 'urgency',
  },
  SORTING: {
    SORT_BY: 'sortBy',
    SORT_ORDER: 'sortOrder',
  },
} as const;
