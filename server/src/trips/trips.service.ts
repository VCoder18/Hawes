import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';
import { TripCreateDTO } from './dto/create.dto';
import { TripUpdateDTO } from './dto/update.dto';
import { Trip } from './entities/trips.entity';

@Injectable()
export class TripsService {
  constructor(
    @Inject(SupabaseClient)
    private readonly supabaseClient: SupabaseClient<Database>,
  ) {}

  /// @Return: all trips
  async getTrips(): Promise<Array<Trip>> {
    const { data, error } = await this.supabaseClient.from('trips').select('*');
    if (error || !data) {
      throw new InternalServerErrorException(
        "Can't fetch trips at the instant",
      );
    }
    return data;
  }

  /// @Return: the trip with the given id
  async getTripById(id: string): Promise<Trip> {
    const { data: trip, error } = await this.supabaseClient
      .from('trips')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  /// @Return: the added trip
  async addTrip(userId: string, trip: TripCreateDTO): Promise<Trip> {
    const { error, data } = await this.supabaseClient
      .from('trips')
      .insert({
        ...trip,
        images: [], // TODO: file uploads
        organizer: userId,
      })
      .select()
      .single();
    if (error || !data) {
      throw new BadRequestException('Failed to create trip');
    }
    return data;
  }

  /// @Return: the updated trip fields
  async updateTrip(
    userId: string,
    id: string,
    trip: TripUpdateDTO,
  ): Promise<Trip> {
    const { data: existing, error: fetchError } = await this.supabaseClient
      .from('trips')
      .select('id, organizer')
      .eq('id', id)
      .single();
    if (fetchError || !existing) {
      throw new NotFoundException('Trip not found');
    }
    if (existing.organizer !== userId) {
      throw new UnauthorizedException();
    }
    const { data, error } = await this.supabaseClient
      .from('trips')
      .update(trip)
      .eq('id', id)
      .select()
      .single();
    if (error || !data) {
      throw new BadRequestException('Failed to update trip');
    }
    return data;
  }

  /// @Return: the id of the deleted trip
  async deleteTrip(userId: string, id: string): Promise<string> {
    const { data: existing, error: fetchError } = await this.supabaseClient
      .from('trips')
      .select('id, organizer')
      .eq('id', id)
      .single();
    if (fetchError || !existing) {
      throw new NotFoundException('Trip not found');
    }
    if (existing.organizer !== userId) {
      throw new UnauthorizedException();
    }
    const { error } = await this.supabaseClient
      .from('trips')
      .delete()
      .eq('id', id);
    if (error) {
      throw new BadRequestException('Failed to delete trip');
    }
    return id;
  }
}
