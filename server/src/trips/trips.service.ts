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
import { Trip, TripAffiliation } from './entities/trips.entity';
import {
  paginatedResponse,
  PaginatedResponseDto,
} from 'src/common/dto/paginated-response.dto';
import { applySupabaseQuery } from 'src/common/utils/query-builder';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class TripsService {
  constructor(
    @Inject(SupabaseClient)
    private readonly supabaseClient: SupabaseClient<Database>,
  ) {}

  /// @Return: all trips
  async getTrips(query: QueryDto): Promise<PaginatedResponseDto<Trip>> {
    let qb = applySupabaseQuery(this.supabaseClient, 'trips', query, {
      searchFields: ['title', 'description'],
      allowedFilters: ['organizer'],
      allowedSortFields: [
        'title',
        'created_at',
        'start_date',
        'end_date',
        'price',
        'difficulty',
        'status',
        'start_date',
      ],
      defaultSort: 'start_date',
    });

    const { data, error, count } = await qb;

    if (error || !data || count === null) {
      throw new InternalServerErrorException(
        "Can't fetch trips at the instant",
      );
    }

    return paginatedResponse(data as Trip[], count, query);
  }

  /// @Return: the trip with the given id
  async getTripById(tripId: string): Promise<Trip> {
    const { data: trip, error } = await this.supabaseClient
      .from('trips')
      .select('*')
      .eq('id', tripId)
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

  /// @Return: a trip affiliation record
  async joinTrip(userId: string, tripId: string): Promise<TripAffiliation> {
    const { data: affiliations } = await this.supabaseClient
      .from('trip_participants')
      .select('*')
      .eq('trip_id', tripId);

    if (affiliations) {
      if (affiliations.some((p) => p.user_id === userId)) {
        throw new BadRequestException(
          'You are already participating in the trip',
        );
      }

      const { error, data: trip } = await this.supabaseClient
        .from('trips')
        .select('id, max_participants')
        .eq('id', tripId)
        .single();

      if (error || !trip) {
        throw new BadRequestException('Trip not found');
      }

      if (
        trip.max_participants &&
        trip.max_participants <= affiliations.length
      ) {
        throw new BadRequestException('Trip is full');
      }
    }

    const { error, data } = await this.supabaseClient
      .from('trip_participants')
      .insert({
        user_id: userId,
        trip_id: tripId,
      })
      .select('*')
      .single();

    if (error || !data) {
      console.error(error);
      throw new BadRequestException('Failed to join trip');
    }

    return data;
  }

  /// @Return: affiliation record id
  async leaveTrip(userId: string, affiliationId: string): Promise<string> {
    const { error: fetchError, data: affiliation } = await this.supabaseClient
      .from('trip_participants')
      .select('*')
      .eq('id', affiliationId)
      .single();

    if (fetchError || !affiliation) {
      throw new BadRequestException('Affiliation to the trip not found');
    }

    if (affiliation.user_id !== userId) {
      throw new UnauthorizedException('You are not affiliated to this trip');
    }

    const { error } = await this.supabaseClient
      .from('trip_participants')
      .delete()
      .eq('id', affiliationId);

    if (error) {
      console.error(error);
      throw new BadRequestException('Failed to leave the trip.');
    }

    return affiliationId;
  }
}
