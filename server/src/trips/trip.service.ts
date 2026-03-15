import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';
import { CreateTripDTO } from './dto/create.dto';

export interface Trip {
  id: number;
  author: string;
  title: string;
  content: string | null;
  from: unknown;
  to: unknown;
  created_at: string;
}

@Injectable()
export class TripService {
  constructor(private readonly supabaseClient: SupabaseClient<Database>) {}

  /// @Return: all trips
  async getTrips(): Promise<Array<CreateTripDTO>> {
    const { data, error } = await this.supabaseClient.from('trips').select('*');
    if (error || !data) {
      throw new InternalServerErrorException(
        "Couldn't fetch trips at the instant",
      );
    }
    return data.map(
      (trip) =>
        new CreateTripDTO(
          trip.id,
          trip.author,
          trip.title,
          trip.content,
          trip.from,
          trip.to,
          trip.created_at,
        ),
    );
  }

  /// @Return: the trip with the given id
  async getTripById(tripId: number) {
    const { data: trip, error } = await this.supabaseClient
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();
    if (error || !trip) {
      throw new NotFoundException('Trip not found');
    }
    return new CreateTripDTO(
      trip.id,
      trip.author,
      trip.title,
      trip.content,
      trip.from,
      trip.to,
      trip.created_at,
    );
  }

  /// @Return: the added trip
  async addTrip(trip: CreateTripDTO) {
    // TODO: validate trip fields
    if (!trip) {
      throw new BadRequestException('Missing trip data');
    }
    const { error } = await this.supabaseClient.from('trips').insert({
      id: trip.id,
      author: trip.author,
      title: trip.title,
      content: trip.content,
      from: trip.from,
      to: trip.to,
      created_at: trip.created_at,
    });
    if (error) {
      // TODO: better logging
      throw new BadRequestException('Failed to add trip');
    }
    return trip;
  }

  /// @Return: the updated trip fields
  async updateTrip(tripId: number, trip: CreateTripDTO) {
    // TODO: validate trip fields
    if (!trip) {
      throw new BadRequestException('Missing valid trip');
    }
    const { error } = await this.supabaseClient
      .from('trips')
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
  async deleteTrip(tripId: number) {
    const { error } = await this.supabaseClient
      .from('trips')
      .delete()
      .eq('id', tripId);
    if (error) {
      throw new BadRequestException('Failed to delete trip');
    }
    return tripId;
  }
}
