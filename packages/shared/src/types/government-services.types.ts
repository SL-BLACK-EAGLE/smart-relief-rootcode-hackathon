import { GeoPoint, Address } from './aid-request.types';

// Government Service Categories
export type GovernmentServiceCategory =
    | 'EMERGENCY_SHELTER'           // Temporary housing, evacuation centers
    | 'FOOD_DISTRIBUTION'           // Food banks, meal services, nutrition programs
    | 'WATER_SUPPLY'                // Clean water access, purification, distribution
    | 'MEDICAL_AID'                 // Emergency medical care, field hospitals, first aid
    | 'SEARCH_RESCUE'               // Search and rescue operations, missing persons
    | 'EVACUATION_TRANSPORT'        // Emergency evacuation, transportation services
    | 'DISASTER_ASSESSMENT'         // Damage assessment, AI-powered analysis
    | 'COMMUNICATION_SERVICES'      // Emergency communication, internet access
    | 'POWER_RESTORATION'           // Emergency power, generator services
    | 'PSYCHOLOGICAL_SUPPORT'       // Mental health, trauma counseling, crisis support
    | 'CLEANUP_DEBRIS'              // Debris removal, environmental cleanup
    | 'FINANCIAL_AID'               // Emergency funds, disaster loans, grants
    | 'LOGISTICS_COORDINATION'      // Resource coordination, supply chain management
    | 'VOLUNTEER_COORDINATION'      // Volunteer management, skill matching
    | 'ANIMAL_RESCUE'               // Pet rescue, livestock assistance
    | 'CHILD_PROTECTION'            // Unaccompanied minors, child safety services
    | 'ELDERLY_ASSISTANCE'          // Senior care, mobility assistance
    | 'DISABILITY_SUPPORT'          // Accessibility services, special needs assistance
    | 'DOCUMENTATION_RECOVERY'      // Lost document replacement, identity verification
    | 'LEGAL_AID'                   // Legal assistance, insurance claims, rights protection
    | 'EDUCATION_CONTINUITY'        // Temporary schools, educational materials
    | 'INFRASTRUCTURE_REPAIR'       // Critical infrastructure restoration
    | 'COMMUNITY_COORDINATION'      // Local community organizing, information sharing
    | 'DONATION_MANAGEMENT'         // Donation collection, sorting, distribution
    | 'OTHER';

// Appointment Status Types
export type AppointmentStatus = 
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'RESCHEDULED';

export type AppointmentPriority = 
  | 'LOW'
  | 'NORMAL'
  | 'HIGH'
  | 'URGENT'
  | 'EMERGENCY';

export type DocumentVerificationStatus = 
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'INCOMPLETE';

// Queue Management Types
export type QueueStatus = 
  | 'WAITING'
  | 'CALLED'
  | 'BEING_SERVED'
  | 'COMPLETED'
  | 'LEFT_QUEUE'
  | 'NO_SHOW';

export type QueuePriority = 
  | 'LOW'
  | 'NORMAL'
  | 'HIGH'
  | 'URGENT'
  | 'EMERGENCY'
  | 'DISABLED'
  | 'ELDERLY'
  | 'PREGNANT';

// Emergency Service Types
export type EmergencyServiceType = 
  | 'MEDICAL_EMERGENCY'
  | 'FIRE'
  | 'POLICE'
  | 'DISASTER_RELIEF'
  | 'SEARCH_RESCUE'
  | 'EVACUATION'
  | 'SHELTER'
  | 'FOOD_DISTRIBUTION'
  | 'WATER_SUPPLY'
  | 'POWER_RESTORATION'
  | 'COMMUNICATION'
  | 'TRANSPORTATION'
  | 'OTHER';

export type EmergencyUrgencyLevel = 
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL'
  | 'LIFE_THREATENING';

export type EmergencyRequestStatus = 
  | 'SUBMITTED'
  | 'ACKNOWLEDGED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESPONDED'
  | 'RESOLVED'
  | 'CLOSED'
  | 'ESCALATED';

