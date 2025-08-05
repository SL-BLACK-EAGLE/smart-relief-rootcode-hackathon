// Geographic Types
export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Address {
  street?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  coordinates: GeoPoint;
}

// Aid Request Types
export type AidCategory = 
  | 'MEDICAL'
  | 'FOOD'
  | 'WATER'
  | 'SHELTER'
  | 'CLOTHING'
  | 'TRANSPORTATION'
  | 'COMMUNICATION'
  | 'RESCUE'
  | 'EVACUATION'
  | 'OTHER';

export type RequestStatus = 
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'FULFILLED'
  | 'CANCELLED'
  | 'EXPIRED';

export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'LIFE_THREATENING';

export interface AidRequest {
  id: string;
  userId: string;
  location: GeoPoint;
  address: Address;
  category: AidCategory;
  subCategory?: string;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  priorityScore: number;
  requiredQuantity?: number;
  unit?: string;
  images: string[];
  videos?: string[];
  damageAssessment?: DamageAssessment;
  status: RequestStatus;
  assignedVolunteers: string[];
  allocatedResources: string[];
  estimatedCompletion?: Date;
  actualCompletion?: Date;
  feedback?: string;
  rating?: number;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface DamageAssessment {
  severityScore: number; // 1-10
  structuralDamage: boolean;
  waterDamage: boolean;
  fireDamage: boolean;
  debrisPresent: boolean;
  accessibilityIssues: boolean;
  estimatedRepairCost?: number;
  aiAnalysis: {
    confidence: number;
    detectedObjects: string[];
    riskFactors: string[];
  };
}

// Aid Request Filters
export interface AidRequestFilters {
  category?: AidCategory[];
  status?: RequestStatus[];
  urgency?: UrgencyLevel[];
  location?: {
    center: GeoPoint;
    radius: number; // in kilometers
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  priorityRange?: {
    min: number;
    max: number;
  };
}
