import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { Database } from 'src/database.types';

export type Trip = Database['public']['Tables']['trips']['Row'];

export type DestinationCategory =
  Database['public']['Enums']['destination_category'];

export enum TripDifficulty {
  Easy = 'easy',
  Moderate = 'moderate',
  Challenging = 'challenging',
  Difficult = 'difficult',
}

export enum TripCategory {
  Adventure = 'adventure',
  Cultural = 'cultural',
  Nature = 'nature',
  Historical = 'historical',
  Relaxation = 'relaxation',
  Photography = 'photography',
}

export enum TripStatus {
  Draft = 'draft',
  Published = 'published',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum GeographyType {
  Point = 'Point',
}

export type TripAffiliation =
  Database['public']['Tables']['trip_participants']['Row'];

type GeographyBase = {
  type: GeographyType;
  coordinates: [number, number];
};

export class Geography implements GeographyBase {
  @IsEnum(GeographyType)
  public type: GeographyType;

  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  public coordinates: [number, number];

  constructor(type: GeographyType, coordinates: [number, number]) {
    this.type = type;
    this.coordinates = coordinates;
  }
}