// Core Interfaces
export interface GovernmentService {
  id: string;
  name: string;
  description: string;
  category: GovernmentServiceCategory;
  department: string;
  
  // Service configuration
  isActive: boolean;
  requiresDocuments: boolean;
  avgProcessingTime: number; // in minutes
  cost?: number;
  
  // Booking configuration
  allowsOnlineBooking: boolean;
  maxAdvanceBookingDays: number;
  slotDuration: number; // in minutes
  bufferTime: number; // in minutes between slots
  maxDailySlots: number;
  
  // Requirements
  requiredDocuments: string[];
  eligibilityCriteria?: string;
  
  // Office/Location info
  officeLocation: string;
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
    address: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  timeSlots?: GovernmentServiceTimeSlot[];
  appointments?: GovernmentServiceAppointment[];
}

export interface GovernmentServiceTimeSlot {
  id: string;
  serviceId: string;
  
  // Time configuration
  dayOfWeek: number; // 0-6 (Sunday = 0)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  
  // Slot configuration
  isActive: boolean;
  maxAppointments: number;
  
  // Special dates
  specialDates?: {
    date: string; // YYYY-MM-DD
    isAvailable: boolean;
    maxAppointments?: number;
    note?: string;
  }[];
  
  // Relations
  service?: GovernmentService;
}

export interface GovernmentServiceAppointment {
  id: string;
  serviceId: string;
  userId: string;
  
  // Appointment details
  appointmentDate: Date;
  timeSlot: string; // HH:mm format
  duration: number; // in minutes
  status: AppointmentStatus;
  priority: AppointmentPriority;
  
  // Booking info
  bookedAt: Date;
  bookingReference: string;
  
  // Queue management
  queuePosition?: number;
  estimatedWaitTime?: number; // in minutes
  
  // Documents and verification
  documentsSubmitted?: {
    documentType: string;
    fileUrl: string;
    uploadedAt: Date;
  }[];
  verificationStatus: DocumentVerificationStatus;
  
  // Communication
  remindersSent: number;
  lastReminderAt?: Date;
  
  // Completion details
  serviceCompletedAt?: Date;
  feedback?: {
    rating: number; // 1-5 stars
    comment?: string;
    serviceQuality: number;
    waitTime: number;
    staffHelpfulness: number;
  };
  
  // Metadata
  notes?: string;
  adminNotes?: string;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  service?: GovernmentService;
  user?: {
    id: string;
    email: string;
    profile?: {
      firstName: string;
      lastName: string;
      phoneNumber?: string;
    };
  };
}

export interface GovernmentServiceQueue {
  id: string;
  serviceId: string;
  userId: string;
  
  // Queue details
  position: number;
  estimatedWaitTime: number; // in minutes
  status: QueueStatus;
  priority: QueuePriority;
  
  // Timing
  joinedAt: Date;
  notifiedAt?: Date;
  servedAt?: Date;
  leftQueueAt?: Date;
  
  // Metadata
  reason?: string;
  notes?: string;
}

export interface GovernmentOffice {
  id: string;
  name: string;
  code: string;
  
  // Location
  address: string;
  location: GeoPoint;
  
  // Contact
  phone?: string;
  email?: string;
  website?: string;
  
  // Operating hours
  operatingHours: {
    [day: string]: {
      open: string; // HH:mm
      close: string; // HH:mm
      isOpen: boolean;
    };
  };
  holidays: string[]; // Array of holiday dates (YYYY-MM-DD)
  
  // Capacity
  dailyCapacity: number;
  staffCount: number;
  
  // Services offered
  servicesOffered: string[]; // Array of service IDs
  
