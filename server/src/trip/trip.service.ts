import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';

export type TripId = number;

// TODO: create trip interface and CRUD DTOs
export class TripDTO {
  constructor(
    public id: TripId,
    public title: string,
    public content: string,
  ) {}
}

@Injectable()
export class TripService {
  constructor(private readonly supabaseClient: SupabaseClient<Database>) {}

  /// @Return: all trips
  async getTrips(): Promise<Array<TripDTO>> {
    const { data, error } = await this.supabaseClient.from('trip').select('*');
    if (error || !data) {
      throw new NotFoundException('Trips not found');
    }
    return data.map((trip) => new TripDTO(trip.id, trip.title!, trip.content!));
  }

  /// @Return: the trip with the given id
  async getTripById(tripId: number) {
    const { data, error } = await this.supabaseClient
      .from('trip')
      .select('*')
      .eq('id', tripId)
      .single();
    if (error || !data) {
      throw new NotFoundException('Trip not found');
    }
    return new TripDTO(data.id, data.title!, data.content!);
  }

  /// @Return: the added trip
  async addTrip(trip: TripDTO) {
    // TODO: validate trip fields
    if (!trip) {
      throw new BadRequestException('Missing trip data');
    }
    const { error } = await this.supabaseClient.from('trip').insert({
      id: trip.id,
      title: trip.title,
      content: trip.content,
    });
    if (error) {
      // TODO: better logging
      throw new BadRequestException('Failed to add trip');
    }
    return trip;
  }

  /// @Return: the updated trip fields
  async updateTrip(tripId: number, trip: TripDTO) {
    // TODO: validate trip fields
    if (!trip) {
      throw new BadRequestException('Missing valid trip');
    }
    const { error } = await this.supabaseClient
      .from('trip')
      .update({
        ...(trip.title && { title: trip.title }),
        ...(trip.content && { content: trip.content }),
      })
      .eq('id', tripId);
    if (error) {
      // TODO: better logging
      throw new BadRequestException('Failed to update trip');
    }
    return trip;
  }

  /// @Return: the id of the deleted trip
  async deleteTrip(tripId: TripId) {
    const { error } = await this.supabaseClient
      .from('trip')
      .delete()
      .eq('id', tripId);
    if (error) {
      throw new BadRequestException('Failed to delete trip');
    }
    return tripId;
  }
}
