// User Types
export type UserRole = 'victim' | 'donor' | 'volunteer' | 'admin' | 'organization';

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  profile: UserProfile;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  languages: string[];
  timezone: string;
  emergencyContact?: EmergencyContact;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

// Authentication Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role?: UserRole;
}

export interface RegisterData {
  email: string;
  password: string;
  role: UserRole;
  profile: Partial<UserProfile>;
  acceptTerms: boolean;
}
