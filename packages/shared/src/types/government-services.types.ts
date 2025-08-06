import {GeoPoint} from './aid-request.types';

// Government Service Categories
export type ReliefServiceCategory =
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

// Relief Service Priority Levels (more specific to disaster response)
export type ReliefServicePriority =
    | 'LIFE_THREATENING'            // Immediate life-saving interventions
    | 'CRITICAL'                    // Critical needs within hours
    | 'URGENT'                      // Urgent needs within 24 hours
    | 'HIGH'                        // High priority within 72 hours
    | 'NORMAL'                      // Standard priority within a week
    | 'LOW';                        // Lower priority, longer timeframe

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

// Disaster Types (for context and categorization)
export type DisasterType =
    | 'NATURAL_DISASTER'
    | 'EARTHQUAKE'
    | 'FLOOD'
    | 'HURRICANE'
    | 'TORNADO'
    | 'WILDFIRE'
    | 'TSUNAMI'
    | 'DROUGHT'
    | 'VOLCANIC_ERUPTION'
    | 'LANDSLIDE'
    | 'INDUSTRIAL_ACCIDENT'
    | 'CHEMICAL_SPILL'
    | 'EXPLOSION'
    | 'BUILDING_COLLAPSE'
    | 'TRANSPORTATION_ACCIDENT'
    | 'CYBER_ATTACK'
    | 'TERRORISM'
    | 'CIVIL_UNREST'
    | 'PANDEMIC'
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

// Service Delivery Methods
export type ServiceDeliveryMethod =
    | 'ON_SITE'                     // Service provided at disaster location
    | 'MOBILE_UNIT'                 // Mobile service delivery
    | 'DISTRIBUTION_CENTER'         // Fixed distribution point
    | 'EVACUATION_CENTER'           // Service at evacuation/shelter location
    | 'REMOTE_DIGITAL'              // Online/digital service delivery
    | 'COMMUNITY_HUB'               // Local community center
    | 'DOOR_TO_DOOR'               // Direct delivery to affected individuals
    | 'PICKUP_POINT';              // Designated pickup location

// Core Interfaces
export interface ReliefService {
    id: string;
    name: string;
    description: string;
    category: ReliefServiceCategory;
    organization: string;           // Relief organization providing service

    // Service configuration
    isActive: boolean;
    isEmergencyService: boolean;    // Can be activated for emergencies
    requiresDocuments: boolean;
    avgResponseTime: number;        // in minutes
    cost?: number;                  // Usually free for disaster relief

    // Capacity and availability
    maxDailyCapacity: number;
    currentCapacity: number;
    deliveryMethods: ServiceDeliveryMethod[];

    // Disaster context
    disasterTypes: DisasterType[];  // Which disasters this service responds to
    geographicCoverage: {
        radius: number;               // Service radius in kilometers
        regions: string[];            // Specific regions covered
        excludedAreas?: string[];     // Areas not covered
    };

    // Requirements and eligibility
    requiredDocuments: string[];
    eligibilityCriteria?: string;
    vulnerablePopulationPriority: boolean; // Elderly, disabled, children first

    // Contact and location info
    primaryLocation: string;
    mobileUnits?: {
        id: string;
        location: GeoPoint;
        capacity: number;
        isActive: boolean;
    }[];
    contactInfo: {
        emergencyPhone?: string;
        phone?: string;
        email?: string;
        website?: string;
        radioChannel?: string;        // For emergency communications
        address: string;
    };

    // AI and technology features
    aiAssessmentEnabled: boolean;   // Uses AI for damage/need assessment
    offlineCapable: boolean;        // Can operate without internet
    realTimeTracking: boolean;      // Provides real-time status updates

    createdAt: Date;
    updatedAt: Date;

    // Relations specific to relief operations
    reliefRequests?: ReliefServiceRequest[];
    volunteers?: VolunteerAssignment[];
    resources?: ResourceAllocation[];
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
    service?: ReliefService;
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
    service?: ReliefService;
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

// Updated request interface for relief services
export interface ReliefServiceRequest {
    id: string;
    serviceId: string;
    userId: string;

    // Request details
    requestedDate: Date;
    urgencyLevel: ReliefServicePriority;
    peopleAffected: number;

    // Disaster context
    disasterType?: DisasterType;
    disasterDate?: Date;
    damageLevel: 'MINOR' | 'MODERATE' | 'SEVERE' | 'CATASTROPHIC';

    // Location and logistics
    location: GeoPoint;
    address: string;
    accessibilityNotes?: string;    // Road conditions, safety concerns

    // AI assessment data
    aiDamageAssessment?: {
        confidenceScore: number;
        damageCategories: string[];
        estimatedCost: number;
        priority: ReliefServicePriority;
        photoAnalysis: {
            photoUrl: string;
            detectedDamage: string[];
            severity: number;
        }[];
    };

    // Status and tracking
    status: 'SUBMITTED' | 'ASSESSED' | 'APPROVED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    assignedVolunteers?: string[];
    estimatedCompletionTime?: Date;

    // Evidence and documentation
    photos: string[];
    documents: string[];

    // Communication
    preferredContactMethod: 'PHONE' | 'SMS' | 'EMAIL' | 'IN_PERSON' | 'RADIO';
    languagePreference?: string;

    // Special needs
    hasVulnerablePopulation: boolean;
    vulnerabilityDetails?: {
        elderly: boolean;
        disabled: boolean;
        children: boolean;
        medicalNeeds: string[];
        mobilityLimitations: string[];
    };

    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;

    // Relations
    service?: ReliefService;
    user?: {
        id: string;
        email: string;
        profile?: {
            firstName: string;
            lastName: string;
            phoneNumber?: string;
            emergencyContact?: string;
        };
    };
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
    serviceType: DisasterType;
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
    category?: ReliefServiceCategory;
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

// Additional types for SmartRelief ecosystem
export interface VolunteerAssignment {
    id: string;
    volunteerId: string;
    serviceId: string;
    skillsRequired: string[];
    location: GeoPoint;
    status: 'ASSIGNED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED';
    safetyCheckIn: boolean;
}

export interface ResourceAllocation {
    id: string;
    serviceId: string;
    resourceType: string;
    quantity: number;
    allocated: number;
    location: GeoPoint;
    expiryDate?: Date;
}

// Search parameters for relief services
export interface ReliefServiceSearchParams {
    category?: ReliefServiceCategory;
    organization?: string;
    location?: GeoPoint;
    radius?: number;
    urgencyLevel?: ReliefServicePriority;
    disasterType?: DisasterType;
    availableNow?: boolean;
    offlineCapable?: boolean;
    vulnerablePopulationSupport?: boolean;
    query?: string;
}