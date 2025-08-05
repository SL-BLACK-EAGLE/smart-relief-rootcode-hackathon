import { GeoPoint, Address } from './aid-request.types';

// Resource Types
export type ResourceCategory = 
  | 'food'
  | 'water'
  | 'medical_supplies'
  | 'clothing'
  | 'shelter_materials'
  | 'tools'
  | 'communication_equipment'
  | 'transportation'
  | 'fuel'
  | 'other';

export type ResourceStatus = 
  | 'AVAILABLE'
  | 'ALLOCATED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'EXPIRED';

export interface Resource {
  id: string;
  name: string;
  description: string;
  category: ResourceCategory;
  subCategory?: string;
  quantity: number;
  unit: string;
  condition: 'new' | 'good' | 'fair' | 'poor';
  location: GeoPoint;
  address: Address;
  status: ResourceStatus;
  providerId: string; // User ID of provider (donor/organization)
  providerType: 'individual' | 'organization' | 'government';
  expiryDate?: Date;
  specialRequirements?: string[];
  images: string[];
  estimatedValue?: number;
  currency?: string;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceAllocation {
  id: string;
  resourceId: string;
  aidRequestId: string;
  allocatedQuantity: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  allocationDate: Date;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  deliveryMethod: 'pickup' | 'delivery' | 'volunteer_transport';
  assignedVolunteers: string[];
  notes?: string;
}

export interface ResourceMatching {
  aidRequestId: string;
  matches: ResourceMatch[];
  totalScore: number;
  generatedAt: Date;
}

export interface ResourceMatch {
  resource: Resource;
  score: number;
  factors: {
    categoryMatch: number;
    proximityScore: number;
    quantityMatch: number;
    availabilityScore: number;
    conditionScore: number;
  };
  distance: number; // in kilometers
  estimatedDeliveryTime: number; // in hours
}
