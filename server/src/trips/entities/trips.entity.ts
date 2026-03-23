import { Database } from 'src/database.types';

export type Trip = Database['public']['Tables']['trips']['Row'];
export type DestinationCategory =
  Database['public']['Enums']['destination_category'];
export type TripDifficutly = Database['public']['Enums']['trip_difficulty'];
export type TripStatus = Database['public']['Enums']['trip_status'];

export type Geography = {
  type: 'Point';
  coordinates: [number, number];
};
