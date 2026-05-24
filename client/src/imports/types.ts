import type { LucideIcon } from 'lucide-react';

// CREATE TRIP

export interface SelectedService {
  id: number;
  name: string;
  category: string | null;
  min_cost: number;
  max_cost: number;
  image: string | null;
  address: string | null;
  location: { lat: number; lng: number } | null;
}

export interface TripData {
  destinations: string[];
  title: string;
  description: string;
  category: string;
  difficulty: string;
  startDate: string;
  endDate: string;
  meetingLocations: MeetingLocation[];
  itinerary: { summary: string; details: string }[];
  activities: string[];
  customActivities: string[];
  included: string[];
  excluded: string[];
  whatToBring: string[];
  selectedServices: SelectedService[];
  maxParticipants: number;
  minParticipants: number;
  pricePerPerson: number;
  coverImage: string;
  additionalImages: Array<{ data: string; name: string; type: string }>;
  scope: "public" | "private";
}

export interface MeetingLocation {
  location: string;
  time: string;
  lat?: number;
  lng?: number;
  address?: string;
  placeId?: string;
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
  id: string;
  name: string;
  type: string;
  region: string;
  image: string;
  rating: number;
  reviews: number;
  peopleVisiting: number;
  tripsAvailable: number;
  category: string;
  description: string;
  isFavorite: boolean;
  lat?: number;
  lng?: number;
  location?: unknown;
  best_periods: string[]; // "MM-DD:MM-DD" format
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
  socialLinks: { [key: string]: string };
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