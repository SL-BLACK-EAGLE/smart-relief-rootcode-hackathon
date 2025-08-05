import { GeoPoint, Address } from './aid-request.types';

// Volunteer Types
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Skill {
  name: string;
  level: SkillLevel;
  certifications?: string[];
  yearsOfExperience?: number;
}

export interface Availability {
  daysOfWeek: number[]; // 0-6 (Sunday = 0)
  timeRanges: TimeRange[];
  timezone: string;
  maxHoursPerWeek?: number;
  emergencyAvailable: boolean;
}

export interface TimeRange {
  start: string; // HH:mm format
  end: string;   // HH:mm format
}

export interface VolunteerProfile {
  userId: string;
  skills: Skill[];
  availability: Availability;
  maxTravelDistance: number; // in kilometers
  hasVehicle: boolean;
  vehicleCapacity?: number;
  languages: string[];
  backgroundCheck: {
    completed: boolean;
    completedAt?: Date;
    expiresAt?: Date;
    level: 'basic' | 'enhanced' | 'dbs';
  };
  emergencyTraining: {
    firstAid: boolean;
    cpr: boolean;
    emergencyResponse: boolean;
    certificationDates: Record<string, Date>;
  };
  rating: number;
  totalHours: number;
  completedTasks: number;
  isActive: boolean;
  joinedAt: Date;
  lastActiveAt: Date;
}

// Task Types
export type TaskCategory = 
  | 'rescue'
  | 'medical_assistance'
  | 'delivery'
  | 'transportation'
  | 'debris_cleanup'
  | 'shelter_setup'
  | 'food_distribution'
  | 'damage_assessment'
  | 'communication'
  | 'logistics'
  | 'administration'
  | 'other';

export type TaskStatus = 
  | 'OPEN'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  requiredSkills: string[];
  minimumVolunteers: number;
  maximumVolunteers: number;
  estimatedDuration: number; // in hours
  location: GeoPoint;
  address: Address;
  contactPerson: {
    name: string;
    phone: string;
    email?: string;
  };
  safetyRequirements: string[];
  equipment: string[];
  status: TaskStatus;
  createdBy: string;
  assignedVolunteers: TaskAssignment[];
  relatedAidRequests: string[];
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  completionNotes?: string;
  photos?: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskAssignment {
  volunteerId: string;
  assignedAt: Date;
  acceptedAt?: Date;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'no_show';
  checkInTime?: Date;
  checkOutTime?: Date;
  hoursLogged: number;
  performance?: {
    rating: number;
    feedback: string;
    punctuality: number;
    communication: number;
    skillLevel: number;
  };
  expenses?: TaskExpense[];
}

export interface TaskExpense {
  type: 'fuel' | 'food' | 'equipment' | 'other';
  amount: number;
  currency: string;
  description: string;
  receiptUrl?: string;
  approvedBy?: string;
  approvedAt?: Date;
}

// Volunteer Matching
export interface VolunteerMatch {
  volunteer: VolunteerProfile;
  task: VolunteerTask;
  matchScore: number;
  factors: {
    skillMatch: number;
    availabilityMatch: number;
    proximityScore: number;
    experienceMatch: number;
    reliabilityScore: number;
  };
  distance: number;
  estimatedTravelTime: number;
}
