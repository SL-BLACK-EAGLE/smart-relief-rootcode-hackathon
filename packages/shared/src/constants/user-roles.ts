// User Role Constants
export const USER_ROLES = {
  VICTIM: 'victim',
  DONOR: 'donor',
  VOLUNTEER: 'volunteer',
  ADMIN: 'admin',
  ORGANIZATION: 'organization',
} as const;

export type UserRoleType = typeof USER_ROLES[keyof typeof USER_ROLES];

// Role Permissions
export const ROLE_PERMISSIONS = {
  [USER_ROLES.VICTIM]: [
    'create_aid_request',
    'view_own_aid_requests',
    'update_own_profile',
    'view_resources',
    'communicate_with_volunteers',
  ],
  [USER_ROLES.DONOR]: [
    'create_donation',
    'view_own_donations',
    'view_donation_impact',
    'update_own_profile',
    'view_aid_requests',
    'view_campaigns',
  ],
  [USER_ROLES.VOLUNTEER]: [
    'view_available_tasks',
    'accept_tasks',
    'update_task_status',
    'view_assigned_tasks',
    'update_own_profile',
    'view_aid_requests',
    'communicate_with_victims',
  ],
  [USER_ROLES.ADMIN]: [
    'manage_users',
    'manage_aid_requests',
    'manage_resources',
    'manage_volunteers',
    'view_analytics',
    'manage_campaigns',
    'system_configuration',
    'bulk_operations',
  ],
  [USER_ROLES.ORGANIZATION]: [
    'create_campaigns',
    'manage_own_campaigns',
    'bulk_resource_management',
    'coordinate_volunteers',
    'view_analytics',
    'manage_organization_profile',
    'create_bulk_aid_requests',
  ],
} as const;

// Role Hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY = {
  [USER_ROLES.VICTIM]: 1,
  [USER_ROLES.DONOR]: 1,
  [USER_ROLES.VOLUNTEER]: 2,
  [USER_ROLES.ORGANIZATION]: 3,
  [USER_ROLES.ADMIN]: 4,
} as const;

// Default Role Assignments
export const DEFAULT_ROLE = USER_ROLES.VICTIM;

// Role Display Names
export const ROLE_DISPLAY_NAMES = {
  [USER_ROLES.VICTIM]: 'Disaster Victim',
  [USER_ROLES.DONOR]: 'Donor',
  [USER_ROLES.VOLUNTEER]: 'Volunteer',
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.ORGANIZATION]: 'Relief Organization',
} as const;

// Role Descriptions
export const ROLE_DESCRIPTIONS = {
  [USER_ROLES.VICTIM]: 'People affected by disasters who need assistance',
  [USER_ROLES.DONOR]: 'Individuals or entities providing monetary or resource donations',
  [USER_ROLES.VOLUNTEER]: 'People offering their time and skills to help with relief efforts',
  [USER_ROLES.ADMIN]: 'System administrators with full platform access',
  [USER_ROLES.ORGANIZATION]: 'Relief organizations coordinating large-scale efforts',
} as const;

// Role Colors (for UI)
export const ROLE_COLORS = {
  [USER_ROLES.VICTIM]: '#ef4444', // red
  [USER_ROLES.DONOR]: '#10b981', // green
  [USER_ROLES.VOLUNTEER]: '#3b82f6', // blue
  [USER_ROLES.ADMIN]: '#8b5cf6', // purple
  [USER_ROLES.ORGANIZATION]: '#f59e0b', // amber
} as const;
