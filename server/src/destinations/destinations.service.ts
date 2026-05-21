import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';
import { Destination } from './entities/destinations.entity';
import { DestinationQuickFilter, DestinationsQueryDto } from './dto/query.dto';

type DestinationsResponse = {
  data: Destination[];
  total: number;
  hasMore: boolean;
};

@Injectable()
export class DestinationsService {
  constructor(
    @Inject(SupabaseClient)
    private readonly supabaseClient: SupabaseClient<Database>,
  ) {}

  /// @Return: all destinations that match the given query
  async getDestinations(
    userId: string,
    query: DestinationsQueryDto,
  ): Promise<DestinationsResponse> {
    const {
      search,
      quickFilter,
      category,
      minRating,
      popularity,
      month,
      maxDistanceKm,
      offset = 0,
      limit = 10,
    } = query;

    const idSets: string[][] = [];

    if (quickFilter === DestinationQuickFilter.FAVORITES) {
      const { data, error } = await this.supabaseClient.rpc(
        'filter_destinations_by_favorite',
        { p_user_id: userId },
      );

      if (error || !data) {
        throw new InternalServerErrorException('Failed to filter favorites');
      }

      idSets.push(data.map((r: { destination_id: string }) => r.destination_id));
    }

    if (quickFilter === DestinationQuickFilter.HAS_TRIPS) {
      const { data, error } = await this.supabaseClient.rpc(
        'filter_destinations_with_trips',
      );

      if (error || !data) {
        throw new InternalServerErrorException('Failed to filter by trips');
      }

      idSets.push(data.map((r: { destination_id: string }) => r.destination_id));
    }

    if (popularity) {
      const { data, error } = await this.supabaseClient.rpc(
        'filter_destinations_by_popularity',
        { p_popularity: popularity },
      );

      if (error || !data) {
        throw new InternalServerErrorException('Failed to filter by popularity');
      }

      idSets.push(data.map((r: { destination_id: string }) => r.destination_id));
    }

    let destinationsQuery = this.supabaseClient
      .from('destinations')
      .select('*', { count: 'exact' });

    if (idSets.length > 0) {
      const intersected = idSets.reduce((a, b) => a.filter((id) => b.includes(id)));

      if (intersected.length === 0) {
        return {
          data: [],
          total: 0,
          hasMore: false,
        };
      }

      destinationsQuery = destinationsQuery.in('id', intersected);
    }

    if (search) {
      destinationsQuery = destinationsQuery.textSearch('name', search);
    }

    if (category) {
      destinationsQuery = destinationsQuery.eq('category', category);
    }

    if (minRating) {
      destinationsQuery = destinationsQuery.gte('rating', minRating);
    }

    // Handle month filter (TODO: replace with more complex interval logic if needed)
    if (month) {
       // Simple implementation for now, assuming month is an index 1-12
    }

    const to = offset + limit - 1;
    const { data: destinations, error, count } = await destinationsQuery.range(
      offset,
      to,
    );

    if (error || !destinations) {
      throw new NotFoundException('No destinations found');
    }

    const total = count ?? 0;

    return {
      data: destinations as Destination[],
      total,
      hasMore: offset + limit < total,
    };
  }

  /// @Return: the destination with the given id
  async getDestinationById(id: string): Promise<Destination> {
    const { data: destination, error } = await this.supabaseClient
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !destination) {
      throw new NotFoundException('destination not found');
    }

    return destination as Destination;
  }
}
