import { Database } from 'src/database.types';
import {
  Geography,
  Trip,
  TripDifficutly,
  TripStatus,
} from '../entities/trips.entity';

type TripInsert = Omit<
  Database['public']['Tables']['trips']['Insert'],
  'meeting_points'
> & {
  meeting_points: Geography[];
};

export class TripCreateDTO implements Omit<
  TripInsert,
  'id' | 'created_at' | 'updated_at' | 'organizer'
> {
  public activities?: string[] | null;
  public description?: string | null;
  public difficulty: TripDifficutly;
  public end_date: string;
  public images: string[];
  public itinerary?: string | null;
  public max_participants?: number | null;
  public meeting_points: Geography[];
  public min_participants?: number | null;
  public price?: number | null;
  public start_date: string;
  public status?: TripStatus;
  public title: string;
  public what_to_bring?: string | null;

  constructor() {
    this.difficulty = 'easy';
    this.end_date = this.start_date = this.title = '';
    this.images = this.meeting_points = [];
  }

  static fromTrip(trip: Trip): TripCreateDTO {
    const new_trip = new TripCreateDTO();
    new_trip.activities = trip.activities;
    new_trip.description = trip.description;
    new_trip.difficulty = trip.difficulty;
    new_trip.end_date = trip.end_date;
    new_trip.images = trip.images;
    new_trip.itinerary = trip.itinerary;
    new_trip.max_participants = trip.max_participants;
    new_trip.meeting_points = trip.meeting_points;
    new_trip.min_participants = trip.min_participants;
    new_trip.price = trip.price;
    new_trip.start_date = trip.start_date;
    new_trip.status = trip.status;
    new_trip.title = trip.title;
    new_trip.what_to_bring = trip.what_to_bring;
    return new_trip;
  }
}
