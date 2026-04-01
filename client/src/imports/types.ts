import type { LucideIcon } from 'lucide-react';

// CREATE TRIP

export interface TripData {
  destinations: string[];
  title: string;
  description: string;
  category: string;
  difficulty: string;
  startDate: string;
  endDate: string;
  meetingLocations: { location: string; time: string }[];
  itinerary: string;
  activities: string[];
  customActivities: string[];
  included: string[];
  whatToBring: string;
  maxParticipants: number;
  minParticipants: number;
  pricePerPerson: number;
  coverImage: string;
  additionalImages: Array<{ data: string; name: string; type: string }>;
  scope: "public" | "private";
}

export interface Filters {
  type: string[];
  services: string[];
  events: string;
  distance: string;
  rating: number;
}

// BROWSE DESTINATIONS

export interface Destination {
  id: number;
  name: string;
  type: string;
  region: string;
  image: string;
  rating: number;
  reviews: number;
  peopleVisiting: number;
  availableEvents: number;
  tripsAvailable: number;
  category: string;
  isFavorite: boolean;
}

export interface Filters {
  type: string[];
  services: string[];
  events: string;
  distance: string;
  rating: number;
}

export interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
}

// PROFILE

export interface ProfilePost {
  img: string;
  views: string;
  icon: string;
  likes: number;
  comments: number;
  showOverlay?: boolean;
}

export interface ProfileStats {
  tripsCreated: number;
  tripsJoined: number;
  destinations: number;
  followers: string;
}

export interface RecommendedItem {
  id: string;
  image: string;
  title: string;
  description: string;
  rating: number;
}

export interface FollowerImage {
  url: string;
  alt: string;
}

// EDIT PROFILE

export interface SettingsMenuItem {
  id: string;
  label: string;
  active: boolean;
}

export interface SocialLink {
  id: string;
  icon: React.ElementType;
  placeholder: string;
  label: string;
}

export interface EditProfileFormData {
  displayName: string;
  username: string;
  bio: string;
  email: string;
  location: string;
  website: string;
  role: UserRole;
  socialLinks: Record<string, string>;
  privacySettings: {
    profileVisibility: boolean;
    showActivityStatus: boolean;
    showTripHistory: boolean;
  };
}

// Roles Definitions
export type UserRole = 'traveler' | 'organization' | 'agency' | 'services';

export interface UserVerificationRequest {
  professionalEmail: string;
  phoneNumber: string;
  requestedRole: UserRole;
  status: 'pending' | 'approved' | 'rejected';
}