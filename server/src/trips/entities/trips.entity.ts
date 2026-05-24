import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Database } from 'src/database.types';

export type Trip = Database['public']['Tables']['trips']['Row'] & {
  visibility?: TripVisibility;
  invite_code?: string;
};

export type TripStop = Database['public']['Tables']['trip_stops']['Row'];

export type StopServiceData = {
  id: number;
  name: string;
  category: string | null;
  procedure: unknown;
  min_cost: number;
  max_cost: number;
  image: string | null;
  address: string | null;
};

export type TripStopWithService = TripStop & {
  service_data?: StopServiceData | null;
};

export type OrganizerProfile = {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  location: string | null;
  role: string | null;
};

export type TripWithStops = Trip & { 
  stops: TripStopWithService[];
  organizer_profile?: OrganizerProfile | null;
};

export type TripWithMeetingPoint = Trip & {
  meeting_point: string | null;
};

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

export enum DestinationCategory {
  Beach = 'beach',
  Mountain = 'mountain',
  Desert = 'desert',
  Forest = 'forest',
  Historic = 'historic',
  City = 'city',
}

export enum TripStatus {
  Draft = 'draft',
  Published = 'published',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum TripVisibility {
  Public = 'public',
  Private = 'private',
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

  /*
   * Multipart form-data submits nested values as strings.
   * Coerce coordinates to numbers before IsNumber validation so
   * stops[i].location.coordinates passes for /trips create requests.
   */
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  public coordinates: [number, number];

  constructor(type: GeographyType, coordinates: [number, number]) {
    this.type = type;
    this.coordinates = coordinates;
  }
}
