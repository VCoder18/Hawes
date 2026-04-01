import { Database } from 'src/database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export enum UserRole {
  TRAVELER = 'traveler',
  ORGANIZATION = 'organization',
  AGENCY = 'agency',
  SERVICES = 'services',
}
