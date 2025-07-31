// Donation Types
export type DonationType = 'monetary' | 'resource' | 'service';

export type DonationStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export interface MonetaryDonation {
  id: string;
  donorId: string;
  amount: number;
  currency: string;
  type: 'one_time' | 'recurring';
  frequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  status: DonationStatus;
  paymentMethod: {
    type: 'credit_card' | 'bank_transfer' | 'paypal' | 'crypto';
    last4?: string;
    brand?: string;
  };
  paymentId: string;
  allocation?: DonationAllocation[];
  impact?: DonationImpact;
  taxDeductible: boolean;
  receiptUrl?: string;
  donorMessage?: string;
  isAnonymous: boolean;
  campaignId?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceDonation {
  id: string;
  donorId: string;
  resourceId: string;
  estimatedValue: number;
  currency: string;
  pickupRequired: boolean;
  pickupAddress?: string;
  pickupScheduled?: Date;
  deliveryMethod: 'pickup' | 'delivery' | 'drop_off';
  status: DonationStatus;
  condition: 'new' | 'good' | 'fair';
  photos: string[];
  description: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceDonation {
  id: string;
  donorId: string;
  serviceType: string;
  description: string;
  estimatedValue: number;
  currency: string;
  duration: number; // in hours
  skills: string[];
  availability: {
    start: Date;
    end: Date;
    flexible: boolean;
  };
  status: DonationStatus;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export type Donation = MonetaryDonation | ResourceDonation | ServiceDonation;

export interface DonationAllocation {
  aidRequestId: string;
  amount: number;
  percentage: number;
  allocationDate: Date;
  impact?: string;
}

export interface DonationImpact {
  peopleHelped: number;
  aidRequestsFulfilled: number;
  resourcesProvided: {
    category: string;
    quantity: number;
    unit: string;
  }[];
  geographicReach: {
    cities: string[];
    countries: string[];
  };
  timeToImpact: number; // hours from donation to first impact
  multiplierEffect: number; // how many additional people were helped indirectly
  stories: ImpactStory[];
  updatedAt: Date;
}

export interface ImpactStory {
  id: string;
  title: string;
  description: string;
  images?: string[];
  beneficiaryId?: string;
  location: string;
  date: Date;
  verified: boolean;
}

// Donor Profile
export interface DonorProfile {
  userId: string;
  preferredCategories: string[];
  donationPreferences: {
    preferredAmount: number;
    preferredFrequency: 'one_time' | 'monthly' | 'quarterly';
    maxDistance: number; // for local giving
    taxDeductibleOnly: boolean;
    anonymousGiving: boolean;
  };
  totalDonated: {
    amount: number;
    currency: string;
  };
  donationHistory: {
    totalDonations: number;
    firstDonationDate: Date;
    lastDonationDate: Date;
    averageDonation: number;
    largestDonation: number;
  };
  impactSummary: {
    totalPeopleHelped: number;
    totalAidRequestsFulfilled: number;
    favoriteCategory: string;
  };
  taxInfo?: {
    taxpayerName: string;
    taxId: string;
    address: string;
    country: string;
  };
  communicationPreferences: {
    impactUpdates: boolean;
    donationReceipts: boolean;
    campaignUpdates: boolean;
    emergencyAlerts: boolean;
  };
}

// Campaign Types
export interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  targetAmount: number;
  currency: string;
  currentAmount: number;
  donorCount: number;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  organizationId: string;
  relatedDisaster?: string;
  updates: CampaignUpdate[];
  donations: string[]; // donation IDs
  impactGoals: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignUpdate {
  id: string;
  title: string;
  content: string;
  images?: string[];
  author: string;
  publishedAt: Date;
  impactData?: {
    peopleHelped: number;
    resourcesDistributed: number;
    milestonesAchieved: string[];
  };
}