  // Status
  isActive: boolean;
  temporarilyClosed: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyServiceRequest {
  id: string;
  userId: string;
  serviceType: EmergencyServiceType;
  
  // Emergency details
  urgencyLevel: EmergencyUrgencyLevel;
  description: string;
  peopleAffected?: number;
  
  // Location
  location: GeoPoint;
  address: string;
  
  // Status tracking
  status: EmergencyRequestStatus;
  assignedOfficer?: string;
  responseTime?: number; // in minutes
  
  // Evidence
  photos: string[]; // Array of photo URLs
  documents: string[]; // Array of document URLs
  
  // Timeline
  submittedAt: Date;
  acknowledgedAt?: Date;
  respondedAt?: Date;
  resolvedAt?: Date;
  
  // Follow-up
  followUpRequired: boolean;
  followUpNotes?: string;
  
  // Relations
  user?: {
    id: string;
    email: string;
    profile?: {
      firstName: string;
      lastName: string;
      phoneNumber?: string;
    };
  };
}

// Request/Response Types for API
export interface CreateGovernmentServiceRequest {
  name: string;
  description: string;
  category: GovernmentServiceCategory;
  department: string;
  requiresDocuments?: boolean;
  avgProcessingTime: number;
  cost?: number;
  allowsOnlineBooking?: boolean;
  maxAdvanceBookingDays?: number;
  slotDuration?: number;
  bufferTime?: number;
  maxDailySlots?: number;
  requiredDocuments: string[];
  eligibilityCriteria?: string;
  officeLocation: string;
  contactInfo: GovernmentService['contactInfo'];
}

export interface BookAppointmentRequest {
  serviceId: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  priority?: AppointmentPriority;
  notes?: string;
  documentsSubmitted?: {
    documentType: string;
    fileUrl: string;
  }[];
}

export interface BookAppointmentResponse {
  appointment: GovernmentServiceAppointment;
  bookingReference: string;
  estimatedWaitTime?: number;
  queuePosition?: number;
}

export interface RescheduleAppointmentRequest {
  appointmentId: string;
  newDate: string; // YYYY-MM-DD
  newTimeSlot: string; // HH:mm
  reason?: string;
}

export interface AvailableTimeSlot {
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  availableSlots: number;
  estimatedWaitTime: number;
}

export interface ServiceAvailabilityRequest {
  serviceId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface ServiceAvailabilityResponse {
  serviceId: string;
  availableSlots: AvailableTimeSlot[];
  holidays: string[];
  specialClosures: {
    date: string;
    reason: string;
  }[];
}

export interface CreateEmergencyServiceRequest {
  serviceType: EmergencyServiceType;
  urgencyLevel: EmergencyUrgencyLevel;
  description: string;
  peopleAffected?: number;
  location: GeoPoint;
  address: string;
  photos?: string[];
  documents?: string[];
}

export interface UpdateEmergencyServiceRequest {
  status: EmergencyRequestStatus;
  assignedOfficer?: string;
  responseTime?: number;
  notes?: string;
}

// Search and Filter Types
export interface GovernmentServiceSearchParams {
  category?: GovernmentServiceCategory;
  department?: string;
  location?: GeoPoint;
  radius?: number; // in kilometers
  availableDate?: string; // YYYY-MM-DD
  requiresOnlineBooking?: boolean;
  query?: string; // Text search
}

export interface AppointmentSearchParams {
  userId?: string;
  serviceId?: string;
  status?: AppointmentStatus;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  priority?: AppointmentPriority;
}

// Analytics and Dashboard Types
export interface ServiceMetrics {
  serviceId: string;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowRate: number;
  averageWaitTime: number;
  averageServiceTime: number;
  customerSatisfactionRating: number;
  busyHours: {
    hour: number;
    appointmentCount: number;
  }[];
}

export interface DashboardStats {
  totalServices: number;
  activeServices: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  emergencyRequests: number;
  queueLength: number;
  averageWaitTime: number;
}

export interface NotificationPreferences {
  emailReminders: boolean;
  smsReminders: boolean;
  pushNotifications: boolean;
  reminderTiming: number; // hours before appointment
  emergencyAlerts: boolean;
  serviceUpdates: boolean;
}
