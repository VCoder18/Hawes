import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';
import { Trip } from 'src/trips/entities/trips.entity';
import { DashboardQueryDto } from './dto/query.dto';
import { TripsQueryDto, TripsQueryFilter } from 'src/trips/dto/query.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly supabaseClient: SupabaseClient<Database>) {}

  async getUserTrips(
    userId: string,
    query: DashboardQueryDto,
  ): Promise<Trip[]> {
    let tripsQuery = this.supabaseClient
      .from('trips')
      .select('*')
      .eq('organizer', userId);

    if (query.status) {
      tripsQuery.eq('status', query.status);
    }

    const { error, data: trips } = await new TripsQueryFilter(
      query,
      this.supabaseClient,
    ).apply(tripsQuery, userId);

    if (error || !trips) {
      throw new InternalServerErrorException('Failed to fetch user trips');
    }

    return trips;
  }

  async getUserHistory(userId: string, query: TripsQueryDto): Promise<Trip[]> {
    let tripsQuery = this.supabaseClient
      .from('trips')
      .select('*, trip_participants!inner(user_id)')
      .eq('trip_participants.user_id', userId);

    const { error, data: trips } = await new TripsQueryFilter(
      query,
      this.supabaseClient,
    ).apply(tripsQuery, userId);

    if (error || !trips) {
      throw new InternalServerErrorException(
        'Failed to fetch user participated trips',
      );
    }

    return trips;
  }
}
