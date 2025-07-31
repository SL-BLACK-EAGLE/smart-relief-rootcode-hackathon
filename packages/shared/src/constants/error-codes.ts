// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Application Error Codes
export const ERROR_CODES = {
  // Authentication Errors (1000-1099)
  AUTH_INVALID_CREDENTIALS: 'AUTH_001',
  AUTH_TOKEN_EXPIRED: 'AUTH_002',
  AUTH_TOKEN_INVALID: 'AUTH_003',
  AUTH_ACCOUNT_LOCKED: 'AUTH_004',
  AUTH_ACCOUNT_NOT_VERIFIED: 'AUTH_005',
  AUTH_PASSWORD_TOO_WEAK: 'AUTH_006',
  AUTH_EMAIL_ALREADY_EXISTS: 'AUTH_007',
  AUTH_PHONE_ALREADY_EXISTS: 'AUTH_008',
  AUTH_INVALID_RESET_TOKEN: 'AUTH_009',
  AUTH_SESSION_EXPIRED: 'AUTH_010',

  // User Errors (1100-1199)
  USER_NOT_FOUND: 'USER_001',
  USER_PROFILE_INCOMPLETE: 'USER_002',
  USER_PERMISSION_DENIED: 'USER_003',
  USER_ACCOUNT_SUSPENDED: 'USER_004',
  USER_VERIFICATION_REQUIRED: 'USER_005',

  // Aid Request Errors (1200-1299)
  AID_REQUEST_NOT_FOUND: 'AID_001',
  AID_REQUEST_INVALID_LOCATION: 'AID_002',
  AID_REQUEST_DUPLICATE: 'AID_003',
  AID_REQUEST_EXPIRED: 'AID_004',
  AID_REQUEST_ALREADY_FULFILLED: 'AID_005',
  AID_REQUEST_INVALID_CATEGORY: 'AID_006',
  AID_REQUEST_MISSING_IMAGES: 'AID_007',

  // Resource Errors (1300-1399)
  RESOURCE_NOT_FOUND: 'RES_001',
  RESOURCE_INSUFFICIENT_QUANTITY: 'RES_002',
  RESOURCE_EXPIRED: 'RES_003',
  RESOURCE_ALREADY_ALLOCATED: 'RES_004',
  RESOURCE_INVALID_CONDITION: 'RES_005',
  RESOURCE_LOCATION_MISMATCH: 'RES_006',

  // Volunteer Errors (1400-1499)
  VOLUNTEER_NOT_FOUND: 'VOL_001',
  VOLUNTEER_TASK_CONFLICT: 'VOL_002',
  VOLUNTEER_INSUFFICIENT_SKILLS: 'VOL_003',
  VOLUNTEER_UNAVAILABLE: 'VOL_004',
  VOLUNTEER_BACKGROUND_CHECK_REQUIRED: 'VOL_005',
  VOLUNTEER_TRAINING_INCOMPLETE: 'VOL_006',
  VOLUNTEER_TASK_ALREADY_ASSIGNED: 'VOL_007',

  // Donation Errors (1500-1599)
  DONATION_PAYMENT_FAILED: 'DON_001',
  DONATION_INVALID_AMOUNT: 'DON_002',
  DONATION_CAMPAIGN_ENDED: 'DON_003',
  DONATION_REFUND_FAILED: 'DON_004',
  DONATION_TAX_INFO_REQUIRED: 'DON_005',
  DONATION_CURRENCY_NOT_SUPPORTED: 'DON_006',

  // File Upload Errors (1600-1699)
  FILE_TOO_LARGE: 'FILE_001',
  FILE_INVALID_TYPE: 'FILE_002',
  FILE_UPLOAD_FAILED: 'FILE_003',
  FILE_VIRUS_DETECTED: 'FILE_004',
  FILE_CORRUPTED: 'FILE_005',

  // Geolocation Errors (1700-1799)
  GEO_INVALID_COORDINATES: 'GEO_001',
  GEO_LOCATION_NOT_FOUND: 'GEO_002',
  GEO_SERVICE_UNAVAILABLE: 'GEO_003',
  GEO_OUTSIDE_SERVICE_AREA: 'GEO_004',

  // AI/ML Errors (1800-1899)
  AI_MODEL_UNAVAILABLE: 'AI_001',
  AI_ANALYSIS_FAILED: 'AI_002',
  AI_INVALID_INPUT: 'AI_003',
  AI_PROCESSING_TIMEOUT: 'AI_004',
  AI_CONFIDENCE_TOO_LOW: 'AI_005',

  // Communication Errors (1900-1999)
  NOTIFICATION_SEND_FAILED: 'COMM_001',
  EMAIL_SEND_FAILED: 'COMM_002',
  SMS_SEND_FAILED: 'COMM_003',
  PUSH_NOTIFICATION_FAILED: 'COMM_004',

  // System Errors (2000-2099)
  DATABASE_CONNECTION_FAILED: 'SYS_001',
  EXTERNAL_SERVICE_UNAVAILABLE: 'SYS_002',
  RATE_LIMIT_EXCEEDED: 'SYS_003',
  MAINTENANCE_MODE: 'SYS_004',
  INVALID_REQUEST_FORMAT: 'SYS_005',
  MISSING_REQUIRED_FIELD: 'SYS_006',
  VALIDATION_FAILED: 'SYS_007',

  // General Errors
  UNKNOWN_ERROR: 'GEN_001',
  NOT_IMPLEMENTED: 'GEN_002',
  FEATURE_DISABLED: 'GEN_003',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password',
  [ERROR_CODES.AUTH_TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
  [ERROR_CODES.AUTH_TOKEN_INVALID]: 'Invalid authentication token',
  [ERROR_CODES.AUTH_ACCOUNT_LOCKED]: 'Account is locked due to too many failed login attempts',
  [ERROR_CODES.AUTH_ACCOUNT_NOT_VERIFIED]: 'Please verify your email address before logging in',
  [ERROR_CODES.AUTH_PASSWORD_TOO_WEAK]: 'Password does not meet security requirements',
  [ERROR_CODES.AUTH_EMAIL_ALREADY_EXISTS]: 'An account with this email already exists',
  [ERROR_CODES.AUTH_PHONE_ALREADY_EXISTS]: 'An account with this phone number already exists',

  [ERROR_CODES.USER_NOT_FOUND]: 'User not found',
  [ERROR_CODES.USER_PROFILE_INCOMPLETE]: 'Please complete your profile before continuing',
  [ERROR_CODES.USER_PERMISSION_DENIED]: 'You do not have permission to perform this action',
  [ERROR_CODES.USER_ACCOUNT_SUSPENDED]: 'Your account has been suspended. Please contact support.',

  [ERROR_CODES.AID_REQUEST_NOT_FOUND]: 'Aid request not found',
  [ERROR_CODES.AID_REQUEST_INVALID_LOCATION]: 'Invalid location coordinates provided',
  [ERROR_CODES.AID_REQUEST_DUPLICATE]: 'A similar aid request already exists for this location',
  [ERROR_CODES.AID_REQUEST_EXPIRED]: 'This aid request has expired',
  [ERROR_CODES.AID_REQUEST_ALREADY_FULFILLED]: 'This aid request has already been fulfilled',

  [ERROR_CODES.RESOURCE_NOT_FOUND]: 'Resource not found',
  [ERROR_CODES.RESOURCE_INSUFFICIENT_QUANTITY]: 'Insufficient quantity available',
  [ERROR_CODES.RESOURCE_EXPIRED]: 'This resource has expired',
  [ERROR_CODES.RESOURCE_ALREADY_ALLOCATED]: 'This resource has already been allocated',

  [ERROR_CODES.VOLUNTEER_NOT_FOUND]: 'Volunteer not found',
  [ERROR_CODES.VOLUNTEER_TASK_CONFLICT]: 'You have a conflicting task assignment',
  [ERROR_CODES.VOLUNTEER_INSUFFICIENT_SKILLS]: 'Required skills not met for this task',
  [ERROR_CODES.VOLUNTEER_UNAVAILABLE]: 'You are not available during the required time',
  [ERROR_CODES.VOLUNTEER_BACKGROUND_CHECK_REQUIRED]: 'Background check required for this task',

  [ERROR_CODES.DONATION_PAYMENT_FAILED]: 'Payment processing failed',
  [ERROR_CODES.DONATION_INVALID_AMOUNT]: 'Invalid donation amount',
  [ERROR_CODES.DONATION_CAMPAIGN_ENDED]: 'This campaign has ended',

  [ERROR_CODES.FILE_TOO_LARGE]: 'File size exceeds maximum allowed limit',
  [ERROR_CODES.FILE_INVALID_TYPE]: 'File type not supported',
  [ERROR_CODES.FILE_UPLOAD_FAILED]: 'File upload failed',

  [ERROR_CODES.GEO_INVALID_COORDINATES]: 'Invalid geographic coordinates',
  [ERROR_CODES.GEO_LOCATION_NOT_FOUND]: 'Location not found',
  [ERROR_CODES.GEO_SERVICE_UNAVAILABLE]: 'Geolocation service is currently unavailable',

  [ERROR_CODES.AI_MODEL_UNAVAILABLE]: 'AI analysis service is currently unavailable',
  [ERROR_CODES.AI_ANALYSIS_FAILED]: 'AI analysis failed to process the request',
  [ERROR_CODES.AI_INVALID_INPUT]: 'Invalid input for AI analysis',

  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please try again later.',
  [ERROR_CODES.MAINTENANCE_MODE]: 'System is under maintenance. Please try again later.',
  [ERROR_CODES.VALIDATION_FAILED]: 'Request validation failed',

  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred',
  [ERROR_CODES.NOT_IMPLEMENTED]: 'This feature is not yet implemented',
  [ERROR_CODES.FEATURE_DISABLED]: 'This feature is currently disabled',
} as const;

// Error Categories for Monitoring
export const ERROR_CATEGORIES = {
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  VALIDATION: 'validation',
  BUSINESS_LOGIC: 'business_logic',
  EXTERNAL_SERVICE: 'external_service',
  SYSTEM: 'system',
  NETWORK: 'network',
} as const;
